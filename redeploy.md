# Facep E-Commerce: Redeployment Guide

This guide provides simple, step-by-step instructions to redeploy your changes to the live production server (`72.167.47.110`) after you make changes on your local machine.

---

## 📋 Table of Contents
1. [Step 1: Push Changes from Your Local Machine](#step-1-push-changes-from-your-local-machine)
2. [Step 2: Connect to the Server](#step-2-connect-to-the-server)
3. [🚀 Quick Full Redeploy (Frontend + Backend)](#-quick-full-redeploy-frontend--backend)
4. [⚡ Frontend-Only Redeploy](#-frontend-only-redeploy)
5. [⚡ Backend-Only Redeploy](#-backend-only-redeploy)
6. [🔍 Verification & Health Checks](#-verification--health-checks)
7. [🛠️ Troubleshooting Common Issues](#️-troubleshooting-common-issues)

---

## Step 1: Push Changes from Your Local Machine

Before deploying to the server, ensure all your local changes are committed and pushed to GitHub.

### If you modified the Frontend:
```bash
cd /Users/faysal/Office/FBInt/Facep/facep-ecommerce-frontend
git add .
git commit -m "feat: your frontend changes description"
git push origin main
```

### If you modified the Backend:
```bash
cd /Users/faysal/Office/FBInt/Facep/facep-ecommerce-backend
git add .
git commit -m "feat: your backend changes description"
git push origin main
```

---

## Step 2: Connect to the Server

Open your terminal and SSH into your AlmaLinux VPS:

```bash
ssh million@72.167.47.110
```

---

## 🚀 Quick Full Redeploy (Frontend + Backend)

If you made changes to **both** frontend and backend (or want a clean, complete update), run this single script block on the server:

```bash
# ==========================================
# 1. UPDATE BACKEND
# ==========================================
cd /home/million/facep-ecommerce/facep-ecommerce-backend
echo "📥 Pulling backend..."
git pull origin main

echo "📦 Installing backend dependencies..."
npm install

echo "🔄 Generating Prisma client & building..."
npx prisma generate
npm run build

echo "♻️ Restarting backend process..."
pm2 restart facep-backend

# ==========================================
# 2. UPDATE FRONTEND
# ==========================================
cd /home/million/facep-ecommerce/facep-ecommerce-frontend
echo "📥 Pulling frontend..."
git pull origin main

echo "📦 Installing frontend dependencies..."
npm install

echo "🏗️ Building Next.js frontend..."
npm run build

echo "♻️ Restarting frontend process..."
pm2 restart facep-frontend

# ==========================================
# 3. VERIFY PROCESSES
# ==========================================
pm2 status
```

---

## ⚡ Frontend-Only Redeploy

Use this when you **only modified frontend files** (pages, UI components, styles, navbar, etc.):

```bash
cd /home/million/facep-ecommerce/facep-ecommerce-frontend

# 1. Pull latest code
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Build Next.js
npm run build

# 4. Restart PM2 frontend process
pm2 restart facep-frontend

# 5. Check status
pm2 status
```

> **Tip:** For zero-downtime reload on the frontend, you can use:
> ```bash
> pm2 reload facep-frontend
> ```

---

## ⚡ Backend-Only Redeploy

Use this when you **only modified backend files** (controllers, routes, services, Prisma schema, etc.):

```bash
cd /home/million/facep-ecommerce/facep-ecommerce-backend

# 1. Pull latest code
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Regenerate Prisma Client (if database/schema changed)
npx prisma generate

# 4. Apply database changes (if schema was modified)
npx prisma db push

# 5. Build TypeScript into dist/
npm run build

# 6. Restart PM2 backend process
pm2 restart facep-backend

# 7. Check status
pm2 status
```

---

## 🔍 Verification & Health Checks

Run these commands on the server to ensure both services are running and responding properly:

### 1. Check PM2 Process Table:
```bash
pm2 status
```
*Both `facep-backend` and `facep-frontend` should show `status: online`.*

### 2. Test Local Ports:
```bash
# Check Backend API (port 5000)
curl -I http://localhost:5000

# Check Frontend Next.js (port 3000)
curl -I http://localhost:3000
```
*Both should return `HTTP/1.1 200 OK`.*

### 3. Test Public HTTPS Domains:
```bash
# Test Frontend
curl -I https://many-products.many-faces.com

# Test Backend API
curl -I https://api.many-products.many-faces.com
```

---

## 🛠️ Troubleshooting Common Issues

### Issue 1: `git pull` fails with "Your local changes would be overwritten"
If files on the server were modified directly, stash them before pulling:
```bash
git stash
git pull origin main
```

### Issue 2: Frontend build fails or hangs (`npm run build`)
If Next.js cache is corrupted, delete the `.next` directory and rebuild:
```bash
cd /home/million/facep-ecommerce/facep-ecommerce-frontend
rm -rf .next
npm run build
pm2 restart facep-frontend
```

### Issue 3: Server memory runs out during `npm run build`
Next.js build can use high memory. If the build is killed by OOM (Out Of Memory):
```bash
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

### Issue 4: View Live Logs to Debug Errors
To see real-time error logs for any service:
```bash
# View backend logs:
pm2 logs facep-backend --lines 50

# View frontend logs:
pm2 logs facep-frontend --lines 50

# View all combined logs:
pm2 logs --lines 20
```

### Issue 5: Missing Category / Product Seed Images
If images show 404 errors, copy the seed images from frontend to backend:
```bash
mkdir -p /home/million/facep-ecommerce/facep-ecommerce-backend/uploads/categories
cp /home/million/facep-ecommerce/facep-ecommerce-frontend/public/figma/browsing-history/product-*.jpg /home/million/facep-ecommerce/facep-ecommerce-backend/uploads/categories/
cp /home/million/facep-ecommerce/facep-ecommerce-frontend/public/banner.png /home/million/facep-ecommerce/facep-ecommerce-backend/uploads/categories/
```

### Issue 6: Restart Nginx (if reverse proxy is not responding)
```bash
sudo nginx -t
sudo systemctl restart nginx
```
