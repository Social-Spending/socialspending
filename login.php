<?php
/*
    Request Types:
    - GET:  Can be used to check if user's existing session_id cookie is authenticated,..
            without providing credentials to do authentication
        - Response:
            - Status Codes:
                - 200 if session_id cookie is authenticated
                - 401 if session_id cookie is not set, or is set but not valid
                - 500 if the database could not be reached
            - Content-Type:application/json
            - body: serialized JSON in the following format
                    {
                        'message':<RESULT>
                    }
                    Where <RESULT> is a message explaining the status code to a user
    - POST: Check if a user's existing session_id cookie is authenticated,...
            and if not, use provided form data to attempt authentication.
            If authentication is correct, a 'session_id' cookie is set in the response
        - Request Form Data:
            - 'user': username or email of the credentialed user
            - 'password': password of the credentialed user
        - Response:
            - Status Codes:
                - 200 if authentication is successful
                - 401 if provided credentials are invalid
                - 400 if form data is not present
                - 500 if the database could not be reached
            - Content-Type:application/json
            - body: serialized JSON in the following format
                    {
                        'message':<RESULT>
                    }
                    Where <RESULT> is a message explaining the status code to a user
*/

include_once('templates/connection.php');
include_once('templates/cookies.php');
include_once('templates/jsonMessage.php');

// if the user's current cookie corresponds to an account, log them in
if (validateSessionID())
{
    returnMessage('Success', 200);
}
else
{
    if ($_VALIDATE_COOKIE_ERRORNO == INTERNAL_SERVER_ERROR)
    {
        handleDBError();
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET')
{
    // the cookie was checked in code above
    // GET has no meaning beyond this
    returnMessage('Invalid session_id cookie or cookie not present', 401);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    // user does not have a valid cookie, authenticate with username + password
    // get data from POST
    // TODO: protect against SQL injection
    if (!array_key_exists('user', $_POST) || !array_key_exists('password', $_POST))
    {
        returnMessage('Form fields not found', 400);
    }
    $user = $_POST['user'];
    $password = $_POST['password'];
    // indicate if user wanted to store cookie for future logins, or just this session
    $remember = (array_key_exists('remember', $_POST) && $_POST['remember'] == 'true');


    // lookup user by username or by email
    $sql = "SELECT user_id, pass_hash FROM users     WHERE username = ?
                                    OR  email = ?";

    $result = $mysqli->execute_query($sql, [$user, $user]);
    // check that query was successful
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }

    // check that user was found
    if ($result->num_rows == 1)
    {
        $row = $result->fetch_assoc();
        $passwordHash = $row['pass_hash'];
        $user_id = $row['user_id'];
        // check password
        if (password_verify($password, $passwordHash))
        {
            // authentication success
            // associate this cookie with user_id
            if (createAndSetSessionID($user_id, $remember))
            {
                // an error occurred
                handleDBError();
            }
            // cookie created successfully
            returnMessage('Success', 200);
        }
    }

    // user not found of passwords dont match
    // return status code 401 and print error message
    returnMessage('Invalid username and/or password', 401);
}

returnMessage('Unsupported HTTP Request type', 400);
?>
