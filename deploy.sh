#!/bin/bash
# Deployment script for Qala Kurdish Chat Application

# Exit on any error
set -e

echo "Starting deployment process..."

# 1. Check if .env file exists
if [ ! -f .env ]; then
  echo "Error: .env file not found. Please create one before deploying."
  exit 1
fi

# 2. Install dependencies
echo "Installing dependencies..."
npm install --production

# 3. Build for production
echo "Building application for production..."
NODE_ENV=production npm run build

# 4. Set up environment for production
echo "Setting up production environment..."
export NODE_ENV=production

# 5. Start the application
echo "Starting application..."

# Check if we're using PM2 for process management
if command -v pm2 &> /dev/null; then
  echo "Using PM2 for process management..."
  pm2 start "npm run start" --name qala-chat
else
  echo "Starting directly with Node..."
  npm run start
fi

echo "Deployment complete! Application is now running."
echo "For better production deployment, consider using:"
echo "- PM2 for process management"
echo "- Nginx as a reverse proxy"
echo "- Let's Encrypt for SSL"