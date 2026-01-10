# Deploy AE Music Lab to Render

This guide will walk you through deploying your complete AE Music Lab website to Render.com and connecting your custom domain.

## Prerequisites

- GitHub account (you already have this)
- Render account (free to create)
- Your custom domain
- Access to your domain's DNS settings

## Part 1: Create Render Account & Connect GitHub

### Step 1: Sign Up for Render

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started"** or **"Sign Up"**
3. Choose **"Sign up with GitHub"** (easiest option)
4. Authorize Render to access your GitHub account
5. Complete your profile setup

### Step 2: Connect Your GitHub Repository

1. Once logged in, you'll see the Render Dashboard
2. Render will automatically have access to your GitHub repositories
3. You're ready to create your first web service

## Part 2: Create Database on Render

Your app needs a MySQL database. Render doesn't offer MySQL directly, so we'll use a free external option.

### Option A: Use Render PostgreSQL (Recommended - Free Tier)

**Note:** This requires converting your database from MySQL to PostgreSQL. Skip to Option B if you prefer MySQL.

1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Fill in:
   - **Name:** `aemusiclab-db`
   - **Database:** `aemusiclab`
   - **User:** `aemusiclab_user`
   - **Region:** Choose closest to your location
   - **Plan:** Select **"Free"**
3. Click **"Create Database"**
4. Wait 1-2 minutes for database to be created
5. Click on the database name to view details
6. **Copy the "External Database URL"** - you'll need this later

### Option B: Use External MySQL Database

Use a free MySQL hosting service:

