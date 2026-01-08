# AE Music Lab - cPanel Deployment Guide

## Prerequisites

- Node.js 18+ installed on your cPanel server
- MySQL database created in cPanel
- Domain configured in cPanel

## Deployment Steps

### 1. Upload Files

Upload all project files to your cPanel hosting directory (e.g., `public_html/aemusiclab/`)

### 2. Install Dependencies

```bash
cd /path/to/aemusiclab
npm install -g pnpm
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=mysql://username:password@localhost:3306/database_name

# JWT Secret (generate a random string)
JWT_SECRET=your-random-secret-key-here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key

# OAuth Configuration (Manus)
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=your-owner-open-id
OWNER_NAME=your-name

# S3 Storage Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Built-in Forge API
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im

# Analytics
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# App Configuration
VITE_APP_TITLE=AE Music Lab
VITE_APP_LOGO=/logo.png
```

### 4. Database Setup

Run database migrations:

```bash
pnpm db:push
```

### 5. Build for Production

The production build is already included in the `dist/` folder. If you need to rebuild:

```bash
pnpm build
```

### 6. Start the Server

For cPanel with Node.js app support:

1. Go to cPanel → Setup Node.js App
2. Create a new application:
   - Node.js version: 18.x or higher
   - Application mode: Production
   - Application root: `/home/username/aemusiclab`
   - Application startup file: `dist/index.js`
   - Environment variables: Add all variables from `.env`

3. Click "Create" and then "Start Application"

### 7. Configure Reverse Proxy (if needed)

If using Apache/Nginx, configure reverse proxy to forward requests to the Node.js app:

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

**Nginx:**
```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### 8. Configure Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env`

### 9. Set File Permissions

```bash
chmod -R 755 /path/to/aemusiclab
chmod 600 .env
```

### 10. Test the Application

Visit your domain and verify:
- Homepage loads correctly
- Beat store displays beats
- Submission form works
- Admin dashboard is accessible (after login)
- Stripe checkout redirects properly

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format: `mysql://user:pass@host:port/dbname`
- Ensure MySQL user has proper permissions
- Check if database exists

### File Upload Issues
- Verify S3 credentials are correct
- Check bucket permissions and CORS settings
- Ensure AWS_REGION matches your bucket region

### Stripe Payment Issues
- Verify webhook endpoint is accessible
- Check webhook signing secret matches
- Test with Stripe test mode first (use test keys)

### Port Already in Use
- Change port in startup configuration
- Update reverse proxy settings accordingly

## Production Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] S3 bucket configured with proper CORS
- [ ] Stripe webhooks configured
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] File permissions set correctly
- [ ] Admin user created
- [ ] Test payments with Stripe test mode
- [ ] Switch to Stripe live mode
- [ ] Monitor error logs

## Support

For issues or questions, contact: support@aemusiclab.com
