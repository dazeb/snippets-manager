#!/bin/bash

# Production Deployment Script for Snippets Manager
# This script deploys the Convex backend and builds the frontend for production

set -e  # Exit on any error

echo "🚀 Starting production deployment..."

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please create .env.production with your production environment variables."
    exit 1
fi

echo "📋 Loading production environment variables..."
export $(cat .env.production | grep -v '^#' | xargs)

# Verify required environment variables
if [ -z "$CONVEX_DEPLOY_KEY" ]; then
    echo "❌ Error: CONVEX_DEPLOY_KEY not set in .env.production"
    exit 1
fi

if [ -z "$VITE_CONVEX_URL" ]; then
    echo "❌ Error: VITE_CONVEX_URL not set in .env.production"
    exit 1
fi

echo "✅ Environment variables loaded successfully"
echo "📦 Installing dependencies..."
pnpm install

echo "🔧 Deploying Convex backend..."
pnpm run deploy:backend

echo "🏗️  Building frontend for production..."
pnpm run build

echo "✅ Production deployment completed successfully!"
echo ""
echo "📁 Frontend built to: ./dist/"
echo "🌐 Convex backend deployed to: $VITE_CONVEX_URL"
echo ""
echo "Next steps:"
echo "1. Upload the ./dist/ folder to your hosting platform"
echo "2. Set VITE_CONVEX_URL environment variable on your hosting platform"
echo "3. Your app should be live!"
