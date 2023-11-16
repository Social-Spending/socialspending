<?php
/*
    Request Types:
    - POST: Search for a user based on a partial username or email
        - Request:
            - Headers:
                - Content-Type: application/json
                - cookies: session_id=***
            - Body:
                {
                    "search_term":<PARTIAL USERNAME OR EMAIL>
                }
        - Response:
            - Status Codes:
                - 200 if database was correctly searched for matching users
                - 400 if request type was not POST, or body JSON was malformed
                - 401 if session_id cookie is not present or invalid
                - 500 if the database could not be reached
            - Headers:
                - Content-Type:application/json
            - Body: serialized JSON in the following format
                {
                    "message":<RESULT>,
                    "users":
                    [
                        {
                            "user_id":<USER ID>,
                            "username":<USERNAME>,
                            "icon_path":<PATH TO ICON FILE>
                        }
                    ]
                }
                <RESULT> is a message explaining the status code to a user.
                <PATH TO ICON FILE> will be a relative path that is url-encoded in utf-8...
                    Before using the value to assemble a URI, pass the value through the decodeURI function (in javascript)
*/

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

    // parse JSON in body
    $body = file_get_contents('php://input');
    $bodyJSON = json_decode($body, true);
    if ($bodyJSON === null)
    {
        returnMessage('Request body has malformed JSON', 400);
    }

    // get search term from request
    if ($bodyJSON['search_term'] === null)
    {
        returnMessage('Missing search_term from request JSON', 400);
    }

    $searchTerm = $bodyJSON['search_term'];

    // query database for user search
    $sql =  'SELECT user_id, username, icon_path '.
            'FROM users '.
            'WHERE MATCH(username, email) '.
            'AGAINST (? IN BOOLEAN MODE) '.
            'LIMIT 10;';
    $result = $mysqli->execute_query($sql, [$searchTerm.'*']);

    // check that query was successful
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }

    // get results
    $usersArray = array();
    while($row = $result->fetch_assoc())
    {
        $usersArray[] = $row;
    }

    // return the returnArray as JSON
    $returnArray = array();
    $returnArray['message'] = 'Success';
    $returnArray['users'] = $usersArray;
    header('Content-Type: application/json');
    http_response_code(200);
    print(json_encode($returnArray));
    exit(0);
}


// request type must be POST
if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    handlePOST();
}
returnMessage('Invalid request type', 400);

?>
