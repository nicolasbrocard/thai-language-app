#!/usr/bin/env python3
"""
Register or unregister Windows Explorer context menu entries for Merge to PDF.

Usage:
  python setup_registry.py            # install
  python setup_registry.py --uninstall  # remove
"""

import sys
import os
import winreg
from pathlib import Path

VERB        = "MergeToPDF"
MENU_LABEL  = "Merge to PDF"
EXTENSIONS  = [
    ".pdf",
    ".jpg", ".jpeg",
    ".png",
    ".bmp",
    ".tiff", ".tif",
    ".gif",
    ".webp",
]


def _pythonw() -> str:
    """Return the path to pythonw.exe (suppresses the console window)."""
    py  = Path(sys.executable)
    pyw = py.parent / "pythonw.exe"
    return str(pyw) if pyw.exists() else str(py)


def _script() -> str:
    """Absolute path to merge_app.py, next to this file."""
    return str(Path(__file__).resolve().parent / "merge_app.py")


def install() -> None:
    python  = _pythonw()
    script  = _script()
    command = f'"{python}" "{script}" "%1"'

    print(f"Python  : {python}")
    print(f"Script  : {script}")
    print(f"Command : {command}")
    print()

    if not Path(script).exists():
        print("ERROR: merge_app.py not found next to this script.")
        sys.exit(1)

    for ext in EXTENSIONS:
        base = f"Software\\Classes\\SystemFileAssociations\\{ext}\\shell\\{VERB}"

        # Verb key
        with winreg.CreateKey(winreg.HKEY_CURRENT_USER, base) as k:
            winreg.SetValueEx(k, "",                 0, winreg.REG_SZ, MENU_LABEL)
            winreg.SetValueEx(k, "MultiSelectModel", 0, winreg.REG_SZ, "Player")

        # Command subkey
        with winreg.CreateKey(winreg.HKEY_CURRENT_USER, base + "\\command") as k:
            winreg.SetValueEx(k, "", 0, winreg.REG_SZ, command)

        print(f"  [OK] {ext}")

    print()
    print("Context menu registered for all supported file types.")
    print()
    print("TIP: Right-click on any PDF or image file in Explorer")
    print("     and choose 'Merge to PDF'.")
    print()
    print("NOTE: If you move this folder, run install.bat again to update the paths.")


def uninstall() -> None:
    removed = 0
    for ext in EXTENSIONS:
        base = f"Software\\Classes\\SystemFileAssociations\\{ext}\\shell\\{VERB}"
        for sub in (base + "\\command", base):
            try:
                winreg.DeleteKey(winreg.HKEY_CURRENT_USER, sub)
            except FileNotFoundError:
                pass
            except Exception as exc:
                print(f"  [WARN] {sub}: {exc}")
        removed += 1
        print(f"  [OK] removed {ext}")

    print()
    print(f"Removed context menu entries for {removed} file type(s).")
    print("You can safely delete this folder now.")


if __name__ == "__main__":
    if "--uninstall" in sys.argv:
        uninstall()
    else:
        install()
