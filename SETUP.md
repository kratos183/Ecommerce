# Redeployment Guide

## Quick Redeploy Steps

### Option 1: Automatic Redeployment (Recommended)

If your app is connected to GitHub and Vercel:

1. **Push changes to GitHub**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Vercel auto-deploys** - Your app will automatically redeploy within 1-2 minutes

### Option 2: Manual Redeploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **"Deployments"** tab
4. Click **"Redeploy"** on the latest deployment
5. Confirm the redeployment

### Option 3: Redeploy via Vercel CLI

1. **Install Vercel CLI** (if not installed)
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## Update Environment Variables

If you need to update environment variables:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update the variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV` (set to `production`)
   - `NEXT_PUBLIC_API_URL` (your production URL)
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
5. Click **"Redeploy"** to apply changes

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally to test

### Environment Variables Not Working
- Redeploy after updating env vars
- Ensure `NEXT_PUBLIC_` prefix for client-side variables

### OAuth Issues
- Update OAuth redirect URIs in Google/GitHub console with your production URL
- Format: `https://your-domain.vercel.app/api/auth/callback/google`

## Local Testing Before Deploy

```bash
# Install dependencies
npm install

# Build production version
npm run build

# Test production build locally
npm start
```

## Rollback to Previous Version

1. Go to Vercel Dashboard → **Deployments**
2. Find the working deployment
3. Click **"..."** → **"Promote to Production"**
