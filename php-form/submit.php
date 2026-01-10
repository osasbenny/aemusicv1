<?php
/**
 * AE Music Lab - Music Submission Form
 * Standalone PHP version for basic hosting
 */

require_once 'config.php';
require_once 'functions.php';

// Initialize variables
$success = false;
$error = '';
$form_data = [
    'artist_name' => '',
    'email' => '',
    'song_title' => '',
    'message' => ''
];

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
        
        if ($upload_result['success']) {
            $audio_file_path = $upload_result['file_path'];
            $audio_file_name = $upload_result['file_name'];
            
            // Send admin notification
            $admin_email_sent = send_admin_notification($form_data, $audio_file_name, $audio_file_path);
            
            // Send artist confirmation
            $artist_email_sent = send_artist_confirmation($form_data);
            
            if ($admin_email_sent && $artist_email_sent) {
                $success = true;
                // Clear form data on success
                $form_data = [
                    'artist_name' => '',
                    'email' => '',
                    'song_title' => '',
                    'message' => ''
                ];
            } else {
                $error = 'Your submission was received but there was an issue sending confirmation emails. We will review your submission shortly.';
                $success = true; // Still show success since file was uploaded
            }
        } else {
            $error = $upload_result['error'];
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submit Your Music - <?php echo SITE_NAME; ?></title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #0B0E14 0%, #151A26 100%);
            color: #ffffff;
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .logo h1 {
            font-size: 2.5rem;
            background: linear-gradient(135deg, #7C5CFF 0%, #00F5D4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
        }
        
        .logo p {
            color: #00F5D4;
            font-size: 1rem;
            font-style: italic;
        }
        
        .card {
            background: #151A26;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(124, 92, 255, 0.1);
        }
        
        .card h2 {
            font-size: 1.8rem;
            margin-bottom: 10px;
            color: #ffffff;
        }
        
        .card p {
            color: #A1A1AA;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .alert {
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-size: 0.95rem;
        }
        
        .alert-success {
            background: rgba(0, 245, 212, 0.1);
            border: 1px solid #00F5D4;
            color: #00F5D4;
        }
        
        .alert-error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid #ef4444;
            color: #ef4444;
        }
        
        .form-group {
            margin-bottom: 24px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            color: #ffffff;
            font-weight: 500;
        }
        
        label .required {
            color: #ef4444;
        }
        
        input[type="text"],
        input[type="email"],
        textarea {
            width: 100%;
            padding: 12px 16px;
            background: #0B0E14;
            border: 1px solid rgba(124, 92, 255, 0.2);
            border-radius: 8px;
            color: #ffffff;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        
        input[type="text"]:focus,
        input[type="email"]:focus,
        textarea:focus {
            outline: none;
            border-color: #7C5CFF;
        }
        
        textarea {
            min-height: 120px;
            resize: vertical;
        }
        
        .file-upload {
            position: relative;
            display: inline-block;
            width: 100%;
        }
        
        input[type="file"] {
            display: none;
        }
        
        .file-upload-label {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            background: #0B0E14;
            border: 2px dashed rgba(124, 92, 255, 0.3);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .file-upload-label:hover {
            border-color: #7C5CFF;
            background: rgba(124, 92, 255, 0.05);
        }
        
        .file-upload-text {
            text-align: center;
        }
        
        .file-upload-text .icon {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        
        .file-name {
            margin-top: 10px;
            color: #00F5D4;
            font-size: 0.9rem;
        }
        
        .file-info {
            margin-top: 8px;
            font-size: 0.85rem;
            color: #A1A1AA;
        }
        
        .btn {
            width: 100%;
            padding: 14px 24px;
            background: linear-gradient(135deg, #7C5CFF 0%, #00F5D4 100%);
            color: #ffffff;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(124, 92, 255, 0.4);
        }
        
        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .disclaimer {
            margin-top: 24px;
            padding: 16px;
            background: rgba(124, 92, 255, 0.05);
            border-radius: 8px;
            font-size: 0.85rem;
            color: #A1A1AA;
            line-height: 1.6;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #A1A1AA;
            font-size: 0.9rem;
        }
        
        .footer a {
            color: #7C5CFF;
            text-decoration: none;
        }
        
        .footer a:hover {
            color: #00F5D4;
        }
        
        /* Upload Progress Bar */
        .progress-container {
            display: none;
            margin-top: 20px;
        }
        
        .progress-container.active {
            display: block;
        }
        
        .progress-bar-wrapper {
            width: 100%;
            height: 30px;
            background: #0B0E14;
            border-radius: 15px;
            overflow: hidden;
            border: 1px solid rgba(124, 92, 255, 0.2);
            position: relative;
        }
        
        .progress-bar {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #7C5CFF 0%, #00F5D4 100%);
            transition: width 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        
        .progress-text {
            position: absolute;
            width: 100%;
            text-align: center;
            font-weight: 600;
            font-size: 0.85rem;
            color: #ffffff;
            z-index: 2;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .progress-label {
            margin-bottom: 10px;
            color: #00F5D4;
            font-size: 0.9rem;
            font-weight: 500;
        }
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
            
            <?php if ($success): ?>
                <div class="alert alert-success">
                    <strong>Success!</strong> Your submission has been received. We'll review your track and get back to you within 3-5 business days. Check your email for confirmation.
                </div>
            <?php endif; ?>
            
            <?php if ($error): ?>
                <div class="alert alert-error">
                    <strong>Error:</strong> <?php echo htmlspecialchars($error); ?>
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
                        <input type="file" id="audio_file" name="audio_file" accept=".mp3,.wav,.mp4" required>
                        <label for="audio_file" class="file-upload-label">
                            <div class="file-upload-text">
                                <div class="icon">🎵</div>
                                <div>Click to upload or drag and drop</div>
                                <div class="file-info">MP3, WAV, or MP4 (Max 50MB)</div>
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
                
                <button type="submit" class="btn" id="submitBtn">Submit Your Track</button>
                
                <!-- Upload Progress Bar -->
                <div class="progress-container" id="progressContainer">
                    <div class="progress-label">Uploading your track...</div>
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar" id="progressBar"></div>
                        <div class="progress-text" id="progressText">0%</div>
                    </div>
                </div>
                
                <div class="disclaimer">
                    <strong>Submission Terms:</strong> By submitting your music, you confirm that you own all rights to the submitted material and grant AE Music Lab permission to review and potentially feature your work. We respect your intellectual property and will not use your music without your explicit consent.
                </div>
            </form>
        </div>
        
        <div class="footer">
            <p>&copy; <?php echo date('Y'); ?> <?php echo SITE_NAME; ?> - A Division of Armhen Entertainment</p>
            <p>Designed by <a href="https://cactusdigitalmedia.ng" target="_blank">Cactus Digital Media</a></p>
        </div>
    </div>
    
    <script>
        // File upload preview
        document.getElementById('audio_file').addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name;
            const fileNameDisplay = document.getElementById('fileName');
            if (fileName) {
                fileNameDisplay.textContent = '📎 ' + fileName;
            } else {
                fileNameDisplay.textContent = '';
            }
        });
        
        // Form submission with progress tracking
        document.getElementById('submitForm').addEventListener('submit', function(e) {
            const fileInput = document.getElementById('audio_file');
            const file = fileInput.files[0];
            
            if (file) {
                const maxSize = <?php echo MAX_FILE_SIZE; ?>;
                if (file.size > maxSize) {
                    e.preventDefault();
                    alert('File size must be less than 50MB');
                    return false;
                }
            }
            
            // Prevent default form submission
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            
            // Show progress bar
            const progressContainer = document.getElementById('progressContainer');
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');
            const submitBtn = document.getElementById('submitBtn');
            
            progressContainer.classList.add('active');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Uploading...';
            
            // Create XMLHttpRequest for progress tracking
            const xhr = new XMLHttpRequest();
            
            // Track upload progress
            xhr.upload.addEventListener('progress', function(e) {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    progressBar.style.width = percentComplete + '%';
                    progressText.textContent = percentComplete + '%';
                }
            });
            
            // Handle completion
            xhr.addEventListener('load', function() {
                if (xhr.status === 200) {
                    // Success - reload page to show success message
                    progressBar.style.width = '100%';
                    progressText.textContent = '100%';
                    setTimeout(function() {
                        window.location.reload();
                    }, 500);
                } else {
                    // Error
                    alert('Upload failed. Please try again.');
                    progressContainer.classList.remove('active');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Your Track';
                }
            });
            
            // Handle errors
            xhr.addEventListener('error', function() {
                alert('Upload failed. Please check your connection and try again.');
                progressContainer.classList.remove('active');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Your Track';
            });
            
            // Send the request
            xhr.open('POST', window.location.href, true);
            xhr.send(formData);
        });
    </script>
</body>
</html>
