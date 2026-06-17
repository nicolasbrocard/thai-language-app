#!/usr/bin/env python3
"""
Merge PDFs and Images into a single PDF.
Usage: merge_app.py [file1] [file2] ...

Integrates with Windows Explorer right-click context menu.
Handles multi-file selection via a Windows Named Mutex + TCP socket:
  - First process acquires the mutex, starts the GUI and IPC server.
  - Subsequent processes (one per selected file, launched by Explorer)
    connect to the server, send their file path, and exit immediately.
"""

import sys
import os
import json
import socket
import threading
import time
import ctypes
import tempfile
from io import BytesIO
from pathlib import Path

# ── Constants ─────────────────────────────────────────────────────────────────

SOCKET_PORT  = 47_832
MUTEX_NAME   = "Local\\PdfImageMergeTool_3C9F"
SEND_TIMEOUT = 8.0   # seconds non-first instances wait for the GUI to open
SUPPORTED    = {".pdf", ".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif", ".gif", ".webp"}


def is_supported(path: str) -> bool:
    return Path(path).suffix.lower() in SUPPORTED


# ── Single-instance mutex (Windows Named Mutex) ───────────────────────────────

def acquire_mutex():
    """Returns (is_first_instance, mutex_handle)."""
    h = ctypes.windll.kernel32.CreateMutexW(None, True, MUTEX_NAME)
    already_exists = ctypes.windll.kernel32.GetLastError() == 183  # ERROR_ALREADY_EXISTS
    return (not already_exists), h


def release_mutex(h):
    if h:
        ctypes.windll.kernel32.ReleaseMutex(h)
        ctypes.windll.kernel32.CloseHandle(h)


# ── IPC: send files to the running instance ───────────────────────────────────

def send_to_instance(files: list, timeout: float = SEND_TIMEOUT) -> bool:
    """Keep retrying until the server is ready or timeout expires."""
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


# ── IPC: server that forwards incoming files to the Qt window ─────────────────

def start_ipc_server(window) -> None:
    srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        srv.bind(("127.0.0.1", SOCKET_PORT))
        srv.listen(20)
    except OSError:
        return  # Already bound by another attempt — rare, harmless

    def _loop():
        while True:
            try:
                conn, _ = srv.accept()
                data = b""
                while True:
                    chunk = conn.recv(8192)
                    if not chunk:
                        break
                    data += chunk
                conn.close()
                for p in json.loads(data):
                    window.add_file_signal.emit(p)
            except Exception:
                break

    threading.Thread(target=_loop, daemon=True).start()


# ── Merge worker (runs in a background thread) ────────────────────────────────

def _make_worker_class():
    from PyQt5.QtCore import QThread, pyqtSignal  # noqa: PLC0415

    class MergeWorker(QThread):
        progress = pyqtSignal(int)
        done     = pyqtSignal(str)
        failed   = pyqtSignal(str)

        def __init__(self, files: list, output: str):
            super().__init__()
            self.files  = files
            self.output = output

        def run(self):
            try:
                from pypdf import PdfWriter, PdfReader  # noqa: PLC0415
                from PIL import Image                   # noqa: PLC0415

                writer = PdfWriter()
                total  = len(self.files)

                for idx, path in enumerate(self.files):
                    ext = Path(path).suffix.lower()
                    if ext == ".pdf":
                        reader = PdfReader(path)
                        for page in reader.pages:
                            writer.add_page(page)
                    else:
                        img    = Image.open(path)
                        frames = self._frames(img)
                        for frame in frames:
                            buf = BytesIO()
                            frame.convert("RGB").save(buf, format="PDF", resolution=150)
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


# ── Main window ───────────────────────────────────────────────────────────────

