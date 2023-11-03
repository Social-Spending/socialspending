<?php
// Basic connection settings
$databaseHost = 'localhost';

//Use this code if you have set up environment variables with SetEnv
$databaseUsername = getenv("DB_USER");
$databasePassword = getenv("DB_PASS");
$databaseName = getenv("DB");

// choose if this file is in the dev or prod endpoint
// split the servername into an array of tokens separated by .
$servernameArray = explode('.', $_SERVER['SERVER_NAME']);
if ($servernameArray[0] == 'dev')
{
    $databaseName = $databaseName.'_dev';
}

// Connect to the database
$mysqli = mysqli_connect($databaseHost, $databaseUsername, $databasePassword, $databaseName);

// generate normal errors instead of exceptions
mysqli_report(MYSQLI_REPORT_ALL ^ MYSQLI_REPORT_STRICT ^ MYSQLI_REPORT_INDEX);
?>
