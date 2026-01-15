#!/bin/bash

# Deploy Frontend to Vercel
echo "🚀 Deploying Frontend to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Navigate to frontend directory
cd codeandchill

# Build the project
echo "📦 Building frontend..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Frontend deployment complete!"
echo "📝 Don't forget to:"
echo "   1. Set VITE_API_URL in Vercel Dashboard"
echo "   2. Deploy backend separately"
echo "   3. Update OAuth redirect URIs"
