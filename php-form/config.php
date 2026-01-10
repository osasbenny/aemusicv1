<?php
/**
 * AE Music Lab - Submission Form Configuration
 * Update these settings with your email credentials
 */

// Email Configuration
define('SMTP_HOST', 'aemusic.chevwellconsulting.com');
define('SMTP_PORT', 465);
define('SMTP_USERNAME', 'admin@aemusic.chevwellconsulting.com');
define('SMTP_PASSWORD', '+!(VLKmHq^45m*,y');
define('SMTP_FROM_EMAIL', 'admin@aemusic.chevwellconsulting.com');
define('SMTP_FROM_NAME', 'AE Music Lab');

// Admin notification email
define('ADMIN_EMAIL', 'cactusdigitalmedialtd@gmail.com');

// File upload settings
define('UPLOAD_DIR', 'uploads/');
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB in bytes
define('ALLOWED_AUDIO_TYPES', ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/wave']);
define('ALLOWED_VIDEO_TYPES', ['video/mp4', 'video/quicktime']);
define('ALLOWED_EXTENSIONS', ['mp3', 'wav', 'mp4', 'mov']);

// Site settings
define('SITE_NAME', 'AE Music Lab');
define('SITE_URL', 'https://aemusiclab.com'); // Update with your actual domain

// Security
define('ENABLE_RECAPTCHA', false); // Set to true if you want to add Google reCAPTCHA
define('RECAPTCHA_SITE_KEY', ''); // Add your reCAPTCHA site key
define('RECAPTCHA_SECRET_KEY', ''); // Add your reCAPTCHA secret key
