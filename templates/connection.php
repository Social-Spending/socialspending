<?php
// Basic connection settings
$databaseHost = 'localhost';

//Use this code if you have set up environment variables with SetEnv
$databaseUsername = getenv("DB_USER");
$databasePassword = getenv("DB_PASS");
$databaseName = getenv("DB");

// Connect to the database
$mysqli = mysqli_connect($databaseHost, $databaseUsername, $databasePassword, $databaseName);

// generate normal errors instead of exceptions
mysqli_report(MYSQLI_REPORT_ALL ^ MYSQLI_REPORT_STRICT ^ MYSQLI_REPORT_INDEX);
?>
