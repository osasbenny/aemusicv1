# AE Music Lab - Standalone PHP Submission Form

This is a standalone PHP version of the music submission form that works on basic PHP hosting (no Node.js required).

## Features

✅ File upload for audio files (MP3, WAV, MP4)  
✅ Email notification to admin with submission details  
✅ Automated confirmation email to artist  
✅ Success/error message display  
✅ Form validation and security measures  
✅ Responsive design matching AE Music Lab branding  
✅ File size limit (50MB)  
✅ Upload directory protection

## Requirements

- PHP 7.4 or higher
- PHP mail() function enabled
- File upload enabled in php.ini
- Write permissions for uploads directory

## Installation Instructions

### Step 1: Upload Files

1. Download all files from this directory
2. Upload to your web hosting via FTP or cPanel File Manager
3. Place files in your desired directory (e.g., `/public_html/submit/`)

### Step 2: Configure Settings

Edit `config.php` and update these settings:

```php
// Admin email (where submissions are sent)
define('ADMIN_EMAIL', 'cactusdigitalmedialtd@gmail.com');

// SMTP settings for sending emails
define('SMTP_FROM_EMAIL', 'admin@aemusic.chevwellconsulting.com');
define('SMTP_FROM_NAME', 'AE Music Lab');

// Site information
define('SITE_NAME', 'AE Music Lab');
define('SITE_URL', 'https://yourdomain.com');
```

### Step 3: Set Directory Permissions

Set the `uploads/` directory to be writable:

```bash
chmod 755 uploads/
```

Or via cPanel File Manager:
- Right-click on `uploads` folder
- Select "Change Permissions"
- Set to 755 (rwxr-xr-x)

### Step 4: Test the Form

1. Visit the form in your browser: `https://yourdomain.com/submit/submit.php`
2. Fill out all required fields
3. Upload a test audio file
4. Submit the form
5. Check that:
   - Success message appears
   - Admin email is received at cactusdigitalmedialtd@gmail.com
   - Artist receives confirmation email
   - File is saved in `uploads/` directory

## File Structure

```
aemusiclab-php-form/
├── submit.php          # Main form page
├── config.php          # Configuration settings
├── functions.php       # Helper functions
├── uploads/            # Directory for uploaded files
│   └── .htaccess      # Protection for uploaded files
└── README.md          # This file
```

## Configuration Options

### Email Settings

The form uses PHP's built-in `mail()` function. If your hosting requires SMTP authentication, you may need to:

1. Install PHPMailer library
2. Update `functions.php` to use SMTP instead of `mail()`
3. Add SMTP credentials to `config.php`

### File Upload Limits

Default limits in `config.php`:
- Max file size: 50MB
- Allowed extensions: mp3, wav, mp4
- Allowed MIME types: audio/mpeg, audio/wav, audio/x-wav, video/mp4

To change these, edit the constants in `config.php`.

### Upload Directory

By default, files are saved to `uploads/` directory with:
- Unique timestamped filenames
- Protection via .htaccess (prevents direct access)
- Automatic directory creation if it doesn't exist

## Security Features

✅ Input sanitization and validation  
✅ File type verification (extension + MIME type)  
✅ File size limits  
✅ Upload directory protection  
✅ XSS protection via htmlspecialchars  
✅ SQL injection prevention (no database used)  

## Troubleshooting

### Emails Not Sending

**Problem:** Form submits but no emails are received

**Solutions:**
1. Check spam/junk folders
2. Verify `mail()` function is enabled on your hosting
3. Check PHP error logs in cPanel
4. Contact your hosting provider about email sending
5. Consider using SMTP instead of mail()

### File Upload Errors

**Problem:** "Failed to save uploaded file"

**Solutions:**
1. Check `uploads/` directory permissions (should be 755)
2. Verify PHP upload_max_filesize in php.ini
3. Check disk space on your hosting
4. Ensure safe_mode is disabled

### 500 Internal Server Error

**Problem:** Page shows 500 error

**Solutions:**
1. Check file permissions (PHP files should be 644)
2. Review .htaccess file for syntax errors
3. Check PHP error logs
4. Verify PHP version is 7.4 or higher

### File Size Limit Issues

**Problem:** Large files fail to upload

**Solutions:**
1. Check php.ini settings:
   - `upload_max_filesize = 50M`
   - `post_max_size = 50M`
   - `max_execution_time = 300`
   - `max_input_time = 300`
2. Contact hosting support to increase limits

## Customization

### Changing Colors/Styling

Edit the `<style>` section in `submit.php`:
- Background gradient: Lines with `background: linear-gradient`
- Accent colors: `#7C5CFF` (purple) and `#00F5D4` (cyan)
- Card background: `#151A26`

### Adding More Form Fields

1. Add HTML input in `submit.php`
2. Add sanitization in form processing section
3. Update email templates in `functions.php`

### Changing Email Templates

Edit these functions in `functions.php`:
- `send_admin_notification()` - Admin email
- `send_artist_confirmation()` - Artist confirmation

## Integration with Main Website

To link this form from your main website:

```html
<a href="https://yourdomain.com/submit/submit.php">Submit Your Music</a>
```

Or embed in an iframe:

```html
<iframe src="https://yourdomain.com/submit/submit.php" 
        width="100%" height="1200" frameborder="0"></iframe>
```

## Support

For issues or questions:
- Email: cactusdigitalmedialtd@gmail.com
- Check PHP error logs in cPanel
- Review hosting documentation for PHP/email settings

## Credits

Designed by [Cactus Digital Media](https://cactusdigitalmedia.ng)  
© 2026 AE Music Lab - A Division of Armhen Entertainment

## License

This form is proprietary software created for AE Music Lab.
