<?php
/**
 * AE Music Lab - Music Submission Form with SMTP Support
 * Standalone version with PHPMailer for email delivery
 * 
 * REQUIREMENTS:
 * 1. PHPMailer library in ./phpmailer/ directory
 * 2. smtp-config.php with your SMTP credentials
 */

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Load SMTP configuration
if (file_exists(__DIR__ . '/smtp-config.php')) {
    require_once __DIR__ . '/smtp-config.php';
} else {
    die('Error: smtp-config.php not found. Please create this file with your SMTP settings.');
}

// Load PHPMailer
if (file_exists(__DIR__ . '/phpmailer/PHPMailer.php')) {
    require_once __DIR__ . '/phpmailer/Exception.php';
    require_once __DIR__ . '/phpmailer/PHPMailer.php';
    require_once __DIR__ . '/phpmailer/SMTP.php';
} else {
    die('Error: PHPMailer library not found. Please upload the phpmailer folder.');
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ============================================================================
// CONFIGURATION
// ============================================================================

define('SITE_NAME', 'AE Music Lab');
define('UPLOAD_DIR', __DIR__ . '/uploads');
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB
define('ALLOWED_TYPES', ['audio/mpeg', 'audio/wav', 'audio/mp4', 'video/mp4', 'audio/x-m4a']);
define('ALLOWED_EXTENSIONS', ['mp3', 'wav', 'mp4', 'm4a']);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

function sanitize_email($email) {
    return filter_var(trim($email), FILTER_SANITIZE_EMAIL);
}

function send_email_smtp($to, $to_name, $subject, $body_html, $body_text = '') {
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        if (defined('SMTP_DEBUG') && SMTP_DEBUG) {
            $mail->SMTPDebug = 2;
        }
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USERNAME;
        $mail->Password   = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_SECURE;
        $mail->Port       = SMTP_PORT;
        
        // Recipients
        $mail->setFrom(FROM_EMAIL, FROM_NAME);
        $mail->addAddress($to, $to_name);
        $mail->addReplyTo(REPLY_TO_EMAIL, FROM_NAME);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $body_html;
        $mail->AltBody = $body_text ?: strip_tags($body_html);
        
        $mail->send();
        return ['success' => true, 'message' => 'Email sent successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => "Email could not be sent. Error: {$mail->ErrorInfo}"];
    }
}

function handle_file_upload($file) {
    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $error_messages = [
            UPLOAD_ERR_INI_SIZE => 'File exceeds server upload_max_filesize limit',
            UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE directive',
            UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file was uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder on server',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
            UPLOAD_ERR_EXTENSION => 'File upload stopped by PHP extension',
        ];
        
        $error_msg = $error_messages[$file['error']] ?? 'Unknown upload error';
        return ['success' => false, 'error' => $error_msg];
    }
    
    // Validate file size
    if ($file['size'] > MAX_FILE_SIZE) {
        $max_mb = MAX_FILE_SIZE / (1024 * 1024);
        return ['success' => false, 'error' => "File size must be less than {$max_mb}MB"];
    }
    
    // Validate file type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mime_type, ALLOWED_TYPES)) {
        return ['success' => false, 'error' => 'Invalid file type. Only MP3, WAV, and MP4 files are allowed'];
    }
    
    // Validate file extension
    $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($file_extension, ALLOWED_EXTENSIONS)) {
        return ['success' => false, 'error' => 'Invalid file extension'];
    }
    
    // Create uploads directory if it doesn't exist
    if (!file_exists(UPLOAD_DIR)) {
        if (!mkdir(UPLOAD_DIR, 0755, true)) {
            return ['success' => false, 'error' => 'Failed to create uploads directory'];
        }
        
        // Create .htaccess to prevent direct access
        $htaccess_content = "Options -Indexes\n<FilesMatch \"\\.(mp3|wav|mp4|m4a)$\">\n    Order Allow,Deny\n    Deny from all\n</FilesMatch>";
        file_put_contents(UPLOAD_DIR . '/.htaccess', $htaccess_content);
    }
    
    // Generate unique filename
    $unique_name = uniqid('track_', true) . '_' . time() . '.' . $file_extension;
    $destination = UPLOAD_DIR . '/' . $unique_name;
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        return ['success' => false, 'error' => 'Failed to save uploaded file'];
    }
    
    return [
        'success' => true,
        'file_path' => $destination,
        'file_name' => $unique_name,
        'original_name' => $file['name']
    ];
}

