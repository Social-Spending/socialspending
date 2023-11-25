<?php

include_once("templates/connection.php");
include_once("templates/cookies.php");
include_once("templates/constants.php");
include_once("templates/jsonMessage.php");

/*
    Requests
        GET - Gets viable candidates for which users may settle up
            JSON Object
                [
                    {
                        'user_id': 1,
                        'username': 'Roasted715Jr',
                        'amount': 2500,
                        'efficiency_rating': 5
                    },
                    {...}
                ]
*/

if ($_SERVER["REQUEST_METHOD"] == "GET") {
	if (isset($_GET["user_id"])) {
		getSettleUpCandidates($_GET["user_id"]);
	} else {
		returnMessage("Missing parameter for the other user's user_id", HTTP_BAD_REQUEST);
	}
}

function getSettleUpCandidates($target_user_id) {

	$curr_user_id = intval(validateSessionID());
	if ($curr_user_id == 0) {
        returnMessage("Valid session not found for user", HTTP_UNAUTHORIZED);
	}

	//Find the debt between the users

	$candidates = findSettleUpCandidates($curr_user_id, $target_user_id);

    $return = [];
    $num_candidates = 0;

	while($candidate = $candidates->fetch_assoc())
    {
        $return[$num_candidates] = array    (
                                                'user_id' => $candidate['user_id'],
                                                'username' => $candidate['username'],
                                                'amount' => $candidate['amount'],
                                                'efficiency_rating' => 5 //Set all candidates to highest efficiency rating for now
                                            );
        $num_candidates += 1;
    }

	$json_data = json_encode($return);
    header('Content-Type: application/json');
    echo $json_data;
}

/*
Currently, only finds the exact user that we are trying to settle up with
*/
function findSettleUpCandidates($paying_user_id, $target_user_id)
{
    global $mysqli;

    /*
    TODO: This should call to the eventual algorithm for 'paying your creditor's creditor'
    */
    $sql = "SELECT debts.creditor as user_id,  users.username, debts.amount 
			FROM debts
            INNER JOIN users on users.user_id = debts.creditor
			WHERE (creditor=? AND debtor=?)";
	
	$result = $mysqli->execute_query($sql, [$target_user_id, $paying_user_id]);
    return $result;
}
?>
