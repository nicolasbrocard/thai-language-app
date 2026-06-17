@echo off
setlocal EnableDelayedExpansion

echo.
echo  =============================================
echo    Merge to PDF  --  Installer
echo  =============================================
echo.

:: ── Check Python ──────────────────────────────────────────────────────────────
python --version >nul 2>&1
if errorlevel 1 (
    echo  ERROR: Python was not found in your PATH.
    echo.
    echo  Please install Python 3.9+ from https://www.python.org/downloads/
    echo  and make sure you tick "Add Python to PATH" during setup.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('python --version 2^>^&1') do set PY_VER=%%v
echo  Found: %PY_VER%
echo.

:: ── Upgrade pip silently ──────────────────────────────────────────────────────
echo  Upgrading pip...
python -m pip install --upgrade pip --quiet
echo.

:: ── Install dependencies ──────────────────────────────────────────────────────
echo  Installing dependencies (PyQt5, pypdf, Pillow)...
echo  This may take a minute on first run.
echo.

python -m pip install -r "%~dp0requirements.txt"
if errorlevel 1 (
    echo.
    echo  ERROR: Dependency installation failed.
    echo  Check your internet connection and try again.
    echo.
    pause
    exit /b 1
)

echo.
echo  Dependencies installed successfully.
echo.

:: ── Register context menu ─────────────────────────────────────────────────────
echo  Registering Windows Explorer context menu...
echo.

python "%~dp0setup_registry.py"
if errorlevel 1 (
    echo.
    echo  ERROR: Registry registration failed.
    echo.
    pause
    exit /b 1
)

echo.
echo  =============================================
echo    Installation Complete!
echo  =============================================
echo.
echo  How to use:
echo    1. Open any folder in Windows Explorer.
echo    2. Select multiple PDF or image files
echo       (hold Ctrl or Shift to multi-select).
echo    3. Right-click the selection.
echo    4. Choose "Merge to PDF".
echo.
echo  IMPORTANT: Do not move this folder.
echo  If you do, run install.bat again from the new location.
echo.
pause
endlocal