function send_admin_notification($form_data, $file_name, $original_name) {
    $subject = '🎵 New Music Submission - ' . SITE_NAME;
    
    $html = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7C5CFF 0%, #00F5D4 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #7C5CFF; }
            .value { color: #333; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>🎵 New Music Submission</h2>
            </div>
            <div class='content'>
                <p>A new music submission has been received on " . SITE_NAME . ".</p>
                
                <div class='field'>
                    <div class='label'>Artist Name:</div>
                    <div class='value'>" . htmlspecialchars($form_data['artist_name']) . "</div>
                </div>
                
                <div class='field'>
                    <div class='label'>Email:</div>
                    <div class='value'>" . htmlspecialchars($form_data['email']) . "</div>
                </div>
                
                <div class='field'>
                    <div class='label'>Song Title:</div>
                    <div class='value'>" . htmlspecialchars($form_data['song_title']) . "</div>
                </div>
                
                <div class='field'>
                    <div class='label'>Message:</div>
                    <div class='value'>" . nl2br(htmlspecialchars($form_data['message'] ?: 'No message provided')) . "</div>
                </div>
                
                <div class='field'>
                    <div class='label'>Uploaded File:</div>
                    <div class='value'>" . htmlspecialchars($original_name) . "</div>
                    <div class='value' style='font-size: 12px; color: #666;'>Saved as: " . htmlspecialchars($file_name) . "</div>
                </div>
                
                <div class='footer'>
                    <p><strong>Action Required:</strong> Please review this submission and respond to the artist at " . htmlspecialchars($form_data['email']) . "</p>
                    <p>The uploaded file is stored in your uploads directory on the server.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $text = "New Music Submission - " . SITE_NAME . "\n\n";
    $text .= "Artist Name: " . $form_data['artist_name'] . "\n";
    $text .= "Email: " . $form_data['email'] . "\n";
    $text .= "Song Title: " . $form_data['song_title'] . "\n";
    $text .= "Message: " . ($form_data['message'] ?: 'No message provided') . "\n\n";
    $text .= "Uploaded File: " . $original_name . "\n";
    $text .= "Saved as: " . $file_name . "\n\n";
    $text .= "Please review this submission and respond to the artist at " . $form_data['email'];
    
    return send_email_smtp(ADMIN_EMAIL, 'Admin', $subject, $html, $text);
}

function send_artist_confirmation($form_data) {
    $subject = '🎵 Your Music Submission to ' . SITE_NAME . ' - Confirmed!';
    
    $html = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7C5CFF 0%, #00F5D4 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #7C5CFF 0%, #00F5D4 100%); color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Thank You for Your Submission!</h1>
            </div>
            <div class='content'>
                <p>Hi <strong>" . htmlspecialchars($form_data['artist_name']) . "</strong>,</p>
                
                <p>Thank you for submitting your track <strong>\"" . htmlspecialchars($form_data['song_title']) . "\"</strong> to " . SITE_NAME . "!</p>
                
                <p>We've received your submission and our team will review it within <strong>3-5 business days</strong>.</p>
                
                <h3>What happens next?</h3>
                <ul>
                    <li>Our team will evaluate your track for potential collaboration or feature opportunities</li>
                    <li>We'll assess the production quality, originality, and market potential</li>
                    <li>You'll receive a follow-up email with our feedback and next steps</li>
                </ul>
                
                <p>In the meantime, feel free to browse our beat store and explore what " . SITE_NAME . " has to offer!</p>
                
                <center>
                    <a href='https://aemusiclab.com/beats' class='button'>Browse Beats</a>
                </center>
                
                <p>If you have any questions, don't hesitate to reach out to us at <a href='mailto:" . ADMIN_EMAIL . "'>" . ADMIN_EMAIL . "</a></p>
                
                <p>Best regards,<br>
                <strong>The " . SITE_NAME . " Team</strong><br>
                <em>The Science of Sounds</em></p>
            </div>
            <div class='footer'>
                <p>© " . date('Y') . " " . SITE_NAME . " | Powered by Armhen Entertainment</p>
                <p>This is an automated confirmation email.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $text = "Hi " . $form_data['artist_name'] . ",\n\n";
    $text .= "Thank you for submitting your track \"" . $form_data['song_title'] . "\" to " . SITE_NAME . "!\n\n";
    $text .= "We've received your submission and our team will review it within 3-5 business days.\n\n";
    $text .= "What happens next?\n";
    $text .= "- Our team will evaluate your track for potential collaboration or feature opportunities\n";
    $text .= "- You'll receive a follow-up email with our feedback and next steps\n";
    $text .= "- In the meantime, feel free to browse our beat store at https://aemusiclab.com/beats\n\n";
    $text .= "If you have any questions, reach out to us at " . ADMIN_EMAIL . "\n\n";
    $text .= "Best regards,\n";
    $text .= "The " . SITE_NAME . " Team\n";
    $text .= "A Division of Armhen Entertainment";
    
    return send_email_smtp($form_data['email'], $form_data['artist_name'], $subject, $html, $text);
}

// ============================================================================
// MAIN PROCESSING
// ============================================================================

$success = false;
$error = '';
$diagnostics = [];
$form_data = [
    'artist_name' => '',
    'email' => '',
    'song_title' => '',
    'message' => ''
];

// Collect server diagnostics
$diagnostics['php_version'] = phpversion();
$diagnostics['upload_max_filesize'] = ini_get('upload_max_filesize');
$diagnostics['post_max_size'] = ini_get('post_max_size');
$diagnostics['smtp_configured'] = defined('SMTP_HOST') ? 'Yes' : 'No';
$diagnostics['phpmailer_loaded'] = class_exists('PHPMailer\\PHPMailer\\PHPMailer') ? 'Yes' : 'No';
$diagnostics['uploads_dir_exists'] = file_exists(UPLOAD_DIR) ? 'Yes' : 'No';
$diagnostics['uploads_dir_writable'] = is_writable(UPLOAD_DIR) ? 'Yes' : (file_exists(UPLOAD_DIR) ? 'No - Check permissions!' : 'Directory will be created');

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $diagnostics['post_received'] = 'Yes';
    $diagnostics['files_received'] = isset($_FILES['audio_file']) ? 'Yes' : 'No';
    
    if (isset($_FILES['audio_file'])) {
        $diagnostics['file_error_code'] = $_FILES['audio_file']['error'];
        $diagnostics['file_size'] = $_FILES['audio_file']['size'] . ' bytes (' . round($_FILES['audio_file']['size'] / (1024 * 1024), 2) . ' MB)';
        $diagnostics['file_name'] = $_FILES['audio_file']['name'];
    }
    
    // Validate and sanitize input
    $form_data['artist_name'] = sanitize_input($_POST['artist_name'] ?? '');
    $form_data['email'] = sanitize_email($_POST['email'] ?? '');
    $form_data['song_title'] = sanitize_input($_POST['song_title'] ?? '');
    $form_data['message'] = sanitize_input($_POST['message'] ?? '');
    
    // Validate required fields
    if (empty($form_data['artist_name']) || empty($form_data['email']) || empty($form_data['song_title'])) {
        $error = 'Please fill in all required fields.';
    } elseif (!filter_var($form_data['email'], FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } elseif (empty($_FILES['audio_file']['name'])) {
        $error = 'Please upload an audio file.';
    } else {
        // Process file upload
        $upload_result = handle_file_upload($_FILES['audio_file']);
        
        $diagnostics['upload_result'] = $upload_result;
        
        if ($upload_result['success']) {
            $audio_file_path = $upload_result['file_path'];
            $audio_file_name = $upload_result['file_name'];
            $original_name = $upload_result['original_name'];
            
            // Send admin notification
            $admin_result = send_admin_notification($form_data, $audio_file_name, $original_name);
            
            // Send artist confirmation
            $artist_result = send_artist_confirmation($form_data);
            
            $diagnostics['admin_email_result'] = $admin_result;
            $diagnostics['artist_email_result'] = $artist_result;
            
            // Consider it success even if emails fail
            $success = true;
            
            // Clear form data on success
            $form_data = [
                'artist_name' => '',
                'email' => '',
                'song_title' => '',
                'message' => ''
            ];
            
            if (!$admin_result['success'] || !$artist_result['success']) {
                $error = 'Your submission was received successfully! However, there was an issue sending confirmation emails. We will review your submission shortly.';
            }
        } else {
            $error = $upload_result['error'];
        }
    }
}

// Show diagnostics in development mode
$show_diagnostics = isset($_GET['debug']) && $_GET['debug'] === 'true';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submit Your Music - <?php echo SITE_NAME; ?></title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #0B0E14 0%, #151A26 100%); color: #ffffff; min-height: 100vh; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .logo { text-align: center; margin-bottom: 40px; }
        .logo h1 { font-size: 2.5rem; background: linear-gradient(135deg, #7C5CFF 0%, #00F5D4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 10px; }
        .logo p { color: #00F5D4; font-size: 1rem; font-style: italic; }
        .card { background: #151A26; border-radius: 16px; padding: 40px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); border: 1px solid rgba(124, 92, 255, 0.1); }
        .card h2 { font-size: 1.8rem; margin-bottom: 10px; color: #ffffff; }
        .card p { color: #A1A1AA; margin-bottom: 30px; line-height: 1.6; }
        .alert { padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 0.95rem; }
        .alert-success { background: rgba(0, 245, 212, 0.1); border: 1px solid #00F5D4; color: #00F5D4; }
        .alert-error { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; }
        .alert-warning { background: rgba(251, 191, 36, 0.1); border: 1px solid #fbbf24; color: #fbbf24; }
        .diagnostics { margin-top: 20px; padding: 16px; background: #0B0E14; border-radius: 8px; font-family: monospace; font-size: 0.8rem; max-height: 400px; overflow-y: auto; }
        .diagnostics h3 { color: #7C5CFF; margin-bottom: 10px; }
        .diagnostics pre { color: #00F5D4; white-space: pre-wrap; word-wrap: break-word; }
        .form-group { margin-bottom: 24px; }
        label { display: block; margin-bottom: 8px; color: #ffffff; font-weight: 500; }
        label .required { color: #ef4444; }
        input[type="text"], input[type="email"], textarea { width: 100%; padding: 12px 16px; background: #0B0E14; border: 1px solid rgba(124, 92, 255, 0.2); border-radius: 8px; color: #ffffff; font-size: 1rem; transition: border-color 0.3s; }
        input[type="text"]:focus, input[type="email"]:focus, textarea:focus { outline: none; border-color: #7C5CFF; }
        textarea { min-height: 120px; resize: vertical; }
        .file-upload { position: relative; display: inline-block; width: 100%; }
        input[type="file"] { display: none; }
        .file-upload-label { display: flex; align-items: center; justify-content: center; padding: 40px 20px; background: #0B0E14; border: 2px dashed rgba(124, 92, 255, 0.3); border-radius: 8px; cursor: pointer; transition: all 0.3s; }
        .file-upload-label:hover { border-color: #7C5CFF; background: rgba(124, 92, 255, 0.05); }
        .file-upload-text { text-align: center; }
        .file-upload-text .icon { font-size: 2rem; margin-bottom: 10px; }
        .file-name { margin-top: 10px; color: #00F5D4; font-size: 0.9rem; }
        .file-info { margin-top: 8px; font-size: 0.85rem; color: #A1A1AA; }
        .btn { width: 100%; padding: 14px 24px; background: linear-gradient(135deg, #7C5CFF 0%, #00F5D4 100%); color: #ffffff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124, 92, 255, 0.4); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .disclaimer { margin-top: 24px; padding: 16px; background: rgba(124, 92, 255, 0.05); border-radius: 8px; font-size: 0.85rem; color: #A1A1AA; line-height: 1.6; }
        .footer { text-align: center; margin-top: 40px; color: #A1A1AA; font-size: 0.9rem; }
        .footer a { color: #7C5CFF; text-decoration: none; }
        .footer a:hover { color: #00F5D4; }
        .progress-container { display: none; margin-top: 20px; margin-bottom: 20px; }
        .progress-container.active { display: block; }
        .progress-bar-wrapper { width: 100%; height: 40px; background: #0B0E14; border-radius: 20px; overflow: hidden; border: 2px solid rgba(124, 92, 255, 0.3); position: relative; }
        .progress-bar { height: 100%; width: 0%; background: linear-gradient(90deg, #7C5CFF 0%, #00F5D4 100%); transition: width 0.3s ease; display: flex; align-items: center; justify-content: center; position: relative; }
        .progress-text { position: absolute; width: 100%; text-align: center; font-weight: 700; font-size: 1rem; color: #ffffff; z-index: 2; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8); line-height: 40px; }
        .progress-label { margin-bottom: 12px; color: #00F5D4; font-size: 1rem; font-weight: 600; text-align: center; }
        .uploading-status { text-align: center; color: #A1A1AA; font-size: 0.9rem; margin-top: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1><?php echo SITE_NAME; ?></h1>
            <p>The Science of Sounds</p>
        </div>
        
        <div class="card">
            <h2>Submit Your Music</h2>
            <p>Share your talent with us. Upload your track and we'll review it within 3-5 business days.</p>
            
            <?php if ($success && empty($error)): ?>
                <div class="alert alert-success">
                    <strong>Success!</strong> Your submission has been received. We'll review your track and get back to you within 3-5 business days. Check your email for confirmation.
                </div>
            <?php elseif ($success && !empty($error)): ?>
                <div class="alert alert-warning">
                    <strong>Partial Success:</strong> <?php echo htmlspecialchars($error); ?>
                </div>
            <?php elseif ($error): ?>
                <div class="alert alert-error">
                    <strong>Error:</strong> <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>
            
            <?php if ($show_diagnostics): ?>
                <div class="diagnostics">
                    <h3>📊 Server Diagnostics</h3>
                    <pre><?php echo htmlspecialchars(print_r($diagnostics, true)); ?></pre>
                </div>
            <?php endif; ?>
            
            <form method="POST" enctype="multipart/form-data" id="submitForm">
                <div class="form-group">
                    <label for="artist_name">Artist Name <span class="required">*</span></label>
                    <input type="text" id="artist_name" name="artist_name" required 
                           value="<?php echo htmlspecialchars($form_data['artist_name']); ?>"
                           placeholder="Your stage name or real name">
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address <span class="required">*</span></label>
                    <input type="email" id="email" name="email" required 
                           value="<?php echo htmlspecialchars($form_data['email']); ?>"
                           placeholder="your@email.com">
                </div>
                
                <div class="form-group">
                    <label for="song_title">Song Title <span class="required">*</span></label>
                    <input type="text" id="song_title" name="song_title" required 
                           value="<?php echo htmlspecialchars($form_data['song_title']); ?>"
                           placeholder="Name of your track">
                </div>
                
                <div class="form-group">
                    <label for="audio_file">Audio File <span class="required">*</span></label>
                    <div class="file-upload">
                        <input type="file" id="audio_file" name="audio_file" accept=".mp3,.wav,.mp4,.m4a" required>
                        <label for="audio_file" class="file-upload-label" id="fileUploadLabel">
                            <div class="file-upload-text">
                                <div class="icon">🎵</div>
                                <div>Click to upload or drag and drop</div>
                                <div class="file-info">MP3, WAV, or MP4 (Max <?php echo ini_get('upload_max_filesize'); ?>)</div>
                            </div>
                        </label>
                        <div class="file-name" id="fileName"></div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="message">Additional Message (Optional)</label>
                    <textarea id="message" name="message" 
                              placeholder="Tell us about your track, your influences, or anything else you'd like us to know..."><?php echo htmlspecialchars($form_data['message']); ?></textarea>
                </div>
                
                <div class="progress-container" id="progressContainer">
                    <div class="progress-label">Uploading your track...</div>
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar" id="progressBar"></div>
                        <div class="progress-text" id="progressText">0%</div>
                    </div>
                    <div class="uploading-status" id="uploadingStatus">Preparing upload...</div>
                </div>
                
                <button type="submit" class="btn" id="submitBtn">Submit Your Track</button>
                
                <div class="disclaimer">
                    <strong>Submission Terms:</strong> By submitting your music, you confirm that you own all rights to the submitted material and grant <?php echo SITE_NAME; ?> permission to review and potentially feature your work. We respect your intellectual property and will not use your music without your explicit consent.
                </div>
            </form>
        </div>
        
        <div class="footer">
            <p>&copy; <?php echo date('Y'); ?> <?php echo SITE_NAME; ?> - A Division of Armhen Entertainment</p>
            <p>Designed by <a href="https://cactusdigitalmedia.ng" target="_blank">Cactus Digital Media</a></p>
        </div>
    </div>
    
    <script>
        const fileInput = document.getElementById('audio_file');
        const fileNameDisplay = document.getElementById('fileName');
        const fileUploadLabel = document.getElementById('fileUploadLabel');
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                fileNameDisplay.textContent = `📎 ${file.name} (${sizeMB} MB)`;
                fileUploadLabel.style.borderColor = '#7C5CFF';
                fileUploadLabel.style.background = 'rgba(124, 92, 255, 0.1)';
            } else {
                fileNameDisplay.textContent = '';
                fileUploadLabel.style.borderColor = 'rgba(124, 92, 255, 0.3)';
                fileUploadLabel.style.background = '#0B0E14';
            }
        });
        
        const form = document.getElementById('submitForm');
        const submitBtn = document.getElementById('submitBtn');
        const progressContainer = document.getElementById('progressContainer');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const uploadingStatus = document.getElementById('uploadingStatus');
        
        form.addEventListener('submit', function(e) {
            const file = fileInput.files[0];
            
            if (!file) {
                alert('Please select a file to upload');
                e.preventDefault();
                return false;
            }
            
            const maxSizeStr = '<?php echo ini_get("upload_max_filesize"); ?>';
            const maxSizeMB = parseInt(maxSizeStr);
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            
            if (file.size > maxSizeBytes) {
                alert(`File size must be less than ${maxSizeStr}`);
                e.preventDefault();
                return false;
            }
            
            e.preventDefault();
            
            progressContainer.classList.add('active');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Uploading...';
            uploadingStatus.textContent = 'Preparing upload...';
            
            const formData = new FormData(form);
            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', function(e) {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    progressBar.style.width = percentComplete + '%';
                    progressText.textContent = percentComplete + '%';
                    
                    if (percentComplete < 100) {
                        const mbLoaded = (e.loaded / (1024 * 1024)).toFixed(1);
                        const mbTotal = (e.total / (1024 * 1024)).toFixed(1);
                        uploadingStatus.textContent = `Uploading: ${mbLoaded}MB / ${mbTotal}MB`;
                    } else {
                        uploadingStatus.textContent = 'Processing your submission...';
                    }
                }
            });
            
            xhr.addEventListener('load', function() {
                progressBar.style.width = '100%';
                progressText.textContent = '100%';
                uploadingStatus.textContent = 'Upload complete! Redirecting...';
                
                setTimeout(function() {
                    window.location.reload();
                }, 1000);
            });
            
            xhr.addEventListener('error', function() {
                alert('Upload failed. Please check your connection and try again.');
                progressContainer.classList.remove('active');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Your Track';
                progressBar.style.width = '0%';
                progressText.textContent = '0%';
            });
            
            xhr.addEventListener('timeout', function() {
                alert('Upload timed out. Please try again with a smaller file or check your connection.');
                progressContainer.classList.remove('active');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Your Track';
                progressBar.style.width = '0%';
                progressText.textContent = '0%';
            });
            
            xhr.timeout = 300000;
            xhr.open('POST', window.location.href, true);
            xhr.send(formData);
        });
    </script>
</body>
</html>
