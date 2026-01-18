# Deploying Backend to Render

## Problem
Render is trying to run the Expo app instead of the backend server. The Expo app is a mobile app and cannot run as a web service.

## Solution
You need to configure Render to deploy **only the backend folder**, not the entire repository.

## Step-by-Step Instructions

### Option 1: Using Render Dashboard (Recommended)

1. **Go to your Render Dashboard**
   - Navigate to your service
   - Click "Settings"

2. **Update Build & Start Commands:**
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Set Environment Variables:**
   Go to "Environment" tab and add:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   FRONTEND_URL=*
   ```

4. **Save and Redeploy**

### Option 2: Using render.yaml (If supported)

The `render.yaml` file has been created. If your Render plan supports it:
- Render will automatically detect and use it
- Make sure to set environment variables in the dashboard

### Option 3: Create a Separate Backend Repository

For the cleanest setup:

1. **Create a new repository** for just the backend:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin https://github.com/yourusername/esports-backend.git
   git push -u origin main
   ```

2. **Deploy from the backend repository** on Render

## Important Notes

- ✅ **Backend only**: Render should deploy the `backend/` folder, not the root
- ✅ **Port**: Render uses port 10000 by default, but your server should use `process.env.PORT`
- ✅ **CORS**: Update `FRONTEND_URL` to allow your Expo app URLs
- ✅ **Environment Variables**: All sensitive data must be set in Render dashboard

## After Deployment

1. **Get your Render URL**: `https://your-service.onrender.com`
2. **Update your Expo app**: Set `EXPO_PUBLIC_API_URL=https://your-service.onrender.com/api` in `.env`
3. **Test**: Your app should now connect to the deployed backend!

## Troubleshooting

**Still getting Expo errors?**
- Make sure Root Directory is set to `backend`
- Verify Build Command is `npm install` (not in root)
- Verify Start Command is `npm start` (not `node node_modules/expo/AppEntry.js`)

**Backend not starting?**
- Check logs in Render dashboard
- Verify all environment variables are set
- Make sure MongoDB URI is correct
