@echo off
echo ========================================
echo SmartBuy Docker Deployment
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

REM Check if .env exists
if not exist .env (
    echo [WARNING] .env file not found!
    echo Copying .env.example to .env...
    copy .env.example .env
    echo.
    echo [INFO] Please edit .env file with your credentials before continuing.
    echo Press any key to open .env file...
    pause
    notepad .env
)

echo.
echo Choose deployment mode:
echo 1. Production (optimized, no hot-reload)
echo 2. Development (hot-reload enabled)
echo 3. Stop all services
echo 4. View logs
echo 5. Clean everything (removes data!)
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto production
if "%choice%"=="2" goto development
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto logs
if "%choice%"=="5" goto clean
goto invalid

:production
echo.
echo [INFO] Starting SmartBuy in PRODUCTION mode...
docker-compose up -d --build
if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] SmartBuy is now running!
    echo.
    echo Access points:
    echo - Frontend: http://localhost
    echo - API Gateway: http://localhost:3000
    echo - MongoDB: mongodb://admin:smartbuy123@localhost:27017
    echo.
    echo Run 'docker-compose logs -f' to view logs
    echo Run 'docker-compose ps' to check status
)
goto end

:development
echo.
echo [INFO] Starting SmartBuy in DEVELOPMENT mode...
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] SmartBuy Dev is now running!
    echo.
    echo Access points:
    echo - Frontend: http://localhost:5173
    echo - API Gateway: http://localhost:3000
    echo.
    echo Changes to code will auto-reload!
)
goto end

:stop
echo.
echo [INFO] Stopping all services...
docker-compose down
echo [SUCCESS] All services stopped
goto end

:logs
echo.
echo [INFO] Showing logs (Press Ctrl+C to exit)...
docker-compose logs -f
goto end

:clean
echo.
echo [WARNING] This will delete ALL data including database!
set /p confirm="Are you sure? (yes/no): "
if /i "%confirm%"=="yes" (
    echo [INFO] Cleaning up...
    docker-compose down -v
    docker system prune -f
    echo [SUCCESS] Cleanup complete
) else (
    echo [INFO] Cleanup cancelled
)
goto end

:invalid
echo [ERROR] Invalid choice!
goto end

:end
echo.
pause
