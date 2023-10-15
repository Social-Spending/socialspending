<?php
include_once('templates/connection.php');
include_once('templates/constants.php');

// Must do cookie setting here, before any content is sent
function createAndSetCookie()
{
    
    global $COOKIE_EXPIRY_TIME, $mysqli;

    // create and set a cookie
    $sessionID = rand(0, ((2<<32) -1));
    $sessionIDhash = hash('sha256', $sessionID);

    $domain = ($_SERVER['HTTP_HOST'] != 'localhost') ? $_SERVER['HTTP_HOST'] : false;
    $expiryDate = time()+$COOKIE_EXPIRY_TIME;
    setcookie('session_id', $sessionID, $expiryDate, '/', $domain, false);

    $expiryDate = date("Y-m-d H:i:s", $expiryDate);

    // store cookie in database
    $sql = "INSERT INTO cookies (session_id, expiration_date)
                         VALUES (? , ?)";

    $result = $mysqli->execute_query($sql, [$sessionIDhash, $expiryDate]);


    // check that query was successful
    if (!$result)
    {
        // query failed, internal server error
        print('Unable to contact database');
        http_response_code(500);
        exit(1);
    }
}

function redirect($target)
{
    if (!empty($_SERVER['HTTPS']) && ('on' == $_SERVER['HTTPS'])) {
		$uri = 'https://';
	} else {
		$uri = 'http://';
	}
	$uri .= $_SERVER['HTTP_HOST'];
	header('Location: ' . $uri . $target);
	exit(0);
}

// if the user's current cookie corresponds to an account, log them in
if (!array_key_exists('session_id', $_COOKIE))
{
    createAndSetCookie();

}
else
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
        print('Unable to contact database');
        http_response_code(500);
        exit(0);
    }
    // check that result length is non-zero
    if ($result->num_rows == 1)
    {
        // check that cookie is not expired
        $row = $result->fetch_assoc();

        if ($row['expiration_date'] < (time()+$COOKIE_EXPIRY_TIME))
        {
            // cookie has expired, delete and re-issue cookie
            // delete cookie from database

            $sql = "DELETE FROM cookies WHERE session_id = ?";
            $result = $mysqli->execute_query($sql, [$sessionIDhash]);

            // check that query was successful
            if (!$result)
            {
                // query failed, internal server error
                print('Unable to contact database');
                http_response_code(500);
                exit(0);
            }

            // re-issue cookie
            createAndSetCookie();
        }
        // check if this cookie is already tied to a user
        elseif ($row['uid'] != '') // TODO
        {
            // redirect
            redirect('/summary.php');
        }
    }
    else
    {
        // cookie is not in database, re-issue cookie
        createAndSetCookie();
    }
}
?>

<!DOCTYPE html>
<html>
    <head>
        <script src="unauthenticated_header.js"></script>
        <script src="login.js"></script>
        <link rel="stylesheet" href="global.css"/>
        <link rel="stylesheet" href="header.css"/>
        <link rel="stylesheet" href="login.css"/>
    </head>

    <body>
        <?php readfile('templates/unauthenticated_header.html'); ?>
        <div class="container">
            <div class="warning">
                Password are transmitted over unsecure HTTP! Proceed with caution.
            </div>
            <div id="loginForm">
                <text class="warning hidden" id="loginForm_errorMessage">Invalid username and/or password</text>
                <div class="block loginFormField">
                    <label for="loginForm_user">Username or email:</label>
                    <br>
                    <input type="text" id="loginForm_user">
                </div>
                <div class="block loginFormField">
                    <label for="loginForm_password">Password:</label>
                    <br>
                    <input type="text" id="loginForm_password">
                </div>
                <div class="block loginFormField">
                    <input type="button" id="loginForm_submit" value="Log in">
                </div>
            </div>
            <div>
                <div class="fontfamily" id="signupMessage">Need an account? <a href="/signup.php">Sign Up</a></div>
            </div>
        </div>
    </body>
</html>