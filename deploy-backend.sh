#!/bin/bash

# Deploy Backend to Vercel
echo "⚠️  WARNING: Vercel has limitations for WebSocket and long-running processes"
echo "Consider using Railway, Render, or Heroku for backend deployment"
echo ""
read -p "Continue with Vercel deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

echo "🚀 Deploying Backend to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Navigate to backend directory
cd Backend/server

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Backend deployment complete!"
echo "📝 Don't forget to:"
echo "   1. Add all environment variables in Vercel Dashboard"
echo "   2. Update VITE_API_URL in frontend"
echo "   3. Configure MongoDB Atlas IP whitelist"
echo "   4. Update CORS origins in backend"
