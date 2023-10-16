<?php
include_once('templates/connection.php');
include_once('templates/cookies.php');
include_once('templates/redirect.php');

// if the user's current cookie corresponds to an account, log them in
$rv = validateSessionID();
if ($rv == INTERNAL_SERVER_ERROR)
{
    print('Unable to contact database');
    http_response_code(500);
    exit(0);
}
if ($rv == SESSION_ID_VALID)
{
    redirect('/summary');
}

// user does not have a valid cookie, authenticate with username + password
// get data from POST
// TODO: protect against SQL injection
$user = $_POST['user'];
$password = $_POST['password'];
// lookup user by username or by email
$sql = "SELECT uid, pass_hash FROM users     WHERE username = ?
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
        if (createAndSetSessionID($uid))
        {
            // an error occurred
            print('Unable to contact database');
            http_response_code(500);
            exit(0);
        }
        // cookie created successfully
        // redirect to homepage
        redirect('/summary');
    }
}

// user not found of passwords dont match
// return status code 403 and print error message
print('Invalid username and/or password');
http_response_code(403);
exit(0);
?>
