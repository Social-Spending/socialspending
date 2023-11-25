<?php

/*
    Request Types:
    - POST: Used to upload an image to be the group icon
        - Request:
            - Headers:
                - cookies: session_id=***
                - Content-Type: multipart/form-data
            - body: form data with icon file
                "icon":<ICON_FILE>
        - Response:
            - Status Codes:
                - 200 if image was uploaded successfully
                - 400 if image size or format was invalid
                - 401 if session_id cookie is not present or invalid
                - 500 if the database could not be reached, or file could not be saved
            - Headers:
                - Content-Type: application/json
            - body: serialized JSON in the following format
                {
                    "message":<RESULT>,
                    "icon_path":<PATH TO ICON FILE>
                }
                Where <RESULT> is a message explaining the status code to a user.
                <PATH TO ICON FILE> will be a relative path that is url-encoded in utf-8...
                    Before using the value to assemble a URI, pass the value through the decodeURI function (in javascript)
*/

include_once('templates/constants.php');
include_once('templates/connection.php');
include_once('templates/cookies.php');
include_once('templates/jsonMessage.php');
include_once('templates/saveImage.php');

function handlePOST()
{
    global $mysqli, $_VALIDATE_IMAGE_FAILURE_MESSAGE;

    // user must have valid sessionID
    $userID = validateSessionID();
    if ($userID == 0)
    {
        // failed to validate cookie, check if it was db error or just invalid cookie
        if ($_VALIDATE_COOKIE_ERRORNO == SESSION_ID_INVALID)
        {
            returnMessage('Invalid session_id cookie', 401);
        }
        handleDBError();
    }

    // get data from POST
    if (!isset($_FILES['icon']))
    {
        returnMessage('Missing \'icon\' form field', 400);
    }

    // parse to image and save as gif to filesystem
    $serverFileName = validateAndSaveImage($_FILES['icon'], MAX_ICON_SIZE, USER_ICON_WIDTH, USER_ICON_HEIGHT, USER_ICON_DIR);
    if (!$serverFileName)
    {
        returnMessage($_VALIDATE_IMAGE_FAILURE_MESSAGE, 400);
    }

    //Check to see if the user has an icon
    $sql = "SELECT icon_path
            FROM users u
            WHERE u.user_id = ?";
    $result = $mysqli->execute_query($sql, [$userID]);

    //Delete the existing icon if one exists
    if ($result->num_rows != 0) {
        unlink("." . $result->fetch_assoc()['icon_path']);
    }

    // query to store image path with the group
    $sql =  'UPDATE users u '.
            'SET u.icon_path = ? '.
            'WHERE u.user_id = ?;';

    $result = $mysqli->execute_query($sql, ["/".$serverFileName, $userID]);
    // check for errors
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }
    // check that row was affected
    if ($mysqli->affected_rows == 0)
    {
        // delete file
        unlink($serverFileName);
        returnMessage('Failed to update user profile with icon path', 500);
    }

    // success
    $returnArray = array();
    $returnArray['message'] = 'Success';
    $returnArray['icon_path'] = '/'.$serverFileName;
    header('Content-Type: application/json', true, 200);
    print(json_encode($returnArray));
    exit(0);
}

// handle different request types
if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    handlePOST();
}
returnMessage('Request method not supported', 400);
?>
