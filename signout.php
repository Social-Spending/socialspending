<?php
include_once('templates/connection.php');
include_once('templates/jsonMessage.php');

// get user's sessionID from cookie
if (array_key_exists('session_id', $_COOKIE))
{
    // get cookie
    $sessionID = $_COOKIE['session_id'];
    // remove cookie from database
    // output of sha256 will be 64-char string
    $sessionIDhash = hash('sha256', $sessionID);

    $sql = 'DELETE FROM cookies WHERE session_id = ?';
    $result = $mysqli->execute_query($sql, [$sessionIDhash]);

    // check that query was successful
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }

    // also un-set cookie on client by setting the cookie with expiration date 1 day in the past
    $expiryDate = time() - 60*60*24;
    $domain = ($_SERVER['HTTP_HOST'] != 'localhost') ? $_SERVER['HTTP_HOST'] : false;
    $cookie_options = array(
        'expires'   => $expiryDate,
        'path' 		=> '/',
        'domain' 	=> $domain,
        'secure' 	=> false,
        'httponly' 	=> false,
        'samesite' 	=> 'Strict' // None || Lax || Strict
        );

    setcookie('session_id', $sessionID, $cookie_options);
}

// delete was successful or user did not have a session_id
returnMessage('Success', 200);
?>
