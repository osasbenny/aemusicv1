<?php
/**
 * SMTP Configuration for AE Music Lab
 * 
 * CONFIGURED: January 2026
 * These settings are configured for aemusiclab.com cPanel email
 */

// SMTP Server Settings
define('SMTP_HOST', 'mail.aemusiclab.com');
define('SMTP_PORT', 465);
define('SMTP_SECURE', 'ssl');  // Port 465 uses SSL

// SMTP Authentication
define('SMTP_USERNAME', 'noreply@aemusiclab.com');
define('SMTP_PASSWORD', 'D8I!+;z~4bZN+%tj');

// Email Settings
define('FROM_EMAIL', 'noreply@aemusiclab.com');
define('FROM_NAME', 'AE Music Lab');
define('REPLY_TO_EMAIL', 'cactusdigitalmedialtd@gmail.com');

// Admin Notification
define('ADMIN_EMAIL', 'cactusdigitalmedialtd@gmail.com');

// Debug Mode (set to false in production)
define('SMTP_DEBUG', false); // Set to true to see detailed SMTP errors
?>
