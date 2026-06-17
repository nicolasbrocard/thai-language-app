@echo off
echo.
echo  Removing "Merge to PDF" context menu entries...
echo.

python "%~dp0setup_registry.py" --uninstall
if errorlevel 1 (
    echo  ERROR: Could not remove registry entries.
    echo  Make sure Python is installed and in your PATH.
    echo.
    pause
    exit /b 1
)

echo.
echo  Context menu removed.
echo  You can now delete this folder if you no longer need the tool.
echo.
pause
