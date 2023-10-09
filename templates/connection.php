<?php
// Basic connection settings
$databaseHost = 'localhost';

//Use this code if you have set up environment variables with SetEnv
$databaseUsername = getenv("DB_USER");
$databasePassword = getenv("DB_PASS");
$databaseName = getenv("DB");

//This code will work if you have not set up environment variables,
// but then your database credentials will be stored in plaintext
$databaseUsername = 'php';
$databasePassword = 'password';
$databaseName = 'social_spending';

// Connect to the database
$mysqli = mysqli_connect($databaseHost, $databaseUsername, $databasePassword, $databaseName);

// generate normal errors instead of exceptions
mysqli_report(MYSQLI_REPORT_ALL ^ MYSQLI_REPORT_STRICT);
?>
