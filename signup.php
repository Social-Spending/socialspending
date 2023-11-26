<?php
/*
    Request Types:
    - POST: Create a new user, if the username and email were not already found
        - Request Form Data:
            - 'user': username of the new user
            - 'email': email of the new user
            - 'password': password of the new user
        - Response:
            - Status Codes:
                - 200 if user was created successfully
                - 403 if user is already logged in
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
include_once('templates/userValidation.php');

// if the user's current cookie corresponds to an account
if (validateSessionID())
{
    returnMessage('User Already Logged in', 403);
}
elseif ($_VALIDATE_COOKIE_ERRORNO == INTERNAL_SERVER_ERROR)
{
    // failed to contact database
    handleDBError();
}

// request must be POST
if ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    // check that POST has form data
    if (!array_key_exists('user', $_POST) ||
        !array_key_exists('email', $_POST) ||
        !array_key_exists('password', $_POST))
    {
        returnMessage('Form fields not found', 400);
    }

    // get data from POST
    // TODO: protect against SQL injection
    $user 			= $_POST['user'];
    $email 			= $_POST['email'];
    $password 	= $_POST['password'];

    // check that user params are valid
    if (checkUsername($user))
    {
        returnMessage('Username is invalid', 400);
    }
    if (checkEmail($email))
    {
        returnMessage('Email is invalid', 400);
    }
    if (checkPassword($password))
    {
        returnMessage('Password is invalid', 400);
    }

    // lookup user by username or by email to check if one already exists
    // SQL warns for this but can be mitigated by turning off index warnings or indexing the table which likely wont lead to any performance improvements
    $query = 'SELECT * FROM `users` WHERE `username`= ? OR `email`= ?;';
    $result = $mysqli->execute_query($query, [$user, $email]);
    // check that query was successful
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }

    // check that user was NOT found
    if ($result->num_rows === 0)
    {
        // generate password hash
        $passwordHash = password_hash($password,  PASSWORD_BCRYPT);

        // insert new user into database
        // database should auto-increment user_id
        $query = 'INSERT INTO users (email, username, pass_hash) VALUES (?, ?, ?);';
        $result = $mysqli->execute_query($query, [$email, $user, $passwordHash]);

        // check status of query
        if (!$result)
        {
            // query failed, internal server error
            handleDBError();
        }

        // get the user_id of the new user
        $query = 'SELECT user_id FROM users WHERE users.username = ?;';
        $result = $mysqli->execute_query($query, [$user]);

        // check status of query
        if (!$result)
        {
            // query failed, internal server error
            handleDBError();
        }

        // authenticate user session_id cookie now
        $row = $result->fetch_assoc();
        $uid = $row['user_id'];
        createAndSetSessionID($uid, false);
        // return okay status code
        returnMessage('Success', 200);
    }

    // username or email already exists
    returnMessage('Username and/or email already exist', 400);
}

returnMessage('Unsupported HTTP Request type', 400);

?>