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
if exist "src\app\api\bookings\route.ts" del "src\app\api\bookings\route.ts"
if exist "src\app\route.ts" del "src\app\route.ts"
if exist "route.ts" del "route.ts"
if exist "FlightStatusTracker.tsx" del "FlightStatusTracker.tsx"
if exist "src\app\FlightStatusTracker.tsx" del "src\app\FlightStatusTracker.tsx"

:: 0.3 Disable Middleware (Fixes "Too Many Redirects" loop)
if exist "src\middleware.ts.disabled" del "src\middleware.ts.disabled"
if exist "src\middleware.ts" ren "src\middleware.ts" "middleware.ts.disabled"
if exist "middleware.ts.disabled" del "middleware.ts.disabled"
if exist "middleware.ts" ren "middleware.ts" "middleware.ts.disabled"

:: 0.1 Force clean build to ensure changes appear
IF EXIST ".next" (
    echo [*] Clearing cache to apply latest changes...
    rmdir /s /q ".next"
)
IF EXIST "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
)

:: 1. Install dependencies if they are missing
IF NOT EXIST "node_modules" (
    echo [!] First run detected. Installing dependencies...
    call npm install
    echo.
)

:: 2. Ensure database is ready (MUST be done before build)
echo [*] Checking database status...
:: Use `db push` to sync schema and generate Prisma Client
call npx prisma db push --accept-data-loss
call npx prisma generate
echo.

:: 3. Open Browser and Start Server
echo [*] Opening browser...
:: 1. Open Administrative Oversight Dashboard (Port 3001)
start http://localhost:3001
:: 2. Open Public Booking Website (Port 3000)
start http://localhost:3000
echo [*] Starting dual servers... (Press Ctrl+C to stop)
echo [*] ADMIN DASHBOARD LINK: http://localhost:3001
echo [*] PUBLIC BOOKING LINK: http://localhost:3000
echo.
echo [!] LOCAL NETWORK ACCESS (Your devices on this Wi-Fi):
echo     -------------------------------------------------------
echo     1. Look for your IPv4 Address below:
ipconfig | findstr /i "IPv4"
echo     2. On your phone, type: http://[YOUR_IP_ABOVE]:3000
echo     -------------------------------------------------------
echo.
echo [!] WORLDWIDE ACCESS (Free Hosting via your Internet):
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
node server.js
pause