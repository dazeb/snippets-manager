# Deployment Guide

This application is a **Single Page Application (SPA)** built with React + Vite and uses Convex as a serverless backend. **You do NOT need nginx or complex server setup.**

## 🚀 Recommended Deployment Options (No Server Required)

### Option 1: Vercel (Recommended)

**Why Vercel?**
- ✅ Perfect for React + Convex applications
- ✅ Automatic deployments from Git
- ✅ Built-in CDN and edge optimization
- ✅ Zero configuration needed
- ✅ Free tier available

**Steps:**
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variable in Vercel dashboard:
   - **Name**: `VITE_CONVEX_URL`
   - **Value**: Your Convex deployment URL (from `.env.local`)
4. Deploy automatically on every push

**Configuration:** Already included in `vercel.json`

### Option 2: Netlify

**Why Netlify?**
- ✅ Great for static sites and SPAs
- ✅ Automatic deployments
- ✅ Built-in form handling
- ✅ Free tier available

**Steps:**
1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Set build command: `pnpm build`
4. Set publish directory: `dist`
5. Set environment variable in Netlify dashboard:
   - **Name**: `VITE_CONVEX_URL`
   - **Value**: Your Convex deployment URL (from `.env.local`)

**Configuration:** Already included in `netlify.toml`

## 🔧 Environment Variables

All deployment options need:

```
VITE_CONVEX_URL=your-convex-deployment-url
```

**How to get your Convex URL:**
1. Run `pnpm dev` locally
2. Check `.env.local` file for `CONVEX_DEPLOYMENT` value
3. Use this URL as `VITE_CONVEX_URL` in production

## 📦 Build Process

The application builds to static files:

```bash
pnpm build
```

Output directory: `dist/`

## 🌐 Why No Server Needed?

1. **Frontend**: React SPA (static files)
2. **Backend**: Convex (serverless)
3. **Database**: Convex (managed)
4. **Authentication**: Convex Auth (handled)
5. **API**: Convex functions (serverless)

## Prerequisites (For Manual Deployment)

### 1. Set up Environment Variables

**IMPORTANT**: Never commit production keys to git!

Create a `.env.production` file (already gitignored):

```bash
# Copy the template
cp .env.example .env.production

# Edit with your production values
CONVEX_DEPLOY_KEY=prod:tough-orca-727|your-actual-key
VITE_CONVEX_URL=https://tough-orca-727.convex.cloud
NODE_ENV=production
```

### 2. Deploy Backend

Deploy the Convex backend functions:

```bash
# Load production environment and deploy
export $(cat .env.production | xargs) && pnpm run deploy:backend
```

### 3. Build Frontend

Build the frontend for production:

```bash
# Build with production environment
export $(cat .env.production | xargs) && pnpm run build
```

### 4. Full Production Deployment

Deploy both backend and frontend:

```bash
# Full deployment with production environment
export $(cat .env.production | xargs) && pnpm run deploy:prod
```

## Environment Management

### Development
- Use `npx convex dev` for local development
- Environment variables are set automatically

### Production
- Use the production deployment key
- Set `VITE_CONVEX_URL` to production URL
- Ensure `NODE_ENV=production`

## Security Notes

1. **Never commit** `.env.production` or any file containing the deployment key
2. The deployment key is already added to `.gitignore`
3. Use environment variables in CI/CD pipelines
4. Rotate keys regularly for security

## Troubleshooting

### Common Issues

1. **Invalid deployment key**: Ensure the key is correctly formatted
2. **Wrong environment**: Check `VITE_CONVEX_URL` matches your deployment
3. **Build failures**: Run `pnpm install` and check TypeScript errors

### Verification

After deployment, verify:
- Backend functions are deployed to production
- Frontend connects to production Convex URL
- Authentication works correctly
- All features function as expected

## 🚫 What You DON'T Need

- ❌ nginx
- ❌ Apache
- ❌ Express server
- ❌ Complex Docker setup
- ❌ Load balancers
- ❌ Database servers
- ❌ Authentication servers

Your app is **serverless and static** - keep it simple! 🎉

## 🚨 Troubleshooting MIME Type Issues

If you encounter the error: `Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "application/octet-stream"`

### **Root Cause:**
The web server is serving JavaScript files with the wrong MIME type.

### **Solutions by Platform:**

#### **Vercel/Netlify (Recommended):**
- ✅ **Already configured** in `vercel.json` and `netlify.toml`
- ✅ **Automatic MIME type handling**
- ✅ **No additional configuration needed**

#### **Custom Server/Docker:**
1. **Use nginx configuration** (included in `nginx.conf`)
2. **Use Node.js server** (included in `server.js`)
3. **Ensure proper Content-Type headers** for `.js` and `.mjs` files

#### **Manual Fix:**
Ensure your server sends these headers:
```
Content-Type: text/javascript; charset=utf-8
```

For JavaScript files (`.js`, `.mjs`)

## 🐳 Docker (Not Recommended)

If you must use Docker, the updated `Dockerfile` uses a simple static server instead of nginx:

```bash
# Build the image
docker build -t snippets-manager .

# Run the container
docker run -p 3000:3000 snippets-manager
```

**Why not recommended?**
- ❌ Overkill for a static SPA
- ❌ More complex than needed
- ❌ Hosting platforms are better optimized
- ❌ No automatic scaling
- ❌ Manual SSL/CDN setup required

### Option 2: Simple Single-stage Build

Use the simple Dockerfile for platforms like Railway:

```bash
# Build the image
docker build -f Dockerfile.simple -t snippets-manager-simple .

# Run the container (Railway will set PORT automatically)
docker run -p 3000:3000 -e PORT=3000 snippets-manager-simple
```

## Railway Deployment

The project is configured for Railway deployment with:

- `railway.toml` - Railway configuration
- `nixpacks.toml` - Nixpacks build configuration
- Fixed `pnpm-workspace.yaml` - Resolves "packages field missing" error

### Deploy to Railway

1. Connect your GitHub repository to Railway
2. Railway will automatically detect the configuration
3. Set environment variables in Railway dashboard:
   ```
   CONVEX_DEPLOY_KEY=prod:your-key
   VITE_CONVEX_URL=https://your-deployment.convex.cloud
   NODE_ENV=production
   ```

## CI/CD Integration

For automated deployments, set these environment variables in your CI/CD system:

```bash
CONVEX_DEPLOY_KEY=prod:tough-orca-727|your-key
VITE_CONVEX_URL=https://tough-orca-727.convex.cloud
NODE_ENV=production
```

Then use the deployment scripts:

```bash
pnpm install
pnpm run deploy:prod
```
