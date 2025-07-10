#!/bin/bash

set -e  # Exit on any error

echo "🔁 Pulling latest project code..."
cd /var/www/ELIE_SANON_LLC
git pull origin main

echo "📦 Updating frontend (docs)..."
cd /var/www/ELIE_SANON_LLC/docs
git pull origin main
chown -R www-data:www-data .

echo "⚙️ Updating backend dependencies..."
cd /var/www/ELIE_SANON_LLC/Backend
git pull origin main
npm install

echo "🚀 Restarting backend with PM2..."
pm2 restart "Elie-backend" --update-env

echo "✅ Deployment complete for ELIE_SANON_LLC!"
