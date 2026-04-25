<?php
// Database configuration - Auto Detection
// Database configuration - Robust Auto Detection
$isLocal = in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1'])
    || $_SERVER['HTTP_HOST'] == 'localhost'
    || strpos($_SERVER['HTTP_HOST'], '192.168.') !== false;

if ($isLocal) {
    // LOCAL SETTINGS (XAMPP)
    define('DB_HOST', 'localhost');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('DB_NAME', 'mapcom_db');
} else {
    // PRODUCTION SETTINGS (InfinityFree)
    define('DB_HOST', 'sql312.infinityfree.com');
    define('DB_USER', 'if0_41641864');
    define('DB_PASS', 'O6fTYjh6f9');
    define('DB_NAME', 'if0_41641864_if0_41752699_if0_4_if0_12345678_dbname');
}

// Security Headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

try {
    $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Connection Error. Check DB Name in config.php"]);
    exit;
}

/**
 * Global Response Helper 
 * Note: Removed from api.php to avoid redeclaration errors
 */
if (!function_exists('sendResponse')) {
    function sendResponse($status, $message, $data = null)
    {
        echo json_encode(["status" => $status, "message" => $message, "data" => $data]);
        exit;
    }
}

/**
 * Global JSON Input Helper
 */
if (!function_exists('getJsonInput')) {
    function getJsonInput()
    {
        return json_decode(file_get_contents("php://input"), true);
    }
}
?>