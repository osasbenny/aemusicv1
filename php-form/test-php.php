<?php
/**
 * PHP Environment Test for AE Music Lab
 * Upload this file to your cPanel and visit it in your browser
 * to verify your PHP environment is configured correctly
 */

// Enable error display
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Get current directory
$current_dir = __DIR__;
$uploads_dir = $current_dir . '/uploads';

// Test results
$tests = [];

// Test 1: PHP Version
$tests['PHP Version'] = [
    'value' => phpversion(),
    'status' => version_compare(phpversion(), '7.0.0', '>=') ? 'PASS' : 'FAIL',
    'note' => 'PHP 7.0+ required'
];

// Test 2: File Upload Settings
$upload_max = ini_get('upload_max_filesize');
$post_max = ini_get('post_max_size');
$tests['Upload Max Filesize'] = [
    'value' => $upload_max,
    'status' => 'INFO',
    'note' => 'Should be at least 50M for music files'
];
$tests['Post Max Size'] = [
    'value' => $post_max,
    'status' => 'INFO',
    'note' => 'Should be at least 50M for music files'
];

// Test 3: Memory Limit
$memory_limit = ini_get('memory_limit');
$tests['Memory Limit'] = [
    'value' => $memory_limit,
    'status' => 'INFO',
    'note' => 'Current memory limit'
];

// Test 4: Max Execution Time
$max_execution_time = ini_get('max_execution_time');
$tests['Max Execution Time'] = [
    'value' => $max_execution_time . ' seconds',
    'status' => 'INFO',
    'note' => 'Time limit for script execution'
];

// Test 5: File Upload Support
$tests['File Uploads Enabled'] = [
    'value' => ini_get('file_uploads') ? 'Yes' : 'No',
    'status' => ini_get('file_uploads') ? 'PASS' : 'FAIL',
    'note' => 'Must be enabled for file uploads'
];

// Test 6: Directory Permissions
$tests['Current Directory'] = [
    'value' => $current_dir,
    'status' => 'INFO',
    'note' => 'Working directory path'
];

$tests['Current Directory Writable'] = [
    'value' => is_writable($current_dir) ? 'Yes' : 'No',
    'status' => is_writable($current_dir) ? 'PASS' : 'FAIL',
    'note' => 'Directory must be writable to create uploads folder'
];

// Test 7: Uploads Directory
if (file_exists($uploads_dir)) {
    $tests['Uploads Directory Exists'] = [
        'value' => 'Yes',
        'status' => 'PASS',
        'note' => 'Path: ' . $uploads_dir
    ];
    $tests['Uploads Directory Writable'] = [
        'value' => is_writable($uploads_dir) ? 'Yes' : 'No',
        'status' => is_writable($uploads_dir) ? 'PASS' : 'FAIL',
        'note' => 'Must be writable to save uploaded files'
    ];
} else {
    $tests['Uploads Directory Exists'] = [
        'value' => 'No',
        'status' => 'INFO',
        'note' => 'Will be created automatically on first upload'
    ];
}

// Test 8: Mail Function
$tests['Mail Function Available'] = [
    'value' => function_exists('mail') ? 'Yes' : 'No',
    'status' => function_exists('mail') ? 'PASS' : 'FAIL',
    'note' => 'Required for sending confirmation emails'
];

// Test 9: Required PHP Extensions
$required_extensions = ['fileinfo', 'filter'];
foreach ($required_extensions as $ext) {
    $tests["Extension: $ext"] = [
        'value' => extension_loaded($ext) ? 'Loaded' : 'Not Loaded',
        'status' => extension_loaded($ext) ? 'PASS' : 'FAIL',
        'note' => 'Required for file validation'
    ];
}

// Test 10: Try to create uploads directory
if (!file_exists($uploads_dir)) {
    $create_result = @mkdir($uploads_dir, 0755, true);
    $tests['Create Uploads Directory'] = [
        'value' => $create_result ? 'Success' : 'Failed',
        'status' => $create_result ? 'PASS' : 'FAIL',
        'note' => $create_result ? 'Directory created successfully' : 'Could not create directory - check permissions'
    ];
    
    if ($create_result) {
        // Try to create a test file
        $test_file = $uploads_dir . '/test.txt';
        $write_result = @file_put_contents($test_file, 'Test file');
        $tests['Write Test File'] = [
            'value' => $write_result !== false ? 'Success' : 'Failed',
            'status' => $write_result !== false ? 'PASS' : 'FAIL',
            'note' => $write_result !== false ? 'Can write files to uploads directory' : 'Cannot write files - check permissions'
        ];
        
        // Clean up test file
        if ($write_result !== false) {
            @unlink($test_file);
        }
    }
}

// Calculate overall status
$pass_count = 0;
$fail_count = 0;
foreach ($tests as $test) {
    if ($test['status'] === 'PASS') $pass_count++;
    if ($test['status'] === 'FAIL') $fail_count++;
}

