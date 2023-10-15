<?php
include_once('templates/connection.php');
include_once('templates/constants.php');

// check that a cookie was included
if (!array_key_exists('session_id', $_COOKIE))
{
    // user did not include their session_id
    print('session_id cookie is required');
    http_response_code(403);
    exit(0);
}

// get cookie
$sessionID = $_COOKIE['session_id'];
$sessionIDhash = hash('sha256', $sessionID);

// check that cookie is actually present in database
// lookup cookie
$result = $mysqli->query('SELECT * FROM `cookies` WHERE `session_id`=\'' . $sessionIDhash . '\';');
// check that query was successful
if (!$result)
{
    // query failed, internal server error
    print('Unable to contact database');
    http_response_code(500);
    exit(0);
}
// check that result length is non-zero
if ($result->num_rows != 1)
{
    print('Invalid session_id cookie');
    http_response_code(403);
    exit(0);
}
// check that cookie is not expired
$row = $result->fetch_assoc();
if ($row['expiration_date'] < (time()+$COOKIE_EXPIRY_TIME))
{
    print('session_id cookie has expired');
    http_response_code(403);
    exit(0);
}

// get data from POST
// TODO: protect against SQL injection
$user = $_POST['user'];
$password = $_POST['password'];

// lookup user by username or by email
$sql = "SELECT * FROM users     WHERE username = ? 
                                OR  email = ?";

$result = $mysqli->execute_query($sql, [$user, $user]);
// check that query was successful
if (!$result)
{
    // query failed, internal server error
    print('Unable to contact database');
    http_response_code(500);
    exit(0);
}

// check that user was found
if ($result->num_rows == 1)
{
    $row = $result->fetch_assoc();
    $passwordHash = $row['pass_hash'];
    $uid = $row['uid'];
    // check password
    if (password_verify($password, $passwordHash))
    {
        // authentication success
        // associate this cookie with UID
        $sql = "UPDATE cookies SET uid = ? WHERE session_id = ?";

        $result = $mysqli->execute_query($sql, [$uid, $session_id]);
        // check status of query
        if (!$result)
        {
            // query failed, internal server error
            print('Unable to contact database');
            http_response_code(500);
            exit(0);
        }
        // return okay status code
        http_response_code(200);
        exit(0);
    }
    else
    {
        // passwords do not match
        print('Invalid username and/or password');
    }
}
else
{
    // user not found
    print('Invalid username and/or password');
}

// authentication failed, return status code 403 and print error message
http_response_code(403);
exit(0);
?>