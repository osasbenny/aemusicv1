<?php
/**
 * SMTP Configuration for AE Music Lab
 * 
 * INSTRUCTIONS:
 * 1. Fill in your SMTP credentials below
 * 2. Upload this file to the same directory as submit.php
 * 3. Keep this file secure - do not share your credentials
 * 
 * Common SMTP Settings:
 * - Gmail: smtp.gmail.com, Port 587 (TLS) or 465 (SSL)
 * - Outlook/Hotmail: smtp-mail.outlook.com, Port 587 (TLS)
 * - Yahoo: smtp.mail.yahoo.com, Port 587 (TLS) or 465 (SSL)
 * - cPanel/WHM: Usually mail.yourdomain.com, Port 587 (TLS) or 465 (SSL)
 */

// SMTP Server Settings
define('SMTP_HOST', 'mail.aemusiclab.com');  // Your SMTP server (e.g., mail.yourdomain.com)
define('SMTP_PORT', 587);                      // SMTP port (587 for TLS, 465 for SSL)
define('SMTP_SECURE', 'tls');                  // Encryption: 'tls' or 'ssl'

// SMTP Authentication
define('SMTP_USERNAME', 'noreply@aemusiclab.com');  // Your email address
define('SMTP_PASSWORD', 'your-email-password-here'); // Your email password

// Email Settings
define('FROM_EMAIL', 'noreply@aemusiclab.com');     // Sender email address
define('FROM_NAME', 'AE Music Lab');                 // Sender name
define('REPLY_TO_EMAIL', 'cactusdigitalmedialtd@gmail.com'); // Reply-to email

// Admin Notification
define('ADMIN_EMAIL', 'cactusdigitalmedialtd@gmail.com'); // Where to send submissions

// Debug Mode (set to false in production)
define('SMTP_DEBUG', false); // Set to true to see detailed SMTP errors
?>
