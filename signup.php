<?php



include_once('templates/connection.php');







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
    
	
		// get max user_id so far
		$result 	= $mysqli->query('SELECT MAX(user_id) as max_user_id FROM users');
		
		if (!$result)
		{
			// query failed, internal server error
			print('Unable to contact database');
			http_response_code(500);
			exit(0);
		}
		
		$row = mysqli_fetch_array($result);
		
        // generate and associate this user_id and password hash
		$user_id = $row["max_user_id"] + 1;
		$passwordHash = password_hash($password,  PASSWORD_BCRYPT);
		
		//insert new user into database
		$result 	= $mysqli->query('INSERT INTO users (user_id, email, username, pass_hash) VALUES (\'' . $user_id . '\', \'' . $email . '\', \'' . $user . '\', \'' . $passwordHash . '\');');
								
							
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