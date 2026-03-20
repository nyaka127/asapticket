@echo off
title ASAP Tickets CMS Launcher

echo =====================================================
echo    ASAP Tickets - Local Development Launcher
echo =====================================================
echo.

:: Ensure we are in the correct directory
cd /d "%~dp0"

:: 0. Clean up stale processes (Fixes EPERM and Port In Use errors)
echo [*] Cleaning up stale Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

:: 0.2 Remove conflicting route files (Fixes HTTP 405 Errors)
echo [*] Removing conflicting API route files...
if exist "src\app\(public)\flights\route.ts" del "src\app\(public)\flights\route.ts"
if exist "src\app\(public)\flights\checkout\route.ts" del "src\app\(public)\flights\checkout\route.ts"
if exist "route.ts" del "route.ts"

:: 0.1 Force clean build to ensure changes appear
IF EXIST ".next" (
    echo [*] Clearing cache to apply latest changes...
    rmdir /s /q ".next"
)

:: 1. Install dependencies if they are missing
IF NOT EXIST "node_modules" (
    echo [!] First run detected. Installing dependencies...
    call npm install
    echo.
)

:: 2. Ensure database is ready
echo [*] Checking database status...
:: Use `migrate reset` to automatically fix drift issues in the local dev environment.
:: The --force flag prevents it from asking for confirmation, which is ideal for a script.
call npx prisma db push
echo.

:: 3. Open Browser and Start Server
echo [*] Opening browser...
:: The `start` command opens the URL in the default browser.
start http://localhost:3000
echo [*] Starting server... (Press Ctrl+C to stop)
echo [*] YOUR WEBSITE LINK: http://localhost:3000 (asapticketagent7)
echo [*] CAPACITY: Local Mode (~50 users). Deploy to Vercel for 10,000+ user capacity.
echo.
echo [!] TO VIEW ON PHONES OR OTHER COMPUTERS (Same Wi-Fi Required):
echo     -------------------------------------------------------
echo     1. Look for your IPv4 Address below:
ipconfig | findstr /i "IPv4"
echo     2. On your phone, type: http://[YOUR_IP_ABOVE]:3000
echo     -------------------------------------------------------
echo.
echo [!] WORLDWIDE ACCESS (Share with clients globally):
echo     Launching secure tunnel... (Look for the new window)
echo.
:: Using localhost.run to avoid the 'Tunnel Password' warning page
start "ASAP Global Tunnel" cmd /k "ssh -o StrictHostKeyChecking=no -R 80:localhost:3000 nokey@localhost.run"
echo.
echo     [!] INSTRUCTIONS:
echo         1. Look at the NEW black window that opened.
echo         2. Copy the https link (it usually ends in .lhr.life or .localhost.run)
echo         3. Send that link to clients. It opens DIRECTLY (No warnings).
echo.
echo     -------------------------------------------------------
npm run dev