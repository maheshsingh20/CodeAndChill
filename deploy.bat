@echo off
REM CodeAndChill Docker Deployment Script for Windows
REM This script automates the deployment process on Windows

echo ========================================
echo   CodeAndChill Docker Deployment
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed or not in PATH
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo [OK] Docker is installed

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed
    pause
    exit /b 1
)
echo [OK] Docker Compose is installed

REM Check if .env file exists
if not exist .env (
    echo [WARNING] .env file not found
    echo Creating .env from .env.docker template...
    copy .env.docker .env
    echo.
    echo Please edit .env file with your actual values
    echo Press any key after editing .env file...
    pause
)
echo [OK] .env file exists

echo.
echo Select deployment type:
echo 1. Development (default)
echo 2. Production
echo.
set /p choice="Enter choice [1-2]: "

if "%choice%"=="2" (
    set COMPOSE_FILE=docker-compose.prod.yml
    echo [INFO] Using production configuration
) else (
    set COMPOSE_FILE=docker-compose.yml
    echo [INFO] Using development configuration
)

echo.
echo Stopping existing containers...
docker-compose -f %COMPOSE_FILE% down
echo [OK] Containers stopped

echo.
set /p remove_images="Do you want to remove old images? (y/n): "
if /i "%remove_images%"=="y" (
    echo Removing old images...
    docker-compose -f %COMPOSE_FILE% down --rmi all
    echo [OK] Old images removed
)

echo.
echo Building Docker images...
docker-compose -f %COMPOSE_FILE% build --no-cache
if errorlevel 1 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [OK] Images built successfully

echo.
echo Starting containers...
docker-compose -f %COMPOSE_FILE% up -d
if errorlevel 1 (
    echo [ERROR] Failed to start containers
    pause
    exit /b 1
)
echo [OK] Containers started

echo.
echo Waiting for services to be healthy...
timeout /t 10 /nobreak >nul

echo.
echo Checking MongoDB...
:check_mongo
docker-compose -f %COMPOSE_FILE% exec -T mongodb mongosh --eval "db.adminCommand('ping')" >nul 2>&1
if errorlevel 1 (
    timeout /t 2 /nobreak >nul
    goto check_mongo
)
echo [OK] MongoDB is ready

echo.
echo Checking Backend...
:check_backend
curl -f http://localhost:3001/health >nul 2>&1
if errorlevel 1 (
    timeout /t 2 /nobreak >nul
    goto check_backend
)
echo [OK] Backend is ready

echo.
set /p seed_db="Do you want to seed the database? (y/n): "
if /i "%seed_db%"=="y" (
    echo Seeding database...
    docker-compose -f %COMPOSE_FILE% exec backend npm run seed
    echo [OK] Database seeded
)

echo.
set /p create_admin="Do you want to create an admin user? (y/n): "
if /i "%create_admin%"=="y" (
    echo Creating admin user...
    docker-compose -f %COMPOSE_FILE% exec backend npm run create-admin
    echo [OK] Admin user created
)

echo.
echo ========================================
echo   Deployment Completed Successfully!
echo ========================================
echo.
echo Access your application at:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:3001
echo   MongoDB:  localhost:27017
echo.
echo Useful commands:
echo   View logs:        docker-compose -f %COMPOSE_FILE% logs -f
echo   Stop services:    docker-compose -f %COMPOSE_FILE% down
echo   Restart services: docker-compose -f %COMPOSE_FILE% restart
echo.
echo Running containers:
docker-compose -f %COMPOSE_FILE% ps
echo.
pause
