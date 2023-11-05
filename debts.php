<?php

include_once("templates/connection.php");
include_once("templates/cookies.php");
include_once("templates/constants.php");
include_once("templates/jsonMessage.php");

if ($_SERVER["REQUEST_METHOD"] == "GET") {
	if (isset($_GET["username"])) {
		getDebt($_GET["username"]);
	} else {
		returnMessage("Missing parameter for the other user's username", HTTP_BAD_REQUEST);
	}
}

function getDebt($username) {
	global $mysqli;

	$cur_user_id = intval(validateSessionID());
	if ($cur_user_id == 0) {
        returnMessage("Valid session not found for user", HTTP_UNAUTHORIZED);
	}

	//Find other user's ID
    $sql = "SELECT user_id
            FROM users
            WHERE username=?";

    $result = $mysqli->execute_query($sql, [$username]);
    if ($result->num_rows == 0) {
        returnMessage("User " . $username . " not found", HTTP_BAD_REQUEST);
    }

	$other_user_id = $result->fetch_assoc()["user_id"];

	//Find the debt between the users
	$debt = 0;

	$sql = "SELECT creditor, debtor, amount
			FROM debts
			WHERE (creditor=? AND debtor=?) OR (creditor=? AND debtor=?)";
	
	$result = $mysqli->execute_query($sql, [$cur_user_id, $other_user_id, $other_user_id, $cur_user_id]);
	//If there is no debt between the users, return the two user IDs and an amount of 0
	if ($result->num_rows == 0) {
		$result = ["creditor"=>$cur_user_id, "debtor"=>$other_user_id, "amount"=>0];
	} else {
		$result = $result->fetch_assoc();
	}

	$json_data = json_encode($result);
    header('Content-Type: application/json');
    echo $json_data;
}



/*
Modifies the debt between users by adding $amount to their debt
	Params
		$creditor_id - The unique identifier for the user who paid for others
		$debtor_id - The unique identifer for the user who borrowed money
		$amount - the amount by which 
*/
function addDebt($creditor_id, $debtor_id, $amount) {
	
	global $mysqli;

	/*
	Adds creditor->debtor relationship to table

	If it already exists, it updates the existing amount with
	the amount being added by this new transaction
	*/
	$sql = "INSERT INTO debts
						(creditor, debtor, 	amount)
			VALUES		(?, ?, ?)
			AS inserted
			ON DUPLICATE KEY 
			UPDATE 		amount = amount + inserted.amount";

	$response = $mysqli->execute_query($sql, [$creditor_id, $debtor_id, $amount]);

	return boolval($response);
}

?>
