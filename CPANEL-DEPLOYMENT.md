# cPanel Deployment Guide for AE Music Lab

This guide will help you deploy the AE Music Lab website to your cPanel hosting.

---

## Prerequisites

- cPanel hosting with Node.js support
- MySQL database
- SSH/Terminal access (optional but recommended)
- Domain configured in cPanel

---

## Step 1: Upload Files

### Option A: Using File Manager
1. Log into cPanel
2. Go to **File Manager**
3. Navigate to your domain's root directory (usually `public_html` or `www`)
4. Upload the entire project folder from GitHub: https://github.com/osasbenny/aemusiclab
5. Extract if uploaded as ZIP

### Option B: Using Git (Recommended)
1. Open **Terminal** in cPanel
2. Navigate to your web root:
   ```bash
   cd ~/public_html
   ```
3. Clone the repository:
   ```bash
   git clone https://github.com/osasbenny/aemusiclab.git
   cd aemusiclab
   ```

---

## Step 2: Set Up Node.js Application

1. In cPanel, search for **"Setup Node.js App"**
2. Click **"Create Application"**
3. Configure as follows:
   - **Node.js version:** 18.x or higher
   - **Application mode:** Production
   - **Application root:** `/home/yourusername/public_html/aemusiclab` (adjust path)
   - **Application URL:** Leave empty or set to your domain
   - **Application startup file:** `dist/index.js`
   - **Passenger log file:** Leave default

4. Click **"Create"**

---

## Step 3: Install Dependencies

1. In the Node.js App interface, click **"Run NPM Install"**
   
   OR use Terminal:
   ```bash
   cd ~/public_html/aemusiclab
   npm install --production
   ```

---

## Step 4: Build the Project

In Terminal, run:
```bash
cd ~/public_html/aemusiclab
npm run build
```

This creates the `dist/` folder with production files.

---

## Step 5: Configure Environment Variables

1. In cPanel Node.js App interface, scroll to **"Environment Variables"**
2. Add these variables:

### Required Variables:

```
DATABASE_URL=mysql://username:password@localhost:3306/database_name
JWT_SECRET=your-random-32-character-secret-key-here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### SMTP Variables (for email notifications):

```
SMTP_HOST=aemusic.chevwellconsulting.com
SMTP_PORT=465
SMTP_USER=admin@aemusic.chevwellconsulting.com
SMTP_PASS=+!(VLKmHq^45m*,y
SMTP_FROM=admin@aemusic.chevwellconsulting.com
```

### OAuth Variables (if using Manus auth):

```
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=your-app-id
OWNER_OPEN_ID=your-owner-openid
OWNER_NAME=Your Name
```

---

## Step 6: Set Up Database

1. In cPanel, go to **MySQL Databases**
2. Create a new database (e.g., `aemusiclab_db`)
3. Create a database user with a strong password
4. Add the user to the database with **ALL PRIVILEGES**
5. Note the connection details for `DATABASE_URL`

### Run Database Migrations:

In Terminal:
```bash
cd ~/public_html/aemusiclab
npm run db:push
```

### Seed Sample Data (Optional):

```bash
node seed-beats.mjs
```

---

## Step 7: Configure Domain Routing

### For Root Domain (aemusiclab.com):

1. In cPanel, go to **Domains**
2. Set document root to: `/home/yourusername/public_html/aemusiclab/dist/public`

### For Subdomain (app.yourdomain.com):

1. Create subdomain in cPanel
2. Point to: `/home/yourusername/public_html/aemusiclab/dist/public`

---

## Step 8: Start the Application

1. Go back to **Setup Node.js App**
2. Find your application
3. Click **"Restart"** or **"Start"**
4. Verify status shows **"Running"**

---

## Step 9: Configure Stripe Webhooks

1. Log into Stripe Dashboard
2. Go to **Developers → Webhooks**
3. Click **"Add endpoint"**
4. Enter URL: `https://yourdomain.com/api/stripe/webhook`
5. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
6. Copy the **Signing secret** and add to environment variables as `STRIPE_WEBHOOK_SECRET`

---

## Troubleshooting

### Issue 1: 404 Error on Page Reload

**Cause:** Server not redirecting SPA routes to index.html

**Solution:** The `.htaccess` file in `dist/public/` should handle this. If not working:

1. Verify `.htaccess` exists in `dist/public/`
2. Check if `mod_rewrite` is enabled in cPanel
3. Ensure document root points to `dist/public/` not root

### Issue 2: "Unexpected token '<', '<!DOCTYPE'..." Error

**Cause:** Node.js app is not running, so API requests hit Apache instead

**Solutions:**

1. **Verify Node.js app is running:**
   - Go to cPanel → Setup Node.js App
   - Check status is "Running"
   - Click "Restart" if stopped

2. **Check application startup file:**
   - Should be `dist/index.js`
   - Verify file exists: `ls -la ~/public_html/aemusiclab/dist/index.js`

3. **Check environment variables:**
   - All required variables must be set
   - No typos in variable names

4. **View application logs:**
   - In Node.js App interface, click "Run" next to "Passenger log file"
   - Look for errors

5. **Test API endpoint directly:**
   ```bash
   curl https://yourdomain.com/api/trpc/beats.list
   ```
   Should return JSON, not HTML

### Issue 3: Database Connection Errors

**Solutions:**

1. Verify `DATABASE_URL` format:
   ```
   mysql://username:password@localhost:3306/database_name
   ```

2. Test database connection in Terminal:
   ```bash
   mysql -u username -p database_name
   ```

3. Check user has correct privileges:
   - Go to cPanel → MySQL Databases
   - Verify user is added to database with ALL PRIVILEGES

### Issue 4: Email Not Sending

**Solutions:**

1. Verify all SMTP variables are set correctly
2. Test SMTP connection:
   ```bash
   telnet aemusic.chevwellconsulting.com 465
   ```

3. Check firewall isn't blocking port 465
4. Try port 587 with TLS instead of 465 with SSL

### Issue 5: Stripe Payments Not Working

**Solutions:**

1. Verify webhook endpoint is accessible:
   ```bash
   curl -X POST https://yourdomain.com/api/stripe/webhook
   ```

2. Check Stripe webhook logs in Dashboard
3. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
4. Test with Stripe test card: `4242 4242 4242 4242`

---

## Performance Optimization

### Enable Gzip Compression

Already configured in `.htaccess`, but verify:
```bash
curl -H "Accept-Encoding: gzip" -I https://yourdomain.com
```

Should see `Content-Encoding: gzip` in response

### Enable Browser Caching

Already configured in `.htaccess` for static assets

### Monitor Application

1. Check logs regularly:
   - Node.js App → Passenger log file
   - cPanel → Error Log

2. Monitor resource usage:
   - cPanel → CPU and Concurrent Connection Usage

---

## Updating the Application

### Method 1: Git Pull (Recommended)

```bash
cd ~/public_html/aemusiclab
git pull origin main
npm install --production
npm run build
```

Then restart the Node.js app in cPanel.

### Method 2: Manual Upload

1. Download latest from GitHub
2. Upload and replace files
3. Rebuild: `npm run build`
4. Restart Node.js app

---

## Security Checklist

- [ ] Strong database password set
- [ ] JWT_SECRET is random and secure (32+ characters)
- [ ] SMTP credentials are correct
- [ ] Stripe keys are in production mode (not test mode) for live site
- [ ] `.env` file is NOT uploaded (use cPanel environment variables)
- [ ] File permissions are correct (644 for files, 755 for directories)
- [ ] SSL certificate is installed and HTTPS is enforced

---

## Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] Sample data seeded (optional)
- [ ] Node.js app is running
- [ ] Test all pages load without 404 errors
- [ ] Test form submissions work
- [ ] Test Stripe payment flow with test card
- [ ] Test email notifications are received
- [ ] Verify Stripe webhook is receiving events
- [ ] SSL certificate installed
- [ ] Custom domain configured
- [ ] Backup strategy in place

---

## Support

If you encounter issues not covered here:

1. Check Node.js app logs in cPanel
2. Check Apache error logs in cPanel
3. Verify all environment variables are set
4. Ensure Node.js app is running
5. Test API endpoints directly with curl

For Stripe-specific issues, check the Stripe Dashboard → Developers → Logs

---

## Quick Reference

### Important Paths:
- Project root: `/home/yourusername/public_html/aemusiclab`
- Public files: `/home/yourusername/public_html/aemusiclab/dist/public`
- Server file: `/home/yourusername/public_html/aemusiclab/dist/index.js`

### Important URLs:
- Website: `https://yourdomain.com`
- API base: `https://yourdomain.com/api`
- Stripe webhook: `https://yourdomain.com/api/stripe/webhook`

### Important Commands:
```bash
# Navigate to project
cd ~/public_html/aemusiclab

# Install dependencies
npm install --production

# Build project
npm run build

# Run database migrations
npm run db:push

# Seed sample data
node seed-beats.mjs
```

---

**Deployment Date:** January 2026  
**Version:** 1.0.0  
**Support:** Check GitHub repository for updates
