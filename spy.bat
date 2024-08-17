@echo off
setlocal

rem Define the process name
set "PROCESS_NAME=app.js"

rem Check if the process is running
wmic process where "name='node.exe'" get commandline | findstr /I "%PROCESS_NAME%" >nul

if %ERRORLEVEL% EQU 0 (
    echo %PROCESS_NAME% is already running.
) else (
    echo %PROCESS_NAME% is not running. Starting it now...
    
    rem Run the Node.js file
    start "" node %PROCESS_NAME%
    
    echo %PROCESS_NAME% has been started.
)

endlocal
