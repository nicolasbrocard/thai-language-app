#!/usr/bin/env python3
"""
Merge PDFs and Images into a single PDF.
Usage: merge_app.py [file1] [file2] ...

Integrates with Windows Explorer right-click context menu.

Multi-file IPC design
─────────────────────
Explorer launches one process per selected file (MultiSelectModel=Player).
  • The first process acquires a Windows Named Mutex, then immediately binds
    a TCP socket (BEFORE loading PyQt5, which is slow).  Incoming files from
    secondary processes are buffered in _pending[].
  • Secondary processes see the mutex is taken, connect to the socket,
    send their file path, and exit.  They never load Qt at all.
  • After Qt loads and the window is created, the buffer is drained and a
    QTimer keeps polling for late arrivals.
"""

import sys
import os
import json
import socket
import threading
import time
import ctypes
from io import BytesIO
from pathlib import Path

# ── Constants ──────────────────────────────────────────────────────────────────
SOCKET_PORT  = 47_832
MUTEX_NAME   = "Local\\PdfImageMergeTool_3C9F"
SEND_TIMEOUT = 10.0
SUPPORTED    = {".pdf", ".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif", ".gif", ".webp"}


def is_supported(path: str) -> bool:
    return Path(path).suffix.lower() in SUPPORTED


# ── Quality helpers ────────────────────────────────────────────────────────────
# Slider 1–10  →  JPEG quality 5–95  (linear)
def _jpeg_quality(slider: int) -> int:
    return round(5 + (slider - 1) * 10)


QUALITY_LABELS = {
    10: "Maximum – no compression",
    9:  "Very high",
    8:  "High (recommended)",
    7:  "Good",
    6:  "Medium-high",
    5:  "Medium",
    4:  "Medium-low",
    3:  "Low",
    2:  "Very low",
    1:  "Minimum – very small file",
}


def fmt_size(n: int) -> str:
    if n < 1024:
        return f"{n} B"
    if n < 1024 ** 2:
        return f"{n / 1024:.1f} KB"
    return f"{n / 1024 ** 2:.1f} MB"


# ── Windows Named Mutex (single-instance) ──────────────────────────────────────
def acquire_mutex():
    h = ctypes.windll.kernel32.CreateMutexW(None, True, MUTEX_NAME)
    already = ctypes.windll.kernel32.GetLastError() == 183   # ERROR_ALREADY_EXISTS
    return (not already), h


def release_mutex(h):
    if h:
        ctypes.windll.kernel32.ReleaseMutex(h)
        ctypes.windll.kernel32.CloseHandle(h)


# ── IPC: early server (started BEFORE Qt loads) ────────────────────────────────
_pending: list[str] = []
_pending_lock = threading.Lock()


def start_early_server():
    """Bind the TCP socket immediately so secondary processes can connect fast."""
    srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        srv.bind(("127.0.0.1", SOCKET_PORT))
        srv.listen(20)
    except OSError:
        return None

    def _loop():
        while True:
            try:
                conn, _ = srv.accept()
                data = b""
                while chunk := conn.recv(8192):
                    data += chunk
                conn.close()
                with _pending_lock:
                    _pending.extend(json.loads(data))
            except Exception:
                break

    threading.Thread(target=_loop, daemon=True).start()
    return srv


def attach_pending_to_window(window) -> None:
    """Drain the pre-Qt buffer into the window, then keep polling every 100 ms."""
    from PyQt5.QtCore import QTimer  # noqa: PLC0415

    with _pending_lock:
        for p in list(_pending):
            window._add(p)
        _pending.clear()

    def _poll():
        with _pending_lock:
            while _pending:
                window._add(_pending.pop(0))

    t = QTimer()
    t.timeout.connect(_poll)
    t.start(100)
    window._ipc_timer = t   # prevent GC


# ── IPC: client (secondary processes) ─────────────────────────────────────────
def send_to_instance(files: list, timeout: float = SEND_TIMEOUT) -> bool:
    deadline = time.monotonic() + timeout
    payload  = json.dumps(files).encode()
    while time.monotonic() < deadline:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(0.4)
            s.connect(("127.0.0.1", SOCKET_PORT))
            s.sendall(payload)
            s.close()
            return True
        except OSError:
            time.sleep(0.2)
    return False


