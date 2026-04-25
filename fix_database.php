<?php
require_once 'config.php';

header('Content-Type: text/html; charset=utf-8');

echo "<h1 style='font-family: sans-serif; color: #0A192F;'>Database Optimization</h1>";

try {
    // Upgrade files table to support large documents (PDF, Excel, etc.)
    $conn->exec("ALTER TABLE files MODIFY COLUMN url LONGTEXT");
    echo "<p style='color: green;'>✅ Success: Storage capacity upgraded to LONGTEXT (supports up to 4GB).</p>";
    
    // Ensure leads has the status column
    try {
        $conn->exec("ALTER TABLE leads ADD COLUMN status varchar(20) DEFAULT 'new'");
        echo "<p style='color: green;'>✅ Success: Leads table structure updated.</p>";
    } catch(Exception $e) {}

    // Ensure tasks has the priority column
    try {
        $conn->exec("ALTER TABLE tasks ADD COLUMN priority varchar(20) DEFAULT 'normal'");
        echo "<p style='color: green;'>✅ Success: Tasks table structure updated.</p>";
    } catch(Exception $e) {}

    echo "<p>Your database is now fully optimized for all file types and sizes.</p>";
    echo "<a href='index.html' style='display: inline-block; padding: 10px 20px; background: #0A192F; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;'>Back to Dashboard</a>";

} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>
