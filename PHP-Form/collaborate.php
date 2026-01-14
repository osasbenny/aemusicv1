<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Collaborate on Beat - AE Music Lab</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            padding: 20px;
            color: #fff;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
        }

        .logo {
            font-size: 32px;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }

        .subtitle {
            color: #06b6d4;
            font-style: italic;
        }

        .form-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border: 1px solid rgba(255, 255, 255, 0.18);
        }

        h1 {
            font-size: 36px;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #a78bfa 0%, #06b6d4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .description {
            color: #94a3b8;
            margin-bottom: 30px;
            line-height: 1.6;
        }

        .form-group {
            margin-bottom: 24px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #e2e8f0;
        }

        .required {
            color: #f87171;
        }

        input[type="text"],
        input[type="email"],
        textarea,
        select {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: #fff;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        input:focus,
        textarea:focus,
        select:focus {
            outline: none;
            border-color: #a78bfa;
            background: rgba(255, 255, 255, 0.15);
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

        .file-upload-input {
            display: none;
        }

        .file-upload-label {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            background: rgba(167, 139, 250, 0.1);
            border: 2px dashed #a78bfa;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .file-upload-label:hover {
            background: rgba(167, 139, 250, 0.2);
            border-color: #06b6d4;
        }

        .file-info {
            margin-top: 10px;
            color: #06b6d4;
            font-size: 14px;
        }

        .submit-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
        }

        .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .progress-container {
            display: none;
            margin-top: 20px;
        }

        .progress-bar {
            width: 100%;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            overflow: hidden;
            position: relative;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #a78bfa 0%, #06b6d4 100%);
            width: 0%;
            transition: width 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
        }

        .progress-text {
            text-align: center;
            margin-top: 10px;
            color: #94a3b8;
        }

        .success-message,
        .error-message {
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
        }

        .success-message {
            background: rgba(34, 197, 94, 0.2);
            border: 1px solid #22c55e;
            color: #86efac;
        }

        .error-message {
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid #ef4444;
            color: #fca5a5;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">AE Music Lab</div>
            <div class="subtitle">The Science of Sounds</div>
        </div>

        <div class="form-card">
            <h1>Collaborate on a Beat</h1>
            <p class="description">
                Upload your vocals and collaborate with our producers. We'll review your submission and get back to you within 3-5 business days.
            </p>

            <div id="successMessage" class="success-message"></div>
            <div id="errorMessage" class="error-message"></div>

            <form id="collaborationForm" enctype="multipart/form-data">
                <div class="form-group">
                    <label>Artist Name <span class="required">*</span></label>
                    <input type="text" name="artist_name" required placeholder="Your artist name">
                </div>

                <div class="form-group">
                    <label>Email Address <span class="required">*</span></label>
                    <input type="email" name="artist_email" required placeholder="your@email.com">
                </div>

                <div class="form-group">
                    <label>Beat Title <span class="required">*</span></label>
                    <input type="text" name="beat_title" required placeholder="Which beat do you want to collaborate on?">
                </div>

                <div class="form-group">
                    <label>Upload Your Vocals <span class="required">*</span></label>
                    <div class="file-upload">
                        <input type="file" name="vocals" id="vocalsFile" class="file-upload-input" accept="audio/*" required>
                        <label for="vocalsFile" class="file-upload-label">
                            <div>
                                <div style="font-size: 48px; margin-bottom: 10px;">🎤</div>
                                <div>Click to upload or drag and drop</div>
                                <div style="font-size: 14px; color: #94a3b8; margin-top: 8px;">MP3, WAV, or MP4 (Max 50MB)</div>
                            </div>
                        </label>
                        <div id="fileInfo" class="file-info"></div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Additional Message (Optional)</label>
                    <textarea name="message" placeholder="Tell us about your vision for this collaboration..."></textarea>
                </div>

                <div class="progress-container" id="progressContainer">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill">0%</div>
                    </div>
                    <div class="progress-text" id="progressText">Preparing upload...</div>
                </div>

                <button type="submit" class="submit-btn" id="submitBtn">
                    Submit Collaboration Request
                </button>
            </form>
        </div>
    </div>

    <script>
        const form = document.getElementById('collaborationForm');
        const fileInput = document.getElementById('vocalsFile');
        const fileInfo = document.getElementById('fileInfo');
        const submitBtn = document.getElementById('submitBtn');
        const progressContainer = document.getElementById('progressContainer');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');

        // Get beat title from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const beatTitle = urlParams.get('beat');
        if (beatTitle) {
            document.querySelector('input[name="beat_title"]').value = decodeURIComponent(beatTitle);
        }

        // File input change handler
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                fileInfo.textContent = `✓ Selected: ${file.name} (${sizeMB} MB)`;
            }
        });

        // Form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            
            // Validate file size
            const file = fileInput.files[0];
            if (file && file.size > 50 * 1024 * 1024) {
                showError('File size must be less than 50MB');
                return;
            }

            // Show progress
            submitBtn.disabled = true;
            submitBtn.textContent = 'Uploading...';
            progressContainer.style.display = 'block';
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';

            // Create XMLHttpRequest for progress tracking
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', function(e) {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    progressFill.style.width = percentComplete + '%';
                    progressFill.textContent = percentComplete + '%';
                    
                    const loadedMB = (e.loaded / (1024 * 1024)).toFixed(2);
                    const totalMB = (e.total / (1024 * 1024)).toFixed(2);
                    progressText.textContent = `Uploading: ${loadedMB} MB / ${totalMB} MB`;
                }
            });

            xhr.addEventListener('load', function() {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        showSuccess('Collaboration request submitted successfully! We\'ll be in touch soon.');
                        form.reset();
                        fileInfo.textContent = '';
                        setTimeout(() => {
                            window.location.href = '/beats';
                        }, 3000);
                    } else {
                        showError(response.error || 'Failed to submit collaboration request');
                    }
                } else {
                    showError('Server error. Please try again later.');
                }
                
                resetForm();
            });

            xhr.addEventListener('error', function() {
                showError('Network error. Please check your connection and try again.');
                resetForm();
            });

            xhr.open('POST', 'collaborate-handler.php');
            xhr.send(formData);
        });

        function showSuccess(message) {
            successMessage.textContent = message;
            successMessage.style.display = 'block';
        }

        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }

        function resetForm() {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Collaboration Request';
            progressContainer.style.display = 'none';
            progressFill.style.width = '0%';
            progressFill.textContent = '0%';
        }
    </script>
</body>
</html>
