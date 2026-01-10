# SMTP Email Setup Instructions for AE Music Lab Submission Form

## Overview
Your submission form now uses SMTP (via PHPMailer) to send confirmation emails instead of the PHP mail() function, which is disabled on your shared hosting.

## Files Included
1. **submit.php** - Main submission form with SMTP support
2. **smtp-config.php** - SMTP configuration file (needs your credentials)
3. **phpmailer/** - PHPMailer library folder (7 PHP files)
4. **test-php.php** - Server environment test (optional, can delete after testing)

## Step-by-Step Deployment

### Step 1: Download Files from GitHub
1. Go to https://github.com/osasbenny/aemusicv1
2. Click the green "Code" button → "Download ZIP"
3. Extract the ZIP file on your computer
4. Navigate to the `public` folder

### Step 2: Get Your SMTP Credentials from cPanel

#### Option A: Create a New Email Account (Recommended)
1. Log into your cPanel
2. Go to "Email Accounts"
3. Click "Create" to add a new email account
4. Create: `noreply@aemusiclab.com` with a strong password
5. Save the password - you'll need it for Step 3

#### Option B: Use Existing Email Account
- Use any existing email account on your domain
- You'll need the email address and password

### Step 3: Configure SMTP Settings
1. Open `smtp-config.php` in a text editor (Notepad, VS Code, etc.)
2. Update these lines with your information:

```php
// SMTP Server Settings
define('SMTP_HOST', 'mail.aemusiclab.com');  // Usually mail.yourdomain.com
define('SMTP_PORT', 587);                      // 587 for TLS, 465 for SSL
define('SMTP_SECURE', 'tls');                  // 'tls' or 'ssl'

// SMTP Authentication
define('SMTP_USERNAME', 'noreply@aemusiclab.com');  // Your email address
define('SMTP_PASSWORD', 'YOUR-PASSWORD-HERE');       // Your email password

// Email Settings
define('FROM_EMAIL', 'noreply@aemusiclab.com');     // Sender email
define('FROM_NAME', 'AE Music Lab');                 // Sender name
define('REPLY_TO_EMAIL', 'cactusdigitalmedialtd@gmail.com'); // Reply-to email

// Admin Notification
define('ADMIN_EMAIL', 'cactusdigitalmedialtd@gmail.com'); // Where submissions go
```

3. Save the file

### Step 4: Upload Files to cPanel
1. Log into your cPanel
2. Go to "File Manager"
3. Navigate to `public_html` directory
4. Upload these files/folders:
   - `submit.php`
   - `smtp-config.php`
   - `phpmailer/` (entire folder with all 7 files inside)

**Important:** Make sure the `phpmailer` folder structure looks like this:
```
public_html/
├── submit.php
├── smtp-config.php
└── phpmailer/
    ├── DSNConfigurator.php
    ├── Exception.php
    ├── OAuth.php
    ├── OAuthTokenProvider.php
    ├── PHPMailer.php
    ├── POP3.php
    └── SMTP.php
```

### Step 5: Set File Permissions (if needed)
1. In cPanel File Manager, right-click on `submit.php`
2. Select "Change Permissions"
3. Set to `644` (Owner: Read/Write, Group: Read, World: Read)
4. Do the same for `smtp-config.php`
5. For the `phpmailer` folder, set to `755`

### Step 6: Test the Form
1. Visit: https://aemusiclab.com/submit.php
2. Fill in the form with test data
3. Upload a small audio file (under 5MB for initial test)
4. Click "Submit Your Track"
5. You should see:
   - Progress bar showing 0% to 100%
   - Success message after upload
   - Confirmation email sent to the artist's email
   - Notification email sent to admin (cactusdigitalmedialtd@gmail.com)

### Step 7: Check for Errors (if something goes wrong)
1. Visit: https://aemusiclab.com/submit.php?debug=true
2. Try submitting again
3. Scroll down to see "Server Diagnostics" section
4. Screenshot the diagnostics and send to me

## Common SMTP Settings

### cPanel/WHM (Most Common)
```php
SMTP_HOST: mail.aemusiclab.com
SMTP_PORT: 587
SMTP_SECURE: tls
```

### Gmail (if you want to use Gmail instead)
```php
SMTP_HOST: smtp.gmail.com
SMTP_PORT: 587
SMTP_SECURE: tls
SMTP_USERNAME: your-gmail@gmail.com
SMTP_PASSWORD: your-app-password  // Use App Password, not regular password
```

**Note:** For Gmail, you need to create an "App Password":
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Generate a new app password for "Mail"
5. Use that 16-character password in smtp-config.php

### Outlook/Hotmail
```php
SMTP_HOST: smtp-mail.outlook.com
SMTP_PORT: 587
SMTP_SECURE: tls
```

## Troubleshooting

### Problem: "SMTP connect() failed"
**Solution:** Check your SMTP_HOST, SMTP_PORT, and SMTP_SECURE settings. Contact your hosting provider for the correct values.

### Problem: "SMTP Error: Could not authenticate"
**Solution:** Double-check your SMTP_USERNAME and SMTP_PASSWORD. Make sure there are no extra spaces.

### Problem: "File upload error"
**Solution:** 
1. Check if the `uploads` directory was created
2. Set permissions to 755 or 777 for the uploads folder
3. Increase upload limits in cPanel (MultiPHP INI Editor)

### Problem: Emails not arriving
**Solution:**
1. Check spam/junk folder
2. Enable debug mode: Change `define('SMTP_DEBUG', false);` to `define('SMTP_DEBUG', true);` in smtp-config.php
3. Visit submit.php?debug=true to see detailed SMTP logs

### Problem: "smtp-config.php not found"
**Solution:** Make sure smtp-config.php is in the same directory as submit.php

## Security Notes

1. **Protect smtp-config.php**: This file contains sensitive credentials. Make sure it's not publicly accessible via browser (it should return a blank page if accessed directly).

2. **Use strong passwords**: Create a strong password for your email account.

3. **Delete test-php.php**: After verifying your environment, delete test-php.php for security.

4. **Regular backups**: Keep backups of your uploads folder and configuration files.

## Increasing Upload Limits (Optional)

If you want to allow larger file uploads (currently 5M/8M):

1. Log into cPanel
2. Go to "Select PHP Version" or "MultiPHP INI Editor"
3. Find and increase these values:
   - `upload_max_filesize`: 50M
   - `post_max_size`: 50M
   - `max_execution_time`: 300
   - `memory_limit`: 256M
4. Save changes

## Support

If you encounter any issues:
1. Take a screenshot of the error
2. Visit submit.php?debug=true and screenshot the diagnostics
3. Send both screenshots to me for troubleshooting

## What Happens When Form is Submitted

1. **File Upload**: Audio file is uploaded to `/uploads/` directory with a unique name
2. **Admin Email**: You (cactusdigitalmedialtd@gmail.com) receive a notification with:
   - Artist name and email
   - Song title and message
   - File name and location
3. **Artist Email**: Artist receives a confirmation email with:
   - Thank you message
   - What to expect next (3-5 business days review)
   - Link to browse beats
   - Your contact email for questions

Both emails are beautifully formatted with HTML and your branding colors (purple to cyan gradient).

## Files You Can Delete After Setup

- `test-php.php` (after confirming environment is correct)
- `README.md` (if it exists in public folder)
- `config.php` and `functions.php` (old files, no longer needed)

## Next Steps After Deployment

1. Test the form thoroughly with different file sizes
2. Check that emails are being received (both admin and artist)
3. Monitor the uploads folder for new submissions
4. Consider setting up automatic email forwarding from noreply@aemusiclab.com to your main email
5. Optionally increase upload limits to 50MB for larger music files

---

**Created for:** AE Music Lab  
**Date:** January 2026  
**Version:** 1.0 with SMTP Support
