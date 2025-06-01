# Deployment Guide

This guide explains how to deploy the Code Snippet Manager to production.

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Convex production deployment key
- Access to the production Convex deployment

## Production Deployment

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

## Docker Deployment

### Option 1: Multi-stage Production Build (Recommended)

Use the main Dockerfile for production deployments with nginx:

```bash
# Build the image
docker build -t snippets-manager .

# Run the container
docker run -p 80:80 snippets-manager
```

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