$overall_status = $fail_count === 0 ? 'READY' : 'NEEDS ATTENTION';
$status_color = $fail_count === 0 ? '#00F5D4' : '#ef4444';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Environment Test - AE Music Lab</title>
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
            padding: 40px 20px;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .header h1 {
            font-size: 2.5rem;
            background: linear-gradient(135deg, #7C5CFF 0%, #00F5D4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #A1A1AA;
            font-size: 1.1rem;
        }
        
        .status-card {
            background: #151A26;
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 30px;
            border: 2px solid <?php echo $status_color; ?>;
            text-align: center;
        }
        
        .status-card h2 {
            font-size: 2rem;
            color: <?php echo $status_color; ?>;
            margin-bottom: 10px;
        }
        
        .status-card p {
            color: #A1A1AA;
            font-size: 1rem;
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 20px;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            color: #ffffff;
        }
        
        .stat-label {
            color: #A1A1AA;
            font-size: 0.9rem;
            margin-top: 5px;
        }
        
        .test-results {
            background: #151A26;
            border-radius: 16px;
            padding: 30px;
            border: 1px solid rgba(124, 92, 255, 0.1);
        }
        
        .test-results h3 {
            font-size: 1.5rem;
            margin-bottom: 20px;
            color: #ffffff;
        }
        
        .test-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 15px;
            margin-bottom: 10px;
            background: #0B0E14;
            border-radius: 8px;
            border-left: 4px solid transparent;
        }
        
        .test-item.pass {
            border-left-color: #00F5D4;
        }
        
        .test-item.fail {
            border-left-color: #ef4444;
        }
        
        .test-item.info {
            border-left-color: #7C5CFF;
        }
        
        .test-name {
            flex: 1;
            font-weight: 600;
            color: #ffffff;
        }
        
        .test-details {
            flex: 2;
            text-align: right;
        }
        
        .test-value {
            color: #00F5D4;
            font-family: monospace;
            margin-bottom: 5px;
        }
        
        .test-note {
            color: #A1A1AA;
            font-size: 0.85rem;
        }
        
        .test-status {
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-left: 15px;
        }
        
        .test-status.pass {
            background: rgba(0, 245, 212, 0.1);
            color: #00F5D4;
        }
        
        .test-status.fail {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }
        
        .test-status.info {
            background: rgba(124, 92, 255, 0.1);
            color: #7C5CFF;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #A1A1AA;
            font-size: 0.9rem;
        }
        
        .action-note {
            background: rgba(251, 191, 36, 0.1);
            border: 1px solid #fbbf24;
            color: #fbbf24;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .action-note h4 {
            margin-bottom: 10px;
            font-size: 1.1rem;
        }
        
        .action-note ul {
            margin-left: 20px;
            margin-top: 10px;
        }
        
        .action-note li {
            margin-bottom: 8px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>PHP Environment Test</h1>
            <p>AE Music Lab - Server Configuration Check</p>
        </div>
        
        <div class="status-card">
            <h2><?php echo $overall_status; ?></h2>
            <p><?php echo $fail_count === 0 ? 'Your server is configured correctly for the submission form!' : 'Some configuration issues need attention before deploying the form.'; ?></p>
            
            <div class="stats">
                <div class="stat">
                    <div class="stat-value" style="color: #00F5D4;"><?php echo $pass_count; ?></div>
                    <div class="stat-label">Passed</div>
                </div>
                <div class="stat">
                    <div class="stat-value" style="color: #ef4444;"><?php echo $fail_count; ?></div>
                    <div class="stat-label">Failed</div>
                </div>
            </div>
        </div>
        
        <div class="test-results">
            <h3>📊 Test Results</h3>
            
            <?php foreach ($tests as $name => $result): ?>
                <div class="test-item <?php echo strtolower($result['status']); ?>">
                    <div class="test-name"><?php echo htmlspecialchars($name); ?></div>
                    <div class="test-details">
                        <div class="test-value"><?php echo htmlspecialchars($result['value']); ?></div>
                        <div class="test-note"><?php echo htmlspecialchars($result['note']); ?></div>
                    </div>
                    <span class="test-status <?php echo strtolower($result['status']); ?>">
                        <?php echo $result['status']; ?>
                    </span>
                </div>
            <?php endforeach; ?>
            
            <?php if ($fail_count > 0): ?>
                <div class="action-note">
                    <h4>⚠️ Action Required</h4>
                    <p>Some tests failed. Here's what you need to do:</p>
                    <ul>
                        <?php if (!ini_get('file_uploads')): ?>
                            <li>Enable file uploads in php.ini (file_uploads = On)</li>
                        <?php endif; ?>
                        
                        <?php if (!is_writable($current_dir)): ?>
                            <li>Set directory permissions to 755 or 777 via cPanel File Manager</li>
                        <?php endif; ?>
                        
                        <?php if (!function_exists('mail')): ?>
                            <li>Contact your hosting provider to enable PHP mail() function</li>
                        <?php endif; ?>
                        
                        <?php foreach ($required_extensions as $ext): ?>
                            <?php if (!extension_loaded($ext)): ?>
                                <li>Enable PHP extension: <?php echo $ext; ?></li>
                            <?php endif; ?>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>
        </div>
        
        <div class="footer">
            <p>© <?php echo date('Y'); ?> AE Music Lab - Server Environment Test</p>
            <p style="margin-top: 10px;">Delete this file after testing for security</p>
        </div>
    </div>
</body>
</html>
