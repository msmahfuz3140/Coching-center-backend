# Backend Deployment Guide

## Prerequisites
1. Vercel account (same account as frontend)
2. MongoDB Atlas database (already configured)
3. Backend code ready

## Step 1: Deploy Backend to Vercel

### Option A: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --yes
```

### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your backend repository: `Coching-center-backend`
3. Configure the project:
   - **Root Directory**: `Coching-center-backend`
   - **Build Command**: Leave empty (or `npm install`)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```
   MONGODB_URI=mongodb://coching-center:xOpJ1xoCTs3KHx0B@ac-5ppqbt1-shard-00-00.lwxgi8z.mongodb.net:27017,ac-5ppqbt1-shard-00-01.lwxgi8z.mongodb.net:27017,ac-5ppqbt1-shard-00-02.lwxgi8z.mongodb.net/coching_center?ssl=true&replicaSet=atlas-l7hopv-shard-0&authSource=admin&appName=Cluster0
   DB_NAME=coching_center
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_change_this
   FRONTEND_URL=https://coching-center-frontend.vercel.app
   CLOUDINARY_CLOUD_NAME=dkxqrlywb
   CLOUDINARY_API_KEY=134412262397762
   CLOUDINARY_API_SECRET=OGJAM1ETfurI8lQIxsFT14cT7gU
   ```

5. Click "Deploy"

## Step 2: Update Frontend Configuration

After backend deployment, you'll get a URL like: `https://coching-center-backend-xxxx.vercel.app`

Update the frontend's `.env.production` file:
```env
NEXT_PUBLIC_API_URL=https://coching-center-backend-xxxx.vercel.app/api
```

## Step 3: Redeploy Frontend

```bash
cd ../Coching-center-frontend
vercel --yes
```

## Troubleshooting

### Issue: "Failed to fetch" error
**Solution**: 
1. Check if backend is deployed and accessible
2. Verify CORS settings in backend
3. Check environment variables are set correctly
4. Test backend URL directly: `https://your-backend-url.vercel.app/api/health`

### Issue: CORS errors
**Solution**: The backend already has CORS configured for:
- `http://localhost:3000`
- `https://coching-center-frontend.vercel.app`
- Your custom FRONTEND_URL

### Issue: MongoDB connection fails
**Solution**: 
1. Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for Vercel)
2. Verify database credentials
3. Check network access settings in Atlas

## Current Status
- ✅ Backend code is ready
- ✅ All routes configured
- ✅ All controllers created
- ✅ All models created
- ✅ Vercel configuration created
- ⏳ Backend needs to be deployed
- ⏳ Frontend needs to be updated with backend URL