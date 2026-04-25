<?php
require 'config.php';

echo "<h1>Database Explorer</h1>";

try {
    $tables = $conn->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $table) {
        echo "<h2>Table: $table</h2>";
        $stmt = $conn->query("SELECT * FROM $table LIMIT 5");
        $rows = $stmt->fetchAll();
        echo "<pre>" . print_r($rows, true) . "</pre>";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
