<?php
include 'config.php';

echo "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <title>Database Connection Status</title>
    <style>
        body { font-family: 'Inter', sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .status-card { background: #1e293b; padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); text-align: center; }
        .success { color: #10b981; }
        .error { color: #ef4444; }
    </style>
</head>
<body>
    <div class='status-card'>
        <h1>Database Status</h1>";

if (isset($conn)) {
    echo "<p class='success'>Connected successfully to <strong>" . DB_NAME . "</strong> on <strong>" . DB_HOST . "</strong></p>";
} else {
    echo "<p class='error'>Connection Failed. Please check your config.php settings.</p>";
}

echo "  <br>
        <a href='soc_dashboard.html' style='color: #3b82f6; text-decoration: none;'>View New SOC Dashboard &rarr;</a>
    </div>
</body>
</html>";
?>
