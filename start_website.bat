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
echo.
echo =====================================================
echo    1. CLIENT FLIGHT TICKET (Laptop):  http://localhost:3000
echo    2. AGENT SUPERVISOR (Laptop):      http://localhost:3001
echo =====================================================
echo.
echo [!] SMARTPHONE ACCESS (Same Wi-Fi Network):
echo     -------------------------------------------------------
echo     1. Find your IPv4 Address below:
ipconfig | findstr /i "IPv4"
echo     2. CLIENTS (Phone):    http://[YOUR_IP_ABOVE]:3000
echo     3. SUPERVISOR (Phone): http://[YOUR_IP_ABOVE]:3001
echo     -------------------------------------------------------
echo.
echo [!] WORLDWIDE ACCESS (Free Hosting via your Internet):
echo     Launching dual secure tunnels... (Look for the TWO new windows)
echo.
:: Tunnel 1: Public Booking Site (Port 3000)
start "CLIENT BOOKING TUNNEL" cmd /k "ssh -o StrictHostKeyChecking=no -R 80:localhost:3000 nokey@localhost.run"
:: Tunnel 2: Agent Supervisor Hub (Port 3001)
start "AGENT SUPERVISOR TUNNEL" cmd /k "ssh -o StrictHostKeyChecking=no -R 80:localhost:3001 nokey@localhost.run"
echo.
echo     [!] INSTRUCTIONS:
echo         1. TWO black windows will open.
echo         2. CLIENT WINDOW: Use the link to send to passengers (Smartphone).
echo         3. AGENT WINDOW:  Use the link for yourself (Laptop Oversight).
echo         4. Copy the https links (ending in .lhr.life or .localhost.run).
echo.
echo     -------------------------------------------------------
node server.js
pause