# Vercel Deployment Guide for CodeAndChill

This guide will help you deploy your full-stack application to Vercel.

## Architecture

Your app has two parts:
1. **Frontend** (React + Vite) - Deploy to Vercel
2. **Backend** (Node.js + Express) - Deploy separately to Vercel or another platform

## Option 1: Deploy Frontend Only to Vercel (Recommended)

### Step 1: Prepare Frontend

The frontend is already configured in `vercel.json` to deploy from the `codeandchill` folder.

### Step 2: Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from root directory:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **codeandchill** (or your choice)
   - In which directory is your code located? **./codeandchill**
   - Want to override settings? **N**

### Step 3: Configure Environment Variables

In Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add these variables:
   - `VITE_API_URL` = Your backend API URL (see Backend deployment below)

### Step 4: Deploy Backend Separately

**Option A: Deploy Backend to Vercel (Separate Project)**

1. Navigate to backend folder:
```bash
cd Backend/server
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel Dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `SESSION_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - All other variables from your `.env` file

**Option B: Deploy Backend to Railway/Render/Heroku**

These platforms are better suited for WebSocket and long-running processes:

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
cd Backend/server
railway init

# Deploy
railway up
```

**Render:**
1. Go to https://render.com
2. Create New → Web Service
3. Connect your GitHub repo
4. Root Directory: `Backend/server`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add environment variables

### Step 5: Update Frontend API URL

After deploying backend, update the frontend environment variable:
```bash
vercel env add VITE_API_URL production
# Enter your backend URL (e.g., https://your-backend.vercel.app/api)
```

Redeploy frontend:
```bash
vercel --prod
```

## Option 2: Monorepo Deployment (Advanced)

If you want to deploy both from one Vercel project:

1. The `vercel.json` in root is configured for frontend only
2. You'll need to create a separate Vercel project for the backend
3. Link them via environment variables

## Important Notes

### WebSocket Limitations on Vercel
- Vercel serverless functions have a 10-second timeout
- WebSocket connections (Socket.IO) won't work well on Vercel
- **Recommendation**: Deploy backend to Railway, Render, or Heroku for WebSocket support

### File Uploads
- Vercel serverless functions have limited file system access
- Use cloud storage (AWS S3, Cloudinary) for file uploads in production
- Update `Backend/server/src/middleware/upload.ts` to use cloud storage

### Database
- Ensure MongoDB Atlas is accessible from Vercel IPs
- Add `0.0.0.0/0` to MongoDB Atlas IP whitelist (or use Vercel IPs)

## Deployment Checklist

- [ ] All `.env` files are in `.gitignore`
- [ ] Environment variables added to Vercel Dashboard
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Backend deployed and accessible
- [ ] Frontend `VITE_API_URL` points to backend
- [ ] OAuth redirect URIs updated in Google Console
- [ ] CORS configured for production domains
- [ ] Test all features after deployment

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compiles locally: `npm run build`

### API Calls Fail
- Check `VITE_API_URL` environment variable
- Verify backend is running and accessible
- Check CORS configuration in backend

### OAuth Not Working
- Update redirect URIs in Google Console
- Add production URLs to authorized domains
- Verify environment variables are set

## Production URLs

After deployment, you'll have:
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-backend.vercel.app` (or Railway/Render URL)

Update these in:
1. Google OAuth Console (Authorized redirect URIs)
2. Frontend environment variables
3. Backend CORS configuration
