<?php

include_once('templates/connection.php');
include_once('templates/constants.php');

// Must do cookie setting before any content is sent
// Return 0 if no error
// Return 1 if error
function createAndSetSessionID($user_id)
{
    global $mysqli;

    // create and set a cookie
    $sessionID = rand(0, ((2<<32) -1));
    $sessionIDhash = hash('sha256', $sessionID);

    $expiryDate = time() + COOKIE_EXPIRY_TIME;
    $formattedExpiryDate = date("Y-m-d H:i:s", $expiryDate);

    // store cookie in database
    $sql = "INSERT INTO cookies (session_id, expiration_date, user_id)
                         VALUES (? , ?, ?)";

    $result = $mysqli->execute_query($sql, [$sessionIDhash, $formattedExpiryDate, $user_id]);

    // check that query was successful
    if ($result)
    {
        // set cookie on client
        $domain = ($_SERVER['HTTP_HOST'] != 'localhost') ? $_SERVER['HTTP_HOST'] : false;
		$cookie_options = array(
			'expires' 	=> $expiryDate,
			'path' 		=> '/',
			'domain' 	=> $domain,
			'secure' 	=> false,
			'httponly' 	=> false,
			'samesite' 	=> 'Strict' // None || Lax || Strict
			);

		setcookie('session_id', $sessionID, $cookie_options);
        // update global var for rest of program
        $_COOKIE['session_id'] = $sessionID;
        return 0;
    }
    // an error occurred
    return 1;
}

// global var containing information about errors encountered in validateSessionID
$_VALIDATE_COOKIE_ERRORNO = 0;
// _VALIDATE_COOKIE_ERRORNO may take on the following values:
const SESSION_ID_INVALID    = 1; // session_id cookie was not set, is expired, or is not in database
const INTERNAL_SERVER_ERROR = 2; // database error


// check if the session_ID cookie is valid
// Returns the user ID corresponding to the provided session_id cookie
// If there is an error, return 0 and set $_VALIDATE_COOKIE_ERRORNO
function validateSessionID()
{
    global $_VALIDATE_COOKIE_ERRORNO, $mysqli;

    // session id cookie must be set in request
    if (array_key_exists('session_id', $_COOKIE))
    {
        // get cookie
        $sessionID = $_COOKIE['session_id'];
        // lookup cookie in database
        // output of sha256 will be 64-char string
        $sessionIDhash = hash('sha256', $sessionID);

        $sql = "SELECT * FROM cookies WHERE session_id = ?";
        $result = $mysqli->execute_query($sql, [$sessionIDhash]);

        // check that query was successful
        if (!$result)
        {
            // query failed, internal server error
            $_VALIDATE_COOKIE_ERRORNO = INTERNAL_SERVER_ERROR;
            return 0;
        }
        // check that result length is non-zero
        if ($result->num_rows == 1)
        {
            // check that cookie is not expired
            $row = $result->fetch_assoc();

            if ($row['expiration_date'] < (time()+COOKIE_EXPIRY_TIME))
            {
                // cookie has expired
                // delete cookie from database

                $sql = "DELETE FROM cookies WHERE session_id = ?";
                $result = $mysqli->execute_query($sql, [$sessionIDhash]);

                // check that query was successful
                if (!$result)
                {
                    // query failed, internal server error
                    $_VALIDATE_COOKIE_ERRORNO = INTERNAL_SERVER_ERROR;
                    return 0;
                }
                // cookie is still expired
                $_VALIDATE_COOKIE_ERRORNO = SESSION_ID_INVALID;
                return 0;
            }

            // cookie not expired
            // check if this cookie is tied to a user
            elseif ($row['user_id'] != '')
            {
                return $row['user_id'];
            }
        }
    }
    $_VALIDATE_COOKIE_ERRORNO = SESSION_ID_INVALID;
    return 0;
}

?>