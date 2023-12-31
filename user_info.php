<?php
/*
    Request Types:
    - GET:  Get information about the currently signed in user
        - Request:
            - Headers:
                - cookies: session_id=***
        - Response:
            - Status Codes:
                - 200 if current user's information was fetched correctly
                - 400 if request type was not GET
                - 401 if session_id cookie is not present or invalid
                - 500 if the database could not be reached
            - Content-Type:application/json
            - body: serialized JSON in the following format
                {
                    "message":<RESULT>,
                    "user_id":<USER ID>,
                    "username":<USERNAME>,
                    "icon_path":<PATH TO ICON FILE>
                }
                <RESULT> is a message explaining the status code to a user.
                <PATH TO ICON FILE> will be a relative path that is url-encoded in utf-8...
                    Before using the value to assemble a URI, pass the value through the decodeURI function (in javascript)
*/

include_once('templates/connection.php');
include_once('templates/jsonMessage.php');
include_once('templates/userValidation.php');

function handleGET()
{
    global $mysqli;

    // get user's sessionID from cookie
    if (isset($_GET['access_key']))
    {
        $user_id = checkAccessCode($_GET['access_code']);

        $sql =  'SELECT u.user_id, u.username, u.icon_path '.
                'FROM users u'.
                'WHERE u.user_id = ?';
        $result = $mysqli->execute_query($sql, [$user_id]);
        // check that query was successful
        if (!$result)
        {
            // query failed, internal server error
            handleDBError();
        }

        $row = $result->fetch_assoc();

        // if access code was valid
        if ($row)
        {
            $returnArray = array();
            $returnArray['user_id'] = $row['user_id'];
            $returnArray['username'] = $row['username'];
            $returnArray['icon_path'] = $row['icon_path'];
            $returnArray['message'] = 'Success';

            // return the returnArray as JSON
            header('Content-Type: application/json');
            http_response_code(200);
            print(json_encode($returnArray));
            exit(0);
        }
        
        returnMessage('Invalid access_code', 401);
    }


    if (array_key_exists('session_id', $_COOKIE))
    {
        // get cookie
        $sessionID = $_COOKIE['session_id'];
        // remove cookie from database
        // output of sha256 will be 64-char string
        $sessionIDhash = hash('sha256', $sessionID);

        // sql request to get user_id and username from cookie.session_id
        $sql =  'SELECT u.user_id, u.username, u.icon_path, c.expiration_date '.
                'FROM cookies c '.
                'JOIN users u ON u.user_id = c.user_id '.
                'WHERE c.session_id = ?';
        $result = $mysqli->execute_query($sql, [$sessionIDhash]);

        // check that query was successful
        if (!$result)
        {
            // query failed, internal server error
            handleDBError();
        }

        $row = $result->fetch_assoc();

        // check that a user was actually fetched
        if ($row)
        {
            // check that cookie is not expired
            if ($row['expiration_date'] < time())
            {
                // cookie has expired
                // delete cookie from database
                $sql = 'DELETE FROM cookies WHERE session_id = ?';
                $result = $mysqli->execute_query($sql, [$sessionIDhash]);

                // check that query was successful
                if (!$result)
                {
                    handleDBError();
                }
            }
            else
            {
                // database has associated this cookie with a user and cookie is unexpired
                // user 'user_id', 'username', and 'icon_path' keys in the result's associative array
                $returnArray = array();
                $returnArray['user_id'] = $row['user_id'];
                $returnArray['username'] = $row['username'];
                $returnArray['icon_path'] = $row['icon_path'];
                $returnArray['message'] = 'Success';

                // return the returnArray as JSON
                header('Content-Type: application/json');
                http_response_code(200);
                print(json_encode($returnArray));
                exit(0);
            }
        }

        // did not get any users from database
        // this is likely because the session_id was expired or not in the database
        returnMessage('Invalid session_id cookie', 401);
    }

    // user did not have a session_id
    returnMessage('Request did not include session_id cookie', 401);
}

// request type must be GET
if ($_SERVER['REQUEST_METHOD'] == 'GET')
{
    handleGET();
}
returnMessage('Invalid request type', 400);

?>