# ── Size estimator (runs in a daemon thread) ───────────────────────────────────
def estimate_size_async(files: list, quality: int, on_done) -> None:
    """
    Estimate the merged PDF output size and call on_done(bytes: int | None).
    on_done is called from a background thread — use a pyqtSignal as the callback
    so Qt handles thread-safe delivery to the GUI.
    """
    def _work():
        try:
            from PIL import Image   # noqa: PLC0415
        except ImportError:
            on_done(None)
            return

        jq    = _jpeg_quality(quality)
        total = 0

        for path in files:
            ext = Path(path).suffix.lower()
            try:
                if ext == ".pdf":
                    total += os.path.getsize(path)
                    continue

                img     = Image.open(path).convert("RGB")
                orig_px = img.width * img.height
                # Resize to ≤ 1 MP for speed, then scale the byte count back up
                scale   = min(1.0, (1_000_000 / orig_px) ** 0.5) if orig_px > 1_000_000 else 1.0
                sample  = img.resize(
                    (max(1, int(img.width * scale)), max(1, int(img.height * scale))),
                    Image.BOX,
                ) if scale < 1.0 else img

                buf = BytesIO()
                sample.save(buf, format="JPEG", quality=jq, optimize=True)
                total += int(buf.tell() / (scale ** 2)) + 2048   # +2 KB PDF page overhead

            except Exception:
                try:
                    total += os.path.getsize(path)
                except Exception:
                    pass

        on_done(total)

    threading.Thread(target=_work, daemon=True).start()


# ── Merge worker ───────────────────────────────────────────────────────────────
def _make_worker_class():
    from PyQt5.QtCore import QThread, pyqtSignal   # noqa: PLC0415

    class MergeWorker(QThread):
        progress = pyqtSignal(int)
        done     = pyqtSignal(str)
        failed   = pyqtSignal(str)

        def __init__(self, files: list, output: str, quality: int):
            super().__init__()
            self.files   = files
            self.output  = output
            self.quality = quality

        def run(self):
            try:
                from pypdf import PdfWriter, PdfReader   # noqa: PLC0415
                from PIL import Image                    # noqa: PLC0415

                jq     = _jpeg_quality(self.quality)
                writer = PdfWriter()
                total  = len(self.files)

                for idx, path in enumerate(self.files):
                    ext = Path(path).suffix.lower()
                    if ext == ".pdf":
                        for page in PdfReader(path).pages:
                            writer.add_page(page)
                    else:
                        img    = Image.open(path)
                        frames = self._frames(img)
                        for frame in frames:
                            buf = BytesIO()
                            frame.convert("RGB").save(
                                buf, format="PDF",
                                quality=jq, resolution=150,
                            )
                            buf.seek(0)
                            for page in PdfReader(buf).pages:
                                writer.add_page(page)

                    self.progress.emit(int((idx + 1) / total * 95))

                with open(self.output, "wb") as fh:
                    writer.write(fh)

                self.progress.emit(100)
                self.done.emit(self.output)

            except Exception as exc:
                self.failed.emit(str(exc))

        @staticmethod
        def _frames(img):
            frames = []
            try:
                while True:
                    frames.append(img.copy())
                    img.seek(img.tell() + 1)
            except (EOFError, AttributeError):
                pass
            return frames or [img]

    return MergeWorker


