@echo off
echo ========================================
echo Building and Pushing Docker Images
echo ========================================
echo.

echo Please make sure you're logged into Docker Hub first:
echo docker login
echo.
pause

echo Building backend image...
cd Backend\server
docker build -t maheshsingh20/codeandchill-backend:latest .
if %ERRORLEVEL% NEQ 0 (
    echo Backend build failed!
    pause
    exit /b 1
)

echo Building frontend image...
cd ..\..\codeandchill
docker build -t maheshsingh20/codeandchill-frontend:latest .
if %ERRORLEVEL% NEQ 0 (
    echo Frontend build failed!
    pause
    exit /b 1
)

cd ..

echo.
echo Pushing images to Docker Hub...
docker push maheshsingh20/codeandchill-backend:latest
if %ERRORLEVEL% NEQ 0 (
    echo Backend push failed!
    pause
    exit /b 1
)

docker push maheshsingh20/codeandchill-frontend:latest
if %ERRORLEVEL% NEQ 0 (
    echo Frontend push failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Images built and pushed successfully!
echo ========================================
echo.
echo Now you can run: update-from-cicd.bat
echo.
pause