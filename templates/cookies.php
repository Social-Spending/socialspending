<?php

include_once('templates/connection.php');
include_once('templates/constants.php');

// Must do cookie setting before any content is sent
// Return 0 if no error
// Return 1 if error
function createAndSetSessionID($uid)
{
    global $mysqli;

    // create and set a cookie
    $sessionID = rand(0, ((2<<32) -1));
    $sessionIDhash = hash('sha256', $sessionID);

    $expiryDate = time()+$COOKIE_EXPIRY_TIME;
    $formattedExpiryDate = date("Y-m-d H:i:s", $expiryDate);

    // store cookie in database
    $sql = "INSERT INTO cookies (session_id, expiration_date, uid)
                         VALUES (? , ?, ?)";

    $result = $mysqli->execute_query($sql, [$sessionIDhash, $formattedExpiryDate, $uid]);

    // check that query was successful
    if ($result)
    {
        // set cookie on client
        $domain = ($_SERVER['HTTP_HOST'] != 'localhost') ? $_SERVER['HTTP_HOST'] : false;
        setcookie('session_id', $sessionID, $expiryDate, '/', $domain, false);
        // update global var for rest of program
        $_COOKIE['session_id'] = $sessionID;
        return 0;
    }
    // an error occurred
    return 1;
}

// check if the session_ID cookie is valid
// Return 0 if cookie is valid and tied to a user
// Return 1 if cookies is invalid (cookie not set, is expired, or session_id not in database)
// Return 2 if internal server error
const SESSION_ID_VALID      = 0;
const SESSION_ID_INVALID    = 1;
const INTERNAL_SERVER_ERROR = 2;
function validateSessionID()
{
    global $COOKIE_EXPIRY_TIME, $mysqli;

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
            return INTERNAL_SERVER_ERROR;
        }
        // check that result length is non-zero
        if ($result->num_rows == 1)
        {
            // check that cookie is not expired
            $row = $result->fetch_assoc();

            if ($row['expiration_date'] < (time()+$COOKIE_EXPIRY_TIME))
            {
                // cookie has expired
                // delete cookie from database

                $sql = "DELETE FROM cookies WHERE session_id = ?";
                $result = $mysqli->execute_query($sql, [$sessionIDhash]);

                // check that query was successful
                if (!$result)
                {
                    // query failed, internal server error
                    return INTERNAL_SERVER_ERROR;
                }
                // cookie is still expired
                return SESSION_ID_INVALID;
            }

            // cookie not expired
            // check if this cookie is tied to a user
            elseif ($row['uid'] != '')
            {
                return SESSION_ID_VALID;
            }
        }
    }
    return SESSION_ID_INVALID;
}

?>