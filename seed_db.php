<?php
require_once 'config.php';

header('Content-Type: text/html; charset=utf-8');

echo "<h1 style='font-family: sans-serif; color: #0A192F;'>MapCom2 Database Synchronizer</h1>";

// TACTICAL FIX: Ensure files table can handle large documents (LONGTEXT)
try {
    $conn->exec("ALTER TABLE files MODIFY COLUMN url LONGTEXT");
    echo "<p style='color: green;'>System: Storage capacity upgraded for large documents.</p>";
} catch (Exception $e) {
    // Table might not exist yet, seed.sql will handle it
}

try {
    $sql = file_get_contents('sample_data.sql');
    
    // Split SQL by semicolon, but be careful with delimiters if they exist
    // This is a simple approach for standard seed files
    $queries = explode(';', $sql);
    
    $successCount = 0;
    foreach ($queries as $query) {
        $trimmed = trim($query);
        if (!empty($trimmed)) {
            $conn->exec($trimmed);
            $successCount++;
        }
    }

    echo "<div style='padding: 20px; background: #e6fffa; border-left: 5px solid #38b2ac; font-family: sans-serif;'>";
    echo "<h2 style='color: #2c7a7b; margin-top: 0;'>Sync Complete!</h2>";
    echo "<p>Successfully executed $successCount tactical data operations.</p>";
    echo "<p>Your database is now populated with luxury sample properties, users, and tasks.</p>";
    echo "<a href='index.html' style='display: inline-block; padding: 10px 20px; background: #0A192F; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;'>Return to Command Center</a>";
    echo "</div>";

} catch (Exception $e) {
    echo "<div style='padding: 20px; background: #fff5f5; border-left: 5px solid #e53e3e; font-family: sans-serif;'>";
    echo "<h2 style='color: #c53030; margin-top: 0;'>Sync Failure</h2>";
    echo "<p>Error: " . $e->getMessage() . "</p>";
    echo "</div>";
}
?>
