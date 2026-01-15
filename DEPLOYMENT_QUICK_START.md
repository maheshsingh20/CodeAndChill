# Quick Start: Deploy to Vercel

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- MongoDB Atlas account (for database)

## 🚀 Fastest Way to Deploy

### 1. Deploy Frontend (2 minutes)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy frontend
cd codeandchill
vercel --prod
```

When prompted:
- Project name: `codeandchill` (or your choice)
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

### 2. Add Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
```
VITE_API_URL = https://your-backend-url.com/api
```

### 3. Deploy Backend (Choose One)

#### Option A: Railway (Recommended for WebSocket)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd Backend/server
railway init
railway up
```

Add environment variables in Railway Dashboard.

#### Option B: Render

1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Root Directory: `Backend/server`
5. Build: `npm install`
6. Start: `npm start`
7. Add environment variables

#### Option C: Vercel (Limited WebSocket support)

```bash
cd Backend/server
vercel --prod
```

### 4. Update Frontend with Backend URL

```bash
# In Vercel Dashboard, update VITE_API_URL
# Then redeploy
vercel --prod
```

### 5. Configure OAuth

Update Google OAuth Console:
- Authorized JavaScript origins: `https://your-frontend.vercel.app`
- Authorized redirect URIs: `https://your-backend-url.com/api/auth/google/callback`

## Environment Variables Needed

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GEMINI_API_KEY=your_gemini_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
FRONTEND_URL=https://your-frontend.vercel.app
```

## Troubleshooting

### Build fails
- Run `npm run build` locally first
- Check all dependencies are in package.json
- Review build logs in Vercel Dashboard

### API not connecting
- Verify VITE_API_URL is correct
- Check backend is running
- Verify CORS settings

### OAuth not working
- Update redirect URIs in Google Console
- Check environment variables are set
- Verify callback URLs match

## Need Help?

See detailed guide: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
