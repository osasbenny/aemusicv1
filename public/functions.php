<?php
/**
 * Helper functions for AE Music Lab submission form
 */

/**
 * Sanitize text input
 */
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Sanitize email
 */
function sanitize_email($email) {
    return filter_var(trim($email), FILTER_SANITIZE_EMAIL);
}

/**
 * Handle file upload
 */
function handle_file_upload($file) {
    $result = ['success' => false, 'error' => '', 'file_path' => '', 'file_name' => ''];
    
    // Check if file was uploaded
    if (!isset($file) || $file['error'] === UPLOAD_ERR_NO_FILE) {
        $result['error'] = 'No file was uploaded.';
        return $result;
    }
    
    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $result['error'] = 'File upload error. Please try again.';
        return $result;
    }
    
    // Check file size
    if ($file['size'] > MAX_FILE_SIZE) {
        $result['error'] = 'File size exceeds 50MB limit.';
        return $result;
    }
    
    // Get file extension
    $file_name = $file['name'];
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    
    // Validate file extension
    if (!in_array($file_ext, ALLOWED_EXTENSIONS)) {
        $result['error'] = 'Invalid file type. Only MP3, WAV, and MP4 files are allowed.';
        return $result;
    }
    
    // Validate MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    $allowed_types = array_merge(ALLOWED_AUDIO_TYPES, ALLOWED_VIDEO_TYPES);
    if (!in_array($mime_type, $allowed_types)) {
        $result['error'] = 'Invalid file type detected.';
        return $result;
    }
    
    // Create upload directory if it doesn't exist
    $upload_dir = UPLOAD_DIR;
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    // Generate unique filename
    $unique_name = date('Y-m-d_His') . '_' . uniqid() . '.' . $file_ext;
    $destination = $upload_dir . $unique_name;
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $destination)) {
        $result['success'] = true;
        $result['file_path'] = $destination;
        $result['file_name'] = $file_name;
    } else {
        $result['error'] = 'Failed to save uploaded file.';
    }
    
    return $result;
}

/**
 * Send email notification to admin
 */
function send_admin_notification($form_data, $file_name, $file_path) {
    $to = ADMIN_EMAIL;
    $subject = 'New Music Submission - ' . $form_data['song_title'];
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7C5CFF 0%, #00F5D4 100%); color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #7C5CFF; }
            .value { margin-top: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>New Music Submission</h1>
                <p>AE Music Lab Submission System</p>
            </div>
            <div class='content'>
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
                    <div class='label'>Uploaded File:</div>
                    <div class='value'>" . htmlspecialchars($file_name) . "</div>
                </div>
                <div class='field'>
                    <div class='label'>File Location:</div>
                    <div class='value'>" . htmlspecialchars($file_path) . "</div>
                </div>";
    
    if (!empty($form_data['message'])) {
        $message .= "
                <div class='field'>
                    <div class='label'>Message:</div>
                    <div class='value'>" . nl2br(htmlspecialchars($form_data['message'])) . "</div>
                </div>";
    }
    
    $message .= "
                <div class='field'>
                    <div class='label'>Submission Time:</div>
                    <div class='value'>" . date('F j, Y g:i A') . "</div>
                </div>
            </div>
            <div class='footer'>
                <p>This is an automated notification from AE Music Lab</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: " . SMTP_FROM_NAME . " <" . SMTP_FROM_EMAIL . ">" . "\r\n";
    
    return mail($to, $subject, $message, $headers);
}

/**
 * Send confirmation email to artist
 */
function send_artist_confirmation($form_data) {
    $to = $form_data['email'];
    $subject = 'Thank You for Your Submission - ' . SITE_NAME;
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7C5CFF 0%, #00F5D4 100%); color: white; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #7C5CFF 0%, #00F5D4 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>" . SITE_NAME . "</h1>
                <p>The Science of Sounds</p>
            </div>
            <div class='content'>
                <h2>Thank You, " . htmlspecialchars($form_data['artist_name']) . "!</h2>
                <p>We've received your submission for <strong>" . htmlspecialchars($form_data['song_title']) . "</strong>.</p>
                
                <p>Our team will carefully review your track and get back to you within <strong>3-5 business days</strong>.</p>
                
                <h3>What Happens Next?</h3>
                <ul>
                    <li>Our A&R team will listen to your submission</li>
                    <li>We'll evaluate it based on production quality, originality, and market potential</li>
                    <li>You'll receive feedback via email regardless of the outcome</li>
                </ul>
                
                <p>In the meantime, feel free to explore our beat store and connect with us on social media.</p>
                
                <center>
                    <a href='" . SITE_URL . "' class='button'>Visit AE Music Lab</a>
                </center>
                
                <p style='margin-top: 30px; font-size: 14px; color: #666;'>
                    <strong>Submission Details:</strong><br>
                    Artist: " . htmlspecialchars($form_data['artist_name']) . "<br>
                    Song: " . htmlspecialchars($form_data['song_title']) . "<br>
                    Submitted: " . date('F j, Y g:i A') . "
                </p>
            </div>
            <div class='footer'>
                <p>&copy; " . date('Y') . " " . SITE_NAME . " - A Division of Armhen Entertainment</p>
                <p>Designed by <a href='https://cactusdigitalmedia.ng'>Cactus Digital Media</a></p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: " . SMTP_FROM_NAME . " <" . SMTP_FROM_EMAIL . ">" . "\r\n";
    $headers .= "Reply-To: " . ADMIN_EMAIL . "\r\n";
    
    return mail($to, $subject, $message, $headers);
}

/**
 * Create .htaccess file to protect uploads directory
 */
function create_upload_htaccess() {
    $htaccess_content = "# Protect uploaded files\n";
    $htaccess_content .= "Options -Indexes\n";
    $htaccess_content .= "<FilesMatch \"\\.(mp3|wav|mp4|mov)$\">\n";
    $htaccess_content .= "    Order Allow,Deny\n";
    $htaccess_content .= "    Deny from all\n";
    $htaccess_content .= "</FilesMatch>\n";
    
    $htaccess_path = UPLOAD_DIR . '.htaccess';
    
    if (!file_exists($htaccess_path)) {
        file_put_contents($htaccess_path, $htaccess_content);
    }
}

// Create upload directory protection on first run
if (file_exists(UPLOAD_DIR)) {
    create_upload_htaccess();
}
