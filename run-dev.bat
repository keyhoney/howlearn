@echo off
setlocal
cd /d "%~dp0"

echo [howlearn-content] Starting dev server...

if not exist "node_modules\" goto install_deps
goto check_dist

:install_deps
echo [howlearn-content] Installing dependencies...
call npm install
if errorlevel 1 goto fail

:check_dist
if not exist "dist\index.html" goto build_dist
goto start_dev

:build_dist
echo [howlearn-content] dist/ missing. Running build:local - may take a few minutes...
call npm run build:local
if errorlevel 1 goto fail

:start_dev
echo.
echo [howlearn-content] Syncing search index and starting dev server
echo [howlearn-content] http://localhost:4322/search?q=test
echo.

call npm run search:sync-dev
if errorlevel 1 goto fail

call npx astro dev --port 4322
goto end

:fail
echo [howlearn-content] Command failed.
pause
exit /b 1

:end
pause
endlocal
