<?php
// Basic connection settings
$databaseHost = 'localhost';
$databaseUsername = 'php';
$databasePassword = 'password';
$databaseName = 'social_spending';

// Connect to the database
$mysqli = mysqli_connect($databaseHost, $databaseUsername, $databasePassword, $databaseName);

// generate normal errors instead of exceptions
mysqli_report(MYSQLI_REPORT_ALL ^ MYSQLI_REPORT_STRICT);
?>
