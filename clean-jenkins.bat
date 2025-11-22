@echo off
echo ========================================
echo Cleaning Jenkins - Complete Reset
echo ========================================
echo.

echo Stopping Jenkins processes...
taskkill /F /IM java.exe 2>nul

echo.
echo Removing Jenkins workspace directory...
if exist "%USERPROFILE%\.jenkins" (
    echo Deleting %USERPROFILE%\.jenkins
    rmdir /s /q "%USERPROFILE%\.jenkins"
    echo Jenkins workspace deleted.
) else (
    echo Jenkins workspace not found.
)

echo.
echo Cleaning up Jenkins files in current directory...
if exist "jenkins.war.tmp" del /q "jenkins.war.tmp"
if exist "jenkins.war.bak" del /q "jenkins.war.bak"

echo.
echo ========================================
echo Jenkins Completely Cleaned!
echo ========================================
echo.
echo Jenkins has been reset to factory defaults.
echo All jobs, configurations, and data have been removed.
echo.
echo To start fresh Jenkins, run: start-jenkins-fresh.bat
echo.
pause