<?php

/*
    Request Types:
    - POST: Used to upload an image to be the group icon
        - Request:
            - Headers:
                - cookies: session_id=***
                - Content-Type: multipart/form-data
            - body: form data with text group ID and icon file
                "group_id":<GROUP ID>,
                "icon":<ICON_FILE>
        - Response:
            - Status Codes:
                - 200 if image was uploaded successfully
                - 400 if request body is invalid
                - 401 if session_id cookie is not present or invalid
                - 404 if the specified group doesn't exist or current user is not a member
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

function handlePOST()
{
    global $mysqli;

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
    // TODO: protect against SQL injection
    if (!isset($_POST['group_id']) || !isset($_FILES['icon']))
    {
        returnMessage('Missing form fields', 400);
    }
    $groupID = $_POST['group_id'];
    // get icon file
    $iconFile = $_FILES['icon'];

    // check that file size is smaller than 1 MB
    if ($iconFile['size'] > MAX_ICON_SIZE)
    {
        returnMessage('Cannot upload icons exceeding '.MAX_ICON_SIZE.' bytes', 400);
    }

    // check that file is a valid MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE); // MIME type will be something like image/gif, image/jpeg
    $imageFileType = $finfo->file($iconFile['tmp_name']);
    //$imageFileTypes = explode('/', $imageFileType);

    // parse the file into an image
    $iconImage = null;
    if ($imageFileType == 'image/png')
    {
        $iconImage = imagecreatefrompng($iconFile['tmp_name']);
    }
    elseif ($imageFileType == 'image/jpeg')
    {
        $iconImage = imagecreatefromjpeg($iconFile['tmp_name']);
    }
    elseif ($imageFileType == 'image/gif')
    {
        $iconImage = imagecreatefromgif($iconFile['tmp_name']);
    }
    // iconImage will be null if MIME type was not recognized or false if imagecreatefromX failed
    if ($iconImage == null || !$iconImage)
    {
        returnMessage('Icon is not valid image type. Must be gif, png, or jpeg', 400);
    }

    // check image size
    $width = imagesx($iconImage);
    $height = imagesy($iconImage);
    if ($width != GROUP_ICON_WIDTH || $height != GROUP_ICON_HEIGHT)
    {
        returnMessage('Invalid icon size, must be '.GROUP_ICON_WIDTH.'x'.GROUP_ICON_HEIGHT, 400);
    }

    // generate random name for the file and save
    do
    {
        $imageID = bin2hex(random_bytes(20));
        $serverFileName = GROUP_ICON_DIR.$imageID.'.gif';
    }
    while (file_exists($serverFileName));
    imagegif($iconImage, $serverFileName);
    imagedestroy($iconImage);

    // TODO get and remove old icon file if size becomes an issue

    // query to store image path with the group
    $sql =  'UPDATE groups g '.
            'INNER JOIN group_members gm ON gm.group_id = g.group_id '.
            'SET g.icon_path = ? '.
            'WHERE g.group_id = ? AND gm.user_id = ?;';

    $result = $mysqli->execute_query($sql, ["/".$serverFileName, $groupID, $userID]);
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
        returnMessage('Group not found or user is not a member', 404);
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
