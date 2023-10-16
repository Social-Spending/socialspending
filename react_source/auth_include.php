<?php


// Basic connection settings
$databaseHost 			= 'localhost';
$databaseUsername 	= 'php';
$databasePassword 	= 'password';
$databaseName 		= 'socialspending';

// Connect to the database
$mysqli = mysqli_connect($databaseHost, $databaseUsername, $databasePassword, $databaseName);

// generate normal errors instead of exceptions
mysqli_report(MYSQLI_REPORT_ALL ^ MYSQLI_REPORT_STRICT);


if (!array_key_exists('session_id', $_COOKIE))
{
    // user did not have a session_id
    print('session_id cookie is required');
    http_response_code(302);
	header('Location: /login.html');
    exit(0);
}

$sessionID 			= $_COOKIE['session_id'];
$sessionIDHash 	= hash('sha256', $sessionID);

$result = $mysqli->query("SELECT * FROM `cookies` WHERE session_id='$sessionIDHash';");

// session id is invalid 

if(!$result){
	print('Database Unreachable');
    http_response_code(500);
    exit(0);
}


if($result->num_rows === 0){
	print('session_id cookie is expired/doesn\'t exist');
    http_response_code(302);
	header('Location: /login.html');
    exit(0);
}

        ?>