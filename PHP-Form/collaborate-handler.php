<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON response header
header('Content-Type: application/json');

// Include SMTP configuration
require_once 'smtp-config.php';

// PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

try {
    // Validate POST request
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    // Get form data
    $artistName = isset($_POST['artist_name']) ? trim($_POST['artist_name']) : '';
    $artistEmail = isset($_POST['artist_email']) ? trim($_POST['artist_email']) : '';
    $beatTitle = isset($_POST['beat_title']) ? trim($_POST['beat_title']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    // Validate required fields
    if (empty($artistName) || empty($artistEmail) || empty($beatTitle)) {
        throw new Exception('Please fill in all required fields');
    }

    // Validate email
    if (!filter_var($artistEmail, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Please provide a valid email address');
    }

    // Handle file upload
    if (!isset($_FILES['vocals']) || $_FILES['vocals']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Please upload your vocals file');
    }

    $file = $_FILES['vocals'];
    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    $fileSize = $file['size'];
    $fileType = $file['type'];

    // Validate file size (50MB max)
    $maxFileSize = 50 * 1024 * 1024; // 50MB in bytes
    if ($fileSize > $maxFileSize) {
        throw new Exception('File size must be less than 50MB');
    }

    // Validate file type
    $allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a', 'audio/webm'];
    if (!in_array($fileType, $allowedTypes)) {
        throw new Exception('Invalid file type. Please upload an audio file (MP3, WAV, or MP4)');
    }

    // Create uploads directory if it doesn't exist
    $uploadsDir = __DIR__ . '/uploads/collaborations';
    if (!file_exists($uploadsDir)) {
        mkdir($uploadsDir, 0755, true);
    }

    // Generate unique filename
    $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
    $uniqueFileName = date('Y-m-d_His') . '_' . preg_replace('/[^a-zA-Z0-9]/', '_', $artistName) . '_' . preg_replace('/[^a-zA-Z0-9]/', '_', $beatTitle) . '.' . $fileExtension;
    $uploadPath = $uploadsDir . '/' . $uniqueFileName;

    // Move uploaded file
    if (!move_uploaded_file($fileTmpName, $uploadPath)) {
        throw new Exception('Failed to save uploaded file');
    }

    // Send email to admin (info@aemusiclab.com)
    $mail = new PHPMailer(true);
    
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USER;
    $mail->Password = SMTP_PASS;
    $mail->SMTPSecure = SMTP_SECURE;
    $mail->Port = SMTP_PORT;

    // Email settings
    $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
    $mail->addAddress('info@aemusiclab.com', 'AE Music Lab');
    $mail->addReplyTo($artistEmail, $artistName);

    // Attach the vocals file
    $mail->addAttachment($uploadPath, $uniqueFileName);

    // Email content
    $mail->isHTML(true);
    $mail->Subject = "New Collaboration Request: $artistName x $beatTitle";
    
    $emailBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .section { background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .label { font-weight: bold; color: #4b5563; }
            .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2 style='margin: 0;'>🎤 New Collaboration Request</h2>
            </div>
            
            <div class='section'>
                <h3 style='margin-top: 0;'>Artist Information</h3>
                <p><span class='label'>Name:</span> $artistName</p>
                <p><span class='label'>Email:</span> $artistEmail</p>
            </div>

            <div class='section'>
                <h3 style='margin-top: 0;'>Beat Information</h3>
                <p><span class='label'>Beat Title:</span> $beatTitle</p>
            </div>

            " . (!empty($message) ? "
            <div class='section'>
                <h3 style='margin-top: 0;'>Artist's Message</h3>
                <p>" . nl2br(htmlspecialchars($message)) . "</p>
            </div>
            " : "") . "

            <p style='color: #6b7280; font-size: 14px;'>
                The artist's vocal recording is attached to this email. Listen to their submission and reach out to discuss collaboration opportunities.
            </p>

            <div class='footer'>
                <p>AE Music Lab - The Science of Sounds<br />
                19 Loop Street, Cape Town City Centre, Cape Town, South Africa<br />
                info@aemusiclab.com | +27 69 923 0893<br />
                Powered by Armhen Entertainment</p>
            </div>
        </div>
    </body>
    </html>
    ";

    $mail->Body = $emailBody;
    $mail->AltBody = strip_tags(str_replace('<br />', "\n", $emailBody));

    // Send admin email
    if (!$mail->send()) {
        throw new Exception('Failed to send email notification');
    }

    // Send confirmation email to artist
    $confirmMail = new PHPMailer(true);
    $confirmMail->isSMTP();
    $confirmMail->Host = SMTP_HOST;
    $confirmMail->SMTPAuth = true;
    $confirmMail->Username = SMTP_USER;
    $confirmMail->Password = SMTP_PASS;
    $confirmMail->SMTPSecure = SMTP_SECURE;
    $confirmMail->Port = SMTP_PORT;

    $confirmMail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
    $confirmMail->addAddress($artistEmail, $artistName);

    $confirmMail->isHTML(true);
    $confirmMail->Subject = "Collaboration Request Received - $beatTitle";
    
    $confirmEmailBody = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .section { background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px; }
            .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2 style='margin: 0;'>✨ Thank You for Your Submission!</h2>
            </div>
            
            <p>Hi $artistName,</p>
            
            <p>We've received your collaboration request for <strong>\"$beatTitle\"</strong>. Our team will review your vocals and get back to you within 3-5 business days.</p>

            <div class='section'>
                <h3 style='margin-top: 0;'>What's Next?</h3>
                <ul style='color: #4b5563;'>
                    <li>Our producers will listen to your submission</li>
                    <li>We'll evaluate the collaboration potential</li>
                    <li>You'll receive a response via email</li>
                </ul>
            </div>

            <p style='color: #6b7280; font-size: 14px;'>
                In the meantime, feel free to browse more beats on our platform and submit additional collaboration requests.
            </p>

            <div style='text-align: center;'>
                <a href='https://aemusiclab.com/beats' class='button'>Browse More Beats</a>
            </div>

            <div class='footer'>
                <p>AE Music Lab - The Science of Sounds<br />
                19 Loop Street, Cape Town City Centre, Cape Town, South Africa<br />
                info@aemusiclab.com | +27 69 923 0893</p>
            </div>
        </div>
    </body>
    </html>
    ";

    $confirmMail->Body = $confirmEmailBody;
    $confirmMail->AltBody = strip_tags(str_replace('<br />', "\n", $confirmEmailBody));

    $confirmMail->send();

    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Collaboration request submitted successfully!'
    ]);

} catch (Exception $e) {
    // Return error response
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
