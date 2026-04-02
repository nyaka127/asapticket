@echo off
title ASAP Tickets CMS Launcher (STABLE 24/7)

:: Ensure we are in the correct directory
cd /d "%~dp0"

:: 0. Clean up stale processes
echo [*] Cleaning up old processes...
taskkill /F /IM node.exe /T > nul 2>&1
taskkill /F /IM cloudflared.exe /T > nul 2>&1
ping 127.0.0.1 -n 3 > nul

:: 0.2 Remove conflicting API route files
echo [*] Removing conflicting API route files...
if exist "src\app\(public)\flights\route.ts" del "src\app\(public)\flights\route.ts"
if exist "src\app\(public)\flights\checkout\route.ts" del "src\app\(public)\flights\checkout\route.ts"
if exist "src\app\api\bookings\route.ts" del "src\app\api\bookings\route.ts"

:: 1. Database - run BEFORE anything else uses node/prisma
echo [*] Checking database status...
call npx prisma db push --accept-data-loss
call npx prisma generate

set NODE_ENV=production

echo [*] Building Next.js application for stable production...
call npm run build

echo =====================================================
echo    ASAP TICKETS - STABLE 24/7 MODE ACTIVE
echo =====================================================
echo.

:: 2. Launch Tunnels (after build is done)
echo [*] Initializing Global Access Tunnels...
start "ASAP TICKETS - TUNNEL HUB" cmd /c "title TUNNEL HUB && node run-tunnels.cjs"

:: 3. Run Platform Server (with auto-restart loop)
:MAIN_LOOP
echo [%time%] Platform Server LIVE...
node server.mjs
echo [!] Server offline at %time%. Recovering...
ping 127.0.0.1 -n 6 > nul
goto MAIN_LOOP