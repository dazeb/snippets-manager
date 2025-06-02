# Deployment Setup Guide

This guide walks you through setting up your Snippets Manager for production deployment.

## 🔑 Environment Variables Setup

Your application needs the Convex deployment URL to connect to your backend.

### Step 1: Get Your Convex Deployment URL

1. **Run your development server locally:**
   ```bash
   pnpm dev
   ```

2. **Check your `.env.local` file:**
   ```bash
   cat .env.local
   ```
   
   You should see something like:
   ```
   CONVEX_DEPLOYMENT=https://your-deployment-name.convex.cloud
   ```

3. **Copy this URL** - you'll need it for deployment.

## 🚀 Platform-Specific Setup

### Option 1: Vercel Deployment (Recommended)

#### **Step 1: Connect Your Repository**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository

#### **Step 2: Configure Environment Variables**
1. In the Vercel dashboard, go to your project
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - **Name**: `VITE_CONVEX_URL`
   - **Value**: Your Convex deployment URL (from `.env.local`)
   - **Environment**: Production, Preview, Development

#### **Step 3: Deploy**
1. Click "Deploy" or push to your main branch
2. Vercel will automatically build and deploy your app

### Option 2: Netlify Deployment

#### **Step 1: Connect Your Repository**
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository

#### **Step 2: Configure Build Settings**
- **Build command**: `pnpm build`
- **Publish directory**: `dist`

#### **Step 3: Configure Environment Variables**
1. In Netlify dashboard, go to **Site settings** → **Environment variables**
2. Add:
   - **Key**: `VITE_CONVEX_URL`
   - **Value**: Your Convex deployment URL

#### **Step 4: Deploy**
1. Click "Deploy site"
2. Netlify will build and deploy automatically

### Option 3: Manual Environment Variable Setup

If you're using a different platform, ensure these environment variables are set:

```bash
# Required for production
VITE_CONVEX_URL=https://your-deployment-name.convex.cloud

# Optional: Set Node environment
NODE_ENV=production
```

## 🔧 Convex Production Setup

### Step 1: Create Production Deployment

```bash
# Deploy your Convex functions to production
npx convex deploy --prod
```

### Step 2: Update Environment Variable

After deploying to production, update your hosting platform's environment variable with the production Convex URL.

## ✅ Verification Steps

### 1. Check Build Logs
- Ensure no environment variable errors
- Verify successful build completion

### 2. Test Deployed Application
- Visit your deployed URL
- Try logging in
- Create a test snippet/prompt
- Verify all functionality works

### 3. Monitor Console
- Open browser developer tools
- Check for any JavaScript errors
- Ensure no CORS or connection issues

## 🚨 Troubleshooting

### Error: "CONVEX_DEPLOYMENT references Secret which does not exist"

**Solution**: Remove secret references and use environment variables instead.

1. **Check vercel.json** - should not reference `@convex_deployment`
2. **Set environment variable** manually in platform dashboard
3. **Use VITE_CONVEX_URL** instead of CONVEX_DEPLOYMENT

### Error: "Failed to connect to Convex"

**Solutions**:
1. **Verify environment variable** is set correctly
2. **Check Convex deployment** is active
3. **Ensure URL format** is correct (starts with https://)

### Error: "Authentication not working"

**Solutions**:
1. **Check Convex Auth configuration** in production
2. **Verify domain settings** in Convex dashboard
3. **Update allowed origins** for your production domain

## 📝 Quick Reference

### Environment Variables
- **Development**: `CONVEX_DEPLOYMENT` (in .env.local)
- **Production**: `VITE_CONVEX_URL` (in hosting platform)

### Commands
- **Local development**: `pnpm dev`
- **Build for production**: `pnpm build`
- **Deploy Convex**: `npx convex deploy --prod`
- **Preview build**: `pnpm preview`

### URLs to Configure
- **Convex Dashboard**: Update allowed origins
- **Hosting Platform**: Set environment variables
- **Domain Settings**: Configure custom domain if needed
