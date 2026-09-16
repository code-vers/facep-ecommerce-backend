# Comprehensive Hosting Guide: Facep E-commerce

This guide provides detailed, step-by-step instructions for manually deploying the Facep E-commerce frontend and backend on your AlmaLinux 9 VPS (`72.167.47.110`) using Nginx, PM2, and a local PostgreSQL database.

---

## 1. Initial Server Setup
First, log into your server via SSH as the root user or a user with `sudo` privileges.

```bash
ssh million@72.167.47.110
```

Update your system packages and install essential build tools and Git:
```bash
sudo dnf update -y
sudo dnf install -y git curl wget nano epel-release
```

---

## 2. PostgreSQL Setup
Since you are using a local database, we will install PostgreSQL directly on AlmaLinux 9.

**Install and initialize PostgreSQL:**
```bash
sudo dnf install -y postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl enable --now postgresql
```

**Create the database and user:**
Log into the Postgres prompt:
```bash
sudo -u postgres psql
```
Run the following SQL commands (replace `your_secure_password` with a strong password):
```sql
CREATE DATABASE facep_db;
CREATE USER million WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE facep_db TO million;
ALTER DATABASE facep_db OWNER TO million;
\q
```

---

## 3. Node.js & PM2 Installation
We will use NVM (Node Version Manager) to install Node.js, ensuring we get the latest LTS version suitable for Next.js 15+ and Express.

**Install NVM and Node.js:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

**Install PM2 Globally:**
PM2 will keep your Node applications alive forever and restart them if the server reboots.
```bash
npm install -g pm2
pm2 startup
# Run the command PM2 outputs in the terminal to configure startup
```

---

## 4. Project Cloning
Navigate to the directory where you want to host your files (typically `/home/million/public_html` or a dedicated app folder):

```bash
cd /home/million
mkdir facep-ecommerce
cd facep-ecommerce

# Clone your repositories here
git clone <YOUR_BACKEND_REPO_URL> facep-ecommerce-backend
git clone <YOUR_FRONTEND_REPO_URL> facep-ecommerce-frontend
```

---

## 5. Backend Setup & Deployment

**1. Install Dependencies:**
```bash
cd /home/million/facep-ecommerce/facep-ecommerce-backend
npm install
```

**2. Configure Environment Variables:**
Create the `.env` file:
```bash
nano .env
```
Add your variables, specifically the `DATABASE_URL`. Ensure it matches the user/password we created in Step 2:
```env
PORT=5000
DATABASE_URL="postgresql://million:your_secure_password@localhost:5432/facep_db?schema=public"
# Add other required variables (JWT_SECRET, STRIPE_SECRET, etc.)
```

**3. Database Migration & Build:**
```bash
npx prisma generate
npx prisma migrate deploy
npm run build
```

**4. Start Backend with PM2:**
```bash
pm2 start dist/server.js --name "facep-backend"
```

---

## 6. Frontend Setup & Deployment

**1. Install Dependencies:**
```bash
cd /home/million/facep-ecommerce/facep-ecommerce-frontend
npm install
```

**2. Configure Environment Variables:**
```bash
nano .env.local
```
Point the frontend to your backend API domain:
```env
NEXT_PUBLIC_API_URL=https://api.many-products.many-faces.com
```

**3. Build the Next.js Application:**
```bash
npm run build
```

**4. Start Frontend with PM2:**
Next.js starts differently than standard Node apps. We run the `npm start` script through PM2:
```bash
pm2 start npm --name "facep-frontend" -- start
```

**5. Save PM2 State:**
Save the current PM2 list so they restart automatically on server reboot:
```bash
pm2 save
```

---

## 7. Nginx Configuration

> ⚠️ **IMPORTANT NOTE FOR cPanel USERS:** 
> cPanel uses a system called EasyApache 4. If Nginx is installed via cPanel, modifying the main `/etc/nginx/nginx.conf` or dropping files into `/etc/nginx/conf.d/` might get overwritten by cPanel updates. 
> Typically, in a cPanel environment, you should place custom server blocks inside `/etc/nginx/conf.d/users/million/` or use the **cPanel > Application Manager** UI to setup reverse proxies.
> Assuming you are bypassing cPanel's generator, here are the configurations.

Install Nginx (if not already installed via cPanel):
```bash
sudo dnf install nginx -y
sudo systemctl enable --now nginx
```

Create server blocks for both domains. 

**Backend Nginx Config (`api.many-products.many-faces.com`):**
```bash
sudo nano /etc/nginx/conf.d/facep-backend.conf
```
*Content:*
```nginx
server {
    listen 80;
    server_name api.many-products.many-faces.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Frontend Nginx Config (`many-products.many-faces.com`):**
```bash
sudo nano /etc/nginx/conf.d/facep-frontend.conf
```
*Content:*
```nginx
server {
    listen 80;
    server_name many-products.many-faces.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Test and restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 8. SSL/HTTPS Setup

### Option A: Using cPanel's AutoSSL (Recommended)
Since you have cPanel, the easiest way to secure your domains is to let cPanel handle it:
1. Point the A Records for `many-products.many-faces.com` and `api.many-products.many-faces.com` to your server IP (`72.167.47.110`) in your DNS registrar.
2. Log in to your **cPanel Account (million)**.
3. Add `many-products.many-faces.com` and `api.many-products.many-faces.com` as Domains/Subdomains in the Domains section.
4. Go to **SSL/TLS Status**.
5. Select both domains and click **Run AutoSSL**.
6. Wait 5-10 minutes. cPanel will automatically issue the certificates and update the Nginx configurations.

### Option B: Using Certbot (Manual Terminal Route)
If AutoSSL fails or you prefer to do it manually in the terminal via Let's Encrypt:

**1. Install Certbot for Nginx on AlmaLinux 9:**
```bash
sudo dnf install certbot python3-certbot-nginx -y
```

**2. Issue the Certificates:**
Run the following command. Certbot will automatically read your Nginx `.conf` files, fetch the certificates, and rewrite your configs to listen on port 443 (HTTPS).
```bash
sudo certbot --nginx -d many-products.many-faces.com -d api.many-products.many-faces.com
```

**3. Test Auto-Renewal:**
```bash
sudo certbot renew --dry-run
```

---
**Done!** Your backend API will now be accessible securely over `https://api.many-products.many-faces.com`, and your Next.js application over `https://many-products.many-faces.com`.