**Recommended: PlanetScale (Free Tier)**
1. Go to [https://planetscale.com](https://planetscale.com)
2. Sign up with GitHub
3. Create new database: `aemusiclab`
4. Get connection string from dashboard
5. Copy the connection URL

**Alternative: Aiven (Free Tier)**
1. Go to [https://aiven.io](https://aiven.io)
2. Sign up and create MySQL service
3. Choose free tier
4. Copy connection string

## Part 3: Deploy Your Application to Render

### Step 1: Create Web Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Click **"Build and deploy from a Git repository"**
3. Click **"Connect a repository"**
4. Find and select **"osasbenny/aemusiclab"**
5. Click **"Connect"**

### Step 2: Configure Web Service

Fill in the following settings:

**Basic Settings:**
- **Name:** `aemusiclab` (this will be part of your Render URL)
- **Region:** Choose closest to your location (e.g., Oregon USA)
- **Branch:** `main`
- **Root Directory:** Leave blank
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**Instance Type:**
- Select **"Free"** (or "Starter" if you need better performance - $7/month)

### Step 3: Add Environment Variables

Scroll down to **"Environment Variables"** section and click **"Add Environment Variable"**. Add each of these:

#### Required Variables:

```
DATABASE_URL
Value: [Paste your database connection URL from Part 2]

JWT_SECRET
Value: [Generate a random 32+ character string - use: https://randomkeygen.com]

NODE_ENV
Value: production

ADMIN_EMAIL
Value: cactusdigitalmedialtd@gmail.com

SMTP_HOST
Value: aemusic.chevwellconsulting.com

SMTP_PORT
Value: 465

SMTP_USER
Value: admin@aemusic.chevwellconsulting.com

SMTP_PASS
Value: +!(VLKmHq^45m*,y

SMTP_FROM
Value: admin@aemusic.chevwellconsulting.com

SITE_NAME
Value: AE Music Lab

SITE_URL
Value: https://aemusiclab.onrender.com (update this after adding custom domain)
```

#### Stripe Variables (from your Stripe dashboard):

```
STRIPE_SECRET_KEY
Value: [Your Stripe secret key - starts with sk_]

STRIPE_PUBLISHABLE_KEY
Value: [Your Stripe publishable key - starts with pk_]

STRIPE_WEBHOOK_SECRET
Value: [Your Stripe webhook secret - starts with whsec_]
```

**To get Stripe keys:**
1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Click **"Developers"** → **"API keys"**
3. Copy your keys (use test keys for testing, live keys for production)

### Step 4: Deploy

1. After adding all environment variables, click **"Create Web Service"**
2. Render will start building your application
3. This takes 5-10 minutes for the first deployment
4. Watch the logs to see progress
5. When you see **"Your service is live 🎉"**, deployment is complete!

### Step 5: Test Your Deployment

1. Click the URL at the top of the page (e.g., `https://aemusiclab.onrender.com`)
2. Your website should load!
3. Test key features:
   - Browse beats
   - Submit music form
   - Admin login (if applicable)

## Part 4: Set Up Database Tables

Your database is empty! You need to create the tables.

### Step 1: Access Render Shell

1. In your web service dashboard, click **"Shell"** tab on the left
2. Click **"Launch Shell"** button
3. A terminal will open in your browser

### Step 2: Run Database Migrations

In the shell, run:

```bash
npm run db:push
```

This creates all necessary database tables.

### Step 3: Seed Sample Data (Optional)

To add the dummy beats:

```bash
node seed-beats.mjs
```

## Part 5: Configure Stripe Webhooks

For payments to work, Stripe needs to send notifications to your server.

### Step 1: Get Your Webhook URL

Your webhook URL is:
```
https://aemusiclab.onrender.com/api/stripe/webhook
```

(Replace `aemusiclab` with your actual Render service name)

### Step 2: Add Webhook in Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **"Developers"** → **"Webhooks"**
3. Click **"Add endpoint"**
4. Enter your webhook URL: `https://aemusiclab.onrender.com/api/stripe/webhook`
5. Click **"Select events"**
6. Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
7. Click **"Add events"**
8. Click **"Add endpoint"**
9. **Copy the "Signing secret"** (starts with `whsec_`)
10. Go back to Render → Your service → Environment
11. Update `STRIPE_WEBHOOK_SECRET` with the new signing secret
12. Click **"Save Changes"** (this will redeploy your app)

## Part 6: Connect Your Custom Domain

Now let's point your domain to Render.

### Step 1: Add Custom Domain in Render

1. In your web service dashboard, click **"Settings"** tab
2. Scroll to **"Custom Domains"** section
3. Click **"Add Custom Domain"**
4. Enter your domain: `aemusiclab.com` (without www)
5. Click **"Verify"**
6. Render will show you DNS records to add

### Step 2: Add WWW Subdomain (Optional but Recommended)

1. Click **"Add Custom Domain"** again
2. Enter: `www.aemusiclab.com`
3. Click **"Verify"**

### Step 3: Configure DNS Records

You'll need to add DNS records at your domain registrar (where you bought the domain).

**Render will show you exactly what to add, but typically:**

For `aemusiclab.com`:
```
Type: A
Name: @ (or leave blank)
Value: [IP address provided by Render]
TTL: 3600
```

For `www.aemusiclab.com`:
```
Type: CNAME
Name: www
Value: [CNAME provided by Render, e.g., aemusiclab.onrender.com]
TTL: 3600
```

### Step 4: Add DNS Records at Your Registrar

The process varies by registrar. Here are common ones:

#### For Namecheap:
1. Log into Namecheap
2. Go to Domain List → Manage
3. Click **"Advanced DNS"**
4. Click **"Add New Record"**
5. Add the A record and CNAME record from Render
6. Click **"Save All Changes"**

#### For GoDaddy:
1. Log into GoDaddy
2. Go to My Products → Domains
3. Click **"DNS"** next to your domain
4. Click **"Add"** to add new records
5. Add the A record and CNAME record from Render
6. Click **"Save"**

#### For Cloudflare:
1. Log into Cloudflare
2. Select your domain
3. Click **"DNS"** tab
4. Click **"Add record"**
5. Add the A record and CNAME record from Render
6. Make sure **"Proxy status"** is set to **"DNS only"** (gray cloud)
7. Click **"Save"**

### Step 5: Wait for DNS Propagation

- DNS changes take 5 minutes to 48 hours to propagate
- Usually takes 15-30 minutes
- Check status at: [https://dnschecker.org](https://dnschecker.org)

### Step 6: Enable SSL Certificate

1. Once DNS is verified, Render automatically provisions an SSL certificate
2. This takes 1-2 minutes
3. Your site will be accessible via `https://aemusiclab.com`

### Step 7: Update Environment Variables

1. Go back to Render → Your service → Environment
2. Update `SITE_URL` to your custom domain:
   ```
   SITE_URL
   Value: https://aemusiclab.com
   ```
3. Click **"Save Changes"** (this will redeploy)

### Step 8: Update Stripe Webhook URL

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Webhooks
2. Click on your webhook endpoint
3. Click **"..."** → **"Update details"**
4. Change URL to: `https://aemusiclab.com/api/stripe/webhook`
5. Click **"Update endpoint"**

## Part 7: Final Testing

Test everything works with your custom domain:

1. Visit `https://aemusiclab.com`
2. Browse beats
3. Test audio preview
4. Submit a test track (check email notifications)
5. Try purchasing a beat with Stripe test card: `4242 4242 4242 4242`
6. Verify purchase success and download

## Troubleshooting

### Build Fails

**Error:** `npm install` fails
- Check that `package.json` is in the repository
- Try changing build command to: `npm install --legacy-peer-deps && npm run build`

### Database Connection Error

**Error:** "Cannot connect to database"
- Verify `DATABASE_URL` is correct
- Check database is running
- Ensure database allows external connections

### 502 Bad Gateway

**Error:** Site shows 502 error
- Check Render logs for errors
- Verify start command is correct: `npm start`
- Ensure port is correct (Render uses `PORT` env variable automatically)

### Emails Not Sending

**Error:** Form submits but no emails
- Verify SMTP credentials are correct
- Check Render logs for email errors
- Test SMTP settings with a simple test

### Stripe Webhook Fails

**Error:** Payments work but webhook fails
- Verify webhook URL is correct
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Review Render logs for webhook errors

## Monitoring & Maintenance

### View Logs

1. Go to your service dashboard
2. Click **"Logs"** tab
3. View real-time logs of your application

### Monitor Performance

1. Click **"Metrics"** tab
2. View CPU, memory, and request metrics

### Update Your App

When you push changes to GitHub:
1. Render automatically detects changes
2. Rebuilds and redeploys your app
3. Zero downtime deployment

### Backup Database

**For Render PostgreSQL:**
1. Go to your database dashboard
2. Click **"Backups"** tab
3. Backups are automatic on paid plans

**For External Database:**
- Follow the backup procedures of your database provider

## Cost Breakdown

### Free Tier (Good for Testing):
- Web Service: Free (sleeps after 15 min of inactivity)
- Database: Free (Render PostgreSQL or external)
- SSL Certificate: Free
- **Total: $0/month**

### Starter Tier (Recommended for Production):
- Web Service: $7/month (always on, no sleep)
- Database: Free (external) or $7/month (Render PostgreSQL)
- SSL Certificate: Free
- **Total: $7-14/month**

## Support

- **Render Documentation:** [https://render.com/docs](https://render.com/docs)
- **Render Community:** [https://community.render.com](https://community.render.com)
- **Stripe Support:** [https://support.stripe.com](https://support.stripe.com)

## Next Steps

1. Set up monitoring and alerts
2. Configure automatic backups
3. Add staging environment for testing
4. Set up CI/CD pipeline
5. Monitor performance and optimize

---

**Congratulations! Your AE Music Lab website is now live on Render with your custom domain!** 🎉

For any issues, check the Render logs first, then consult the troubleshooting section above.
