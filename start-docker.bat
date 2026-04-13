@echo off
echo ========================================
echo   Code & Chill - Docker Setup
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [INFO] Docker is running...
echo.

REM Check if .env file exists
if not exist .env (
    echo [WARNING] .env file not found!
    echo Creating .env from .env.docker...
    copy .env.docker .env
    echo.
    echo [ACTION REQUIRED] Please edit .env file and add your API keys:
    echo   - GEMINI_API_KEY
    echo   - GITHUB_CLIENT_ID
    echo   - GITHUB_CLIENT_SECRET
    echo   - GOOGLE_CLIENT_ID (optional)
    echo   - GOOGLE_CLIENT_SECRET (optional)
    echo.
    pause
)

echo [INFO] Starting services...
echo.

REM Stop any existing containers
docker-compose down

REM Build and start services
docker-compose up -d --build

echo.
echo ========================================
echo   Services Starting...
echo ========================================
echo.
echo Waiting for services to be healthy...
timeout /t 10 /nobreak >nul

REM Check service status
docker-compose ps

echo.
echo ========================================
echo   Access Your Application
echo ========================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:3001
echo MongoDB:   localhost:27017
echo.
echo ========================================
echo   Useful Commands
echo ========================================
echo.
echo View logs:        docker-compose logs -f
echo Stop services:    docker-compose down
echo Restart:          docker-compose restart
echo.
echo Press any key to view logs (Ctrl+C to exit)...
pause >nul

docker-compose logs -f
