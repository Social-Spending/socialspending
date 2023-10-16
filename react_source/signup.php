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
$email 			= $_POST['email'];
$password 	= $_POST['password'];

// lookup user by username or by email to check if one already exists
// SQL warns for this but can be mitigated by turning off index warnings or indexing the table which likely wont lead to any performance improvements
$result = $mysqli->query('SELECT * FROM `users` WHERE `username`=\'' . $user . '\' OR `email`=\'' . $email . '\';');
// check that query was successful
if (!$result)
{
    // query failed, internal server error
    print('Unable to contact database');
    http_response_code(500);
    exit(0);
}

// check that user was found
if ($result->num_rows === 0)
{
    
	
		// get max uid so far
		$result 	= $mysqli->query('SELECT MAX(uid) as max_uid FROM users');
		
		if (!$result)
		{
			// query failed, internal server error
			print('Unable to contact database');
			http_response_code(500);
			exit(0);
		}
		
		$row = mysqli_fetch_array($result);
		
        // generate and associate this UID and password hash
		$uid = $row["max_uid"] + 1;
		$passwordHash = password_hash($password,  PASSWORD_BCRYPT);
		
		//insert new user into database
		$result 	= $mysqli->query('INSERT INTO users (uid, email, username, salt, pass_hash) VALUES (\'' . $uid . '\', \'' . $email . '\', \'' . $user . '\', \'0\', \'' . $passwordHash . '\');');
								
							
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
    // user not found
    print('User already exists');
}

// authentication failed, return status code 403 and print error message
http_response_code(403);
exit(0);
?>