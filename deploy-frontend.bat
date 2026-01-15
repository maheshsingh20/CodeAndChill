@echo off
echo 🚀 Deploying Frontend to Vercel...

REM Check if vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Navigate to frontend directory
cd codeandchill

REM Build the project
echo 📦 Building frontend...
call npm run build

REM Deploy to Vercel
echo 🌐 Deploying to Vercel...
call vercel --prod

echo ✅ Frontend deployment complete!
echo 📝 Don't forget to:
echo    1. Set VITE_API_URL in Vercel Dashboard
echo    2. Deploy backend separately
echo    3. Update OAuth redirect URIs

pause