def create_window(initial_files: list):
    from PyQt5.QtWidgets import (  # noqa: PLC0415
        QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
        QPushButton, QListWidget, QListWidgetItem, QLabel,
        QFileDialog, QMessageBox, QProgressBar, QFrame,
        QComboBox, QSizePolicy,
    )
    from PyQt5.QtCore import Qt, pyqtSignal  # noqa: PLC0415
    from PyQt5.QtGui import QFont            # noqa: PLC0415

    MergeWorker = _make_worker_class()

    class MainWindow(QMainWindow):
        add_file_signal = pyqtSignal(str)

        def __init__(self, files):
            super().__init__()
            self.setWindowTitle("Merge to PDF")
            self.setMinimumSize(560, 500)
            self.resize(640, 560)
            self.add_file_signal.connect(self._add)
            self._build_ui()
            for f in files:
                self._add(f)

        # ── UI construction ───────────────────────────────────────────────────

        def _build_ui(self):
            root = QWidget()
            self.setCentralWidget(root)
            lay = QVBoxLayout(root)
            lay.setSpacing(10)
            lay.setContentsMargins(16, 16, 16, 16)

            title = QLabel("Merge to PDF")
            title.setFont(QFont("Segoe UI", 14, QFont.Bold))
            lay.addWidget(title)

            hint = QLabel(
                "Add PDFs and images, reorder them with the arrows, "
                "set an output name, then click Merge."
            )
            hint.setWordWrap(True)
            hint.setStyleSheet("color:#666; font-size:9pt;")
            lay.addWidget(hint)

            # File list + side controls
            list_row = QHBoxLayout()

            self.lst = QListWidget()
            self.lst.setAlternatingRowColors(True)
            self.lst.setStyleSheet(
                "QListWidget {"
                "  border:1px solid #bbb; border-radius:4px;"
                "  font-family:'Segoe UI'; font-size:10pt;"
                "}"
                "QListWidget::item { padding:5px 8px; }"
                "QListWidget::item:selected { background:#cce0ff; color:#000; }"
                "QListWidget::item:alternate { background:#f6f6f6; }"
            )
            list_row.addWidget(self.lst)

            side = QVBoxLayout()
            side.setSpacing(4)
            side.addStretch()

            self._btn_up   = self._side_btn("▲", "Move selected file up",   self._move_up)
            self._btn_down = self._side_btn("▼", "Move selected file down", self._move_down)
            self._btn_del  = self._side_btn("✕", "Remove selected file",    self._delete)

            for i, b in enumerate([self._btn_up, self._btn_down, self._btn_del]):
                if i == 2:
                    side.addSpacing(8)
                side.addWidget(b)
            side.addStretch()
            list_row.addLayout(side)
            lay.addLayout(list_row)

            add_btn = QPushButton("+ Add More Files…")
            add_btn.clicked.connect(self._pick_files)
            lay.addWidget(add_btn)

            sep = QFrame()
            sep.setFrameShape(QFrame.HLine)
            sep.setStyleSheet("color:#ddd;")
            lay.addWidget(sep)

            # Output filename
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

            # Wire up live path preview
            self.combo.currentTextChanged.connect(self._update_path_hint)
            self.lst.model().rowsInserted.connect(self._update_path_hint)
            self.lst.model().rowsRemoved.connect(self._update_path_hint)

            # Progress + merge button
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

        @staticmethod
        def _side_btn(label, tip, slot):
            from PyQt5.QtWidgets import QPushButton  # noqa: PLC0415
            b = QPushButton(label)
            b.setFixedWidth(32)
            b.setToolTip(tip)
            b.clicked.connect(slot)
            return b

        # ── File management ───────────────────────────────────────────────────

        def _add(self, path: str):
            path = os.path.normpath(path)
            if not os.path.isfile(path) or not is_supported(path):
                return
            # Deduplicate
            for i in range(self.lst.count()):
                if self.lst.item(i).data(Qt.UserRole) == path:
                    return
            ext  = Path(path).suffix.upper().lstrip(".")
            item = QListWidgetItem(f"[{ext}]  {Path(path).name}")
            item.setData(Qt.UserRole, path)
            self.lst.addItem(item)
            self._sync_combo()

        def _delete(self):
            row = self.lst.currentRow()
            if row >= 0:
                self.lst.takeItem(row)
                self._sync_combo()

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
                ";;All Files (*)"
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
                reply = QMessageBox.question(
                    self, "File exists",
                    f'"{Path(output).name}" already exists.\nOverwrite it?',
                    QMessageBox.Yes | QMessageBox.No,
                )
                if reply != QMessageBox.Yes:
                    return

            self.merge_btn.setEnabled(False)
            self.pbar.setValue(0)
            self.pbar.setVisible(True)

            self._worker = MergeWorker(files, output)
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
            msg.setText(f"Merged successfully.\n\n{output}")
            open_btn  = msg.addButton("Open Folder", QMessageBox.AcceptRole)
            msg.addButton("Close",       QMessageBox.RejectRole)
            msg.exec_()
            if msg.clickedButton() == open_btn:
                os.startfile(str(Path(output).parent))

        def _on_failed(self, error: str):
            self.pbar.setVisible(False)
            self.merge_btn.setEnabled(True)
            QMessageBox.critical(self, "Merge failed", error)

    return MainWindow(initial_files)


# ── Entry point ───────────────────────────────────────────────────────────────

def main():
    incoming = [f for f in sys.argv[1:] if os.path.exists(f) and is_supported(f)]

    is_first, mutex = acquire_mutex()

    if not is_first:
        # Another instance already has the mutex; forward our file(s) to it.
        if incoming:
            ok = send_to_instance(incoming)
            if not ok:
                ctypes.windll.user32.MessageBoxW(
                    0,
                    "Could not connect to the Merge to PDF window.\n"
                    "Please open merge_app.py directly and add files manually.",
                    "Merge to PDF",
                    0x10,  # MB_ICONERROR
                )
        release_mutex(mutex)
        sys.exit(0)

    # ── We are the first (and only) instance ──────────────────────────────────
    import atexit
    atexit.register(release_mutex, mutex)

    try:
        from PyQt5.QtWidgets import QApplication  # noqa: PLC0415
        from PyQt5.QtCore import Qt               # noqa: PLC0415
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
    start_ipc_server(window)
    window.show()
    window.raise_()
    window.activateWindow()

    sys.exit(app.exec_())


if __name__ == "__main__":
    main()
