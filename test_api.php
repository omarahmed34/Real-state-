<?php
$_SERVER['REQUEST_METHOD'] = 'GET';
$_GET['action'] = 'get_initial_data';
$_GET['userId'] = 1;
$_GET['role'] = 'owner';
require 'api.php';
?>
