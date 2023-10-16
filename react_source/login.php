<?php


function generateToken($length = 20)
{
    return bin2hex(random_bytes($length));
}



// Basic connection settings
$databaseHost 			= 'localhost';
$databaseUsername 	= 'php';
$databasePassword 	= 'password';
$databaseName 		= 'socialspending';

// Connect to the database
$mysqli = mysqli_connect($databaseHost, $databaseUsername, $databasePassword, $databaseName);

// generate normal errors instead of exceptions
mysqli_report(MYSQLI_REPORT_ALL ^ MYSQLI_REPORT_STRICT ^ MYSQLI_REPORT_INDEX);





//Include all stuff above in another file or something





// get data from POST
// TODO: protect against SQL injection
$user 			= $_POST['user'];
$password 	= $_POST['password'];

// lookup user by username or by email
// SQL warns for this but can be mitigated by turning off index warnings or indexing the table which likely wont lead to any performance improvements
$result = $mysqli->query('SELECT * FROM `users` WHERE `username`=\'' . $user . '\' OR `email`=\'' . $user . '\';');


// check that query was successful
if (!$result)
{
    // query failed, internal server error
    print('Unable to contact database');
    http_response_code(500);
    exit(0);
}

// check that user was found
if ($result->num_rows === 1)
{
    $row 				= $result->fetch_assoc();
    $passwordHash 	= $row['pass_hash'];
    $uid 					= $row['uid'];
	
    // check password
    if (password_verify($password, $passwordHash))
    {
		
        // authentication success
        // generate and associate this cookie with UID
		$sessionID 			= generateToken();
		$sessionIDhash 	= hash('sha256', $sessionID);
		
		$result 	= $mysqli->query('INSERT INTO `cookies` (session_id, uid, expiration_date) VALUES (\'' . $sessionIDhash . '\', \'' . $uid . '\', FROM_UNIXTIME(' .  strtotime( '+30 days' ) . '));');
								
		$domain = ($_SERVER['HTTP_HOST'] != 'localhost') ? $_SERVER['HTTP_HOST'] : false;

		//Set cookie on client
		$cookie_options = array(
			'expires' 	=> strtotime( '+30 days' ), // 30 days expiry
			'path' 		=> '/',
			'domain' 	=> $domain, 
			'secure' 	=> false, 
			'httponly' 	=> false, 
			'samesite' 	=> 'Strict' // None || Lax || Strict
			);

		setcookie('session_id', $sessionID, $cookie_options);
								
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