# ── Main window ────────────────────────────────────────────────────────────────
def create_window(initial_files: list):
    from PyQt5.QtWidgets import (   # noqa: PLC0415
        QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
        QPushButton, QListWidget, QListWidgetItem, QLabel,
        QFileDialog, QMessageBox, QProgressBar, QFrame,
        QComboBox, QSizePolicy, QSlider,
    )
    from PyQt5.QtCore import Qt, pyqtSignal, QTimer   # noqa: PLC0415
    from PyQt5.QtGui import QFont                     # noqa: PLC0415

    MergeWorker = _make_worker_class()

    class MainWindow(QMainWindow):
        add_file_signal  = pyqtSignal(str)
        size_est_signal  = pyqtSignal(object)   # int | None, emitted from bg thread

        def __init__(self, files):
            super().__init__()
            self.setWindowTitle("Merge to PDF")
            self.setMinimumSize(580, 600)
            self.resize(660, 660)
            self._est_timer = None

            self.add_file_signal.connect(self._add)
            self.size_est_signal.connect(self._on_size_estimated)

            self._build_ui()
            for f in files:
                self._add(f)

        # ── UI ──────────────────────────────────────────────────────────────

        def _build_ui(self):
            root = QWidget()
            self.setCentralWidget(root)
            lay  = QVBoxLayout(root)
            lay.setSpacing(10)
            lay.setContentsMargins(16, 16, 16, 16)

            title = QLabel("Merge to PDF")
            title.setFont(QFont("Segoe UI", 14, QFont.Bold))
            lay.addWidget(title)

            hint = QLabel(
                "Add PDFs and images, reorder with the arrows, "
                "set a quality and output name, then click Merge."
            )
            hint.setWordWrap(True)
            hint.setStyleSheet("color:#666; font-size:9pt;")
            lay.addWidget(hint)

            # ── File list ────────────────────────────────────────────────────
            list_row = QHBoxLayout()
            self.lst = QListWidget()
            self.lst.setAlternatingRowColors(True)
            self.lst.setStyleSheet(
                "QListWidget {"
                "  border:1px solid #bbb; border-radius:4px;"
                "  font-family:'Segoe UI'; font-size:10pt; }"
                "QListWidget::item { padding:5px 8px; }"
                "QListWidget::item:selected { background:#cce0ff; color:#000; }"
                "QListWidget::item:alternate { background:#f6f6f6; }"
            )
            list_row.addWidget(self.lst)

            side = QVBoxLayout()
            side.setSpacing(4)
            side.addStretch()
            side.addWidget(self._mk_btn("▲", "Move up",   self._move_up))
            side.addWidget(self._mk_btn("▼", "Move down", self._move_down))
            side.addSpacing(8)
            side.addWidget(self._mk_btn("✕", "Remove",    self._delete))
            side.addStretch()
            list_row.addLayout(side)
            lay.addLayout(list_row)

            add_btn = QPushButton("+ Add More Files…")
            add_btn.clicked.connect(self._pick_files)
            lay.addWidget(add_btn)

            lay.addWidget(self._sep())

            # ── Quality slider ────────────────────────────────────────────────
            q_title = QLabel("Output quality:")
            q_title.setFont(QFont("Segoe UI", 10, QFont.Bold))
            lay.addWidget(q_title)

            slider_row = QHBoxLayout()
            slider_row.addWidget(self._dim_lbl("Min"))

            self.q_slider = QSlider(Qt.Horizontal)
            self.q_slider.setRange(1, 10)
            self.q_slider.setValue(8)
            self.q_slider.setTickPosition(QSlider.TicksBelow)
            self.q_slider.setTickInterval(1)
            self.q_slider.setSingleStep(1)
            slider_row.addWidget(self.q_slider)

            slider_row.addWidget(self._dim_lbl("Max"))
            lay.addLayout(slider_row)

            info_row = QHBoxLayout()
            self.q_val_lbl  = QLabel("8 / 10")
            self.q_val_lbl.setFont(QFont("Segoe UI", 9, QFont.Bold))
            info_row.addWidget(self.q_val_lbl)

            self.q_desc_lbl = QLabel(QUALITY_LABELS[8])
            self.q_desc_lbl.setStyleSheet("color:#444; font-size:9pt;")
            info_row.addStretch()
            info_row.addWidget(self.q_desc_lbl)
            lay.addLayout(info_row)

            self.size_lbl = QLabel("Estimated size: —")
            self.size_lbl.setStyleSheet("color:#888; font-size:9pt;")
            lay.addWidget(self.size_lbl)

            self.q_slider.valueChanged.connect(self._on_quality_changed)

            lay.addWidget(self._sep())

            # ── Output name ───────────────────────────────────────────────────
            out_lbl = QLabel("Output file name:")
            out_lbl.setFont(QFont("Segoe UI", 10, QFont.Bold))
            lay.addWidget(out_lbl)

            name_row = QHBoxLayout()
            self.combo = QComboBox()
            self.combo.setEditable(True)
            self.combo.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
            name_row.addWidget(self.combo)
            name_row.addWidget(QLabel(".pdf"))
            lay.addLayout(name_row)

            self.path_hint = QLabel("")
            self.path_hint.setStyleSheet("color:#888; font-size:8pt;")
            self.path_hint.setWordWrap(True)
            lay.addWidget(self.path_hint)

            self.combo.currentTextChanged.connect(self._update_path_hint)

            # ── Progress + Merge button ────────────────────────────────────────
            self.pbar = QProgressBar()
            self.pbar.setVisible(False)
            lay.addWidget(self.pbar)

            self.merge_btn = QPushButton("Merge")
            self.merge_btn.setFixedHeight(38)
            self.merge_btn.setFont(QFont("Segoe UI", 11, QFont.Bold))
            self.merge_btn.setStyleSheet(
                "QPushButton { background:#2563eb; color:white;"
                "              border-radius:5px; border:none; }"
                "QPushButton:hover    { background:#1d4ed8; }"
                "QPushButton:disabled { background:#93c5fd; }"
            )
            self.merge_btn.clicked.connect(self._merge)
            lay.addWidget(self.merge_btn)

        # ── Static helpers ────────────────────────────────────────────────────

        @staticmethod
        def _mk_btn(label, tip, slot):
            b = QPushButton(label)
            b.setFixedWidth(32)
            b.setToolTip(tip)
            b.clicked.connect(slot)
            return b

        @staticmethod
        def _sep():
            f = QFrame()
            f.setFrameShape(QFrame.HLine)
            f.setStyleSheet("color:#ddd;")
            return f

        @staticmethod
        def _dim_lbl(text):
            l = QLabel(text)
            l.setStyleSheet("color:#aaa; font-size:8pt;")
            return l

        # ── File management ────────────────────────────────────────────────────

        def _add(self, path: str):
            path = os.path.normpath(path)
            if not os.path.isfile(path) or not is_supported(path):
                return
            for i in range(self.lst.count()):
                if self.lst.item(i).data(Qt.UserRole) == path:
                    return
            ext  = Path(path).suffix.upper().lstrip(".")
            item = QListWidgetItem(f"[{ext}]  {Path(path).name}")
            item.setData(Qt.UserRole, path)
            self.lst.addItem(item)
            self._sync_combo()
            self._schedule_estimate()

        def _delete(self):
            row = self.lst.currentRow()
            if row >= 0:
                self.lst.takeItem(row)
                self._sync_combo()
                self._schedule_estimate()

        def _move_up(self):
            row = self.lst.currentRow()
            if row > 0:
                self._reorder(row, row - 1)

        def _move_down(self):
            row = self.lst.currentRow()
            if 0 <= row < self.lst.count() - 1:
                self._reorder(row, row + 1)

        def _reorder(self, src: int, dst: int):
            paths = [self.lst.item(i).data(Qt.UserRole) for i in range(self.lst.count())]
            paths[src], paths[dst] = paths[dst], paths[src]
            self.lst.clear()
            for p in paths:
                self._add(p)
            self.lst.setCurrentRow(dst)

        def _pick_files(self):
            paths, _ = QFileDialog.getOpenFileNames(
                self, "Select Files", "",
                "PDFs & Images (*.pdf *.jpg *.jpeg *.png *.bmp *.tiff *.tif *.gif *.webp)"
                ";;All Files (*)",
            )
            for p in paths:
                self._add(p)

        def _paths(self) -> list:
            return [self.lst.item(i).data(Qt.UserRole) for i in range(self.lst.count())]

        # ── Combo / path hint ─────────────────────────────────────────────────

        def _sync_combo(self):
            prev = self.combo.currentText()
            self.combo.blockSignals(True)
            self.combo.clear()
            for i in range(self.lst.count()):
                self.combo.addItem(Path(self.lst.item(i).data(Qt.UserRole)).stem)
            idx = self.combo.findText(prev)
            self.combo.setCurrentIndex(max(0, idx))
            self.combo.blockSignals(False)
            self._update_path_hint()

        def _update_path_hint(self, *_):
            files = self._paths()
            name  = self.combo.currentText().strip()
            if files and name:
                out = Path(files[0]).parent / f"{name}.pdf"
                self.path_hint.setText(f"Output → {out}")
            else:
                self.path_hint.setText("")

        # ── Quality / size estimate ────────────────────────────────────────────

        def _on_quality_changed(self, val: int):
            self.q_val_lbl.setText(f"{val} / 10")
            self.q_desc_lbl.setText(QUALITY_LABELS.get(val, ""))
            self._schedule_estimate()

        def _schedule_estimate(self):
            """Debounce: only run estimation 400 ms after the last change."""
            if self._est_timer:
                self._est_timer.stop()
            t = QTimer()
            t.setSingleShot(True)
            t.timeout.connect(self._run_estimate)
            t.start(400)
            self._est_timer = t

        def _run_estimate(self):
            files   = self._paths()
            quality = self.q_slider.value()
            if not files:
                self.size_lbl.setText("Estimated size: —")
                return
            self.size_lbl.setText("Estimating…")
            # size_est_signal.emit is thread-safe — Qt delivers it on the main thread
            estimate_size_async(files, quality, self.size_est_signal.emit)

        def _on_size_estimated(self, n):
            if n is None:
                self.size_lbl.setText("Estimated size: unavailable")
            else:
                self.size_lbl.setText(f"Estimated output size: ~{fmt_size(n)}")

        # ── Merge ─────────────────────────────────────────────────────────────

        def _merge(self):
            files = self._paths()
            if len(files) < 2:
                QMessageBox.warning(self, "Too few files",
                                    "Please add at least 2 files to merge.")
                return

            name = self.combo.currentText().strip()
            if not name:
                QMessageBox.warning(self, "No output name",
                                    "Please enter an output file name.")
                return

            output = str(Path(files[0]).parent / f"{name}.pdf")

            if os.path.exists(output):
                r = QMessageBox.question(
                    self, "File exists",
                    f'"{Path(output).name}" already exists.\nOverwrite it?',
                    QMessageBox.Yes | QMessageBox.No,
                )
                if r != QMessageBox.Yes:
                    return

            quality = self.q_slider.value()
            self.merge_btn.setEnabled(False)
            self.pbar.setValue(0)
            self.pbar.setVisible(True)

            self._worker = MergeWorker(files, output, quality)
            self._worker.progress.connect(self.pbar.setValue)
            self._worker.done.connect(self._on_done)
            self._worker.failed.connect(self._on_failed)
            self._worker.start()

        def _on_done(self, output: str):
            self.pbar.setVisible(False)
            self.merge_btn.setEnabled(True)
            msg = QMessageBox(self)
            msg.setWindowTitle("Done!")
            msg.setIcon(QMessageBox.Information)
            msg.setText(f"Saved:\n{output}")
            ob = msg.addButton("Open Folder", QMessageBox.AcceptRole)
            msg.addButton("Close", QMessageBox.RejectRole)
            msg.exec_()
            if msg.clickedButton() == ob:
                os.startfile(str(Path(output).parent))

        def _on_failed(self, err: str):
            self.pbar.setVisible(False)
            self.merge_btn.setEnabled(True)
            QMessageBox.critical(self, "Merge failed", err)

    return MainWindow(initial_files)


# ── Entry point ────────────────────────────────────────────────────────────────
def main():
    incoming = [f for f in sys.argv[1:] if os.path.exists(f) and is_supported(f)]

    is_first, mutex = acquire_mutex()

    if not is_first:
        # Secondary process: just forward the file and exit (no Qt needed)
        if incoming:
            ok = send_to_instance(incoming)
            if not ok:
                ctypes.windll.user32.MessageBoxW(
                    0,
                    "Could not connect to the Merge to PDF window.\n"
                    "Please open merge_app.py directly and add files manually.",
                    "Merge to PDF",
                    0x10,
                )
        release_mutex(mutex)
        sys.exit(0)

    # ── First (and only) instance ──────────────────────────────────────────────
    import atexit
    atexit.register(release_mutex, mutex)

    # Start the IPC socket BEFORE loading Qt so secondary processes
    # can connect as soon as the socket is bound — no need to wait for Qt.
    start_early_server()

    try:
        from PyQt5.QtWidgets import QApplication   # noqa: PLC0415
        from PyQt5.QtCore import Qt                # noqa: PLC0415
    except ImportError:
        ctypes.windll.user32.MessageBoxW(
            0,
            "PyQt5 is not installed.\n\n"
            "Please run install.bat to set up all dependencies.",
            "Merge to PDF — Setup Required",
            0x10,
        )
        sys.exit(1)

    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    app.setAttribute(Qt.AA_UseHighDpiPixmaps)

    window = create_window(incoming)
    attach_pending_to_window(window)   # drain buffer + start polling
    window.show()
    window.raise_()
    window.activateWindow()

    sys.exit(app.exec_())


if __name__ == "__main__":
    main()
