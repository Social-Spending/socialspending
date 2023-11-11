<?php

/*
    Request Types:
    - POST: Used to upload an image to be the transaction receipt
        - Request:
            - Headers:
                - cookies: session_id=***
                - Content-Type: multipart/form-data
            - body: form data with text transaction ID and receipt file
                "transaction_id":<TRANSACTION_ID>,
                "receipt":<RECEIPT_FILE>
        - Response:
            - Status Codes:
                - 200 if image was uploaded successfully
                - 400 if request body is invalid, or the image size or format was invalid
                - 401 if session_id cookie is not present or invalid
                - 404 if the specified transaction doesn't exist or current user is not a part of it
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
    if (!isset($_POST['transaction_id']) || !isset($_FILES['icon']))
    {
        returnMessage('Missing form fields', 400);
    }
    $transactionID = $_POST['transaction_id'];

    // parse to image and save as gif to filesystem
    $serverFileName = validateAndSaveImage($_FILES['icon'], int->max, 0, 0, TRANSACTION_RECEIPT_DIR);
    if (!$serverFileName)
    {
        returnMessage($_VALIDATE_IMAGE_FAILURE_MESSAGE, 400);
    }

    // TODO get and remove old icon file if size becomes an issue

    // query to store image path with the transaction
    $sql =  'UPDATE transactions t '.
            'INNER JOIN transaction_members tm ON tm.transaction_id = t.transaction_id '.
            'SET g.receipt_path = ? '.
            'WHERE t.transaction_id = ? AND tm.user_id = ?;';

    $result = $mysqli->execute_query($sql, ["/".$serverFileName, $transactionID, $userID]);
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
        returnMessage('Transaction not found or user is not a part of it', 404);
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
