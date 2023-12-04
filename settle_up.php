<?php

include_once("templates/connection.php");
include_once("templates/cookies.php");
include_once("templates/constants.php");
include_once("templates/jsonMessage.php");
include_once("templates/settleUpOptions.php");
include_once("templates/debtHelpers.php");
include_once('templates/notificationHelpers.php');

/*
    GET - Gets viable candidates for how to settle up with the given user
        - Request:
            - Headers:
                - cookies: session_id=***
            - URL Parameters:
                - user_id=<USER_ID>
                Where USER_ID is that of user for whom we are getting options to settle up with
        - Response:
            - Status Codes:
                - 200 if options were successfully retrieved, even if the current user does not owe the given user
                - 400 if url parameters are invalid or missing
                - 401 if session_id cookie is not present or invalid
                - 500 if the database could not be reached
            - Headers:
                - Content-Type: application/json
            - Body:
                [
                    {
                        "amount" => <integer amount to settle up>,
                        "length" => <integer number of users in the chain>,
                        "chain" => <ordered numerical array of objects of the form...
                                    {"user_id" => <integer>, "username" => <string>} in the settle up chain>
                    },
                    {...}
                ]
                An example body may be found in templates/settleUpOptions.php
    POST - Do settling up
        - Request:
            - Headers:
                - cookies: session_id=***
                - Content-Type: application/json
            - Body: serialized JSON describing the settle-up chain
                {
                    "amount" => <integer amount to settle up>,
                    "length" => <integer number of users in the chain>,
                    "chain" => <ordered numerical array of objects of the form...
                                {"user_id" => <integer>} in the settle up chain>
                }
                This request body is similar to one of the objects in the list that is the response for a GET request
        - Response:
            - Status Codes:
                - 200 if settle up chain was successfully implemented
                - 400 if body is malformed or missing data
                - 401 if session_id cookie is not present or invalid
                - 500 if the database could not be reached
            - Headers:
                - Content-Type: application/json
            - Body:
                {
                    "message":<RESULT>
                }
                Where <RESULT> is a message explaining the status code to a user
*/

function getSettleUpCandidates($target_user_id)
{

	$curr_user_id = intval(validateSessionID());
	if ($curr_user_id == 0)
    {
        returnMessage("Valid session not found for user", HTTP_UNAUTHORIZED);
	}
    if ($curr_user_id == $target_user_id)
    {
        returnMessage("Cannot settle up with self", HTTP_BAD_REQUEST);
    }

	//Find the debt between the users
    $return = findDebtChains($curr_user_id, $target_user_id);

    header('Content-Type: application/json');
    http_response_code(HTTP_OK);
    print(json_encode($return));
    exit(0);
}

// return true if a balance exists between the creditor and debtor with an amount that is >= minAmount
// return false otherwise
function verifyBalance($creditorID, $debtorID, $minAmount)
{
    global $mysqli;

    // query db to get actual balance
    $sql = "SELECT SUM(balances.amount) as balance
            FROM
            (
                SELECT d.amount as amount
                FROM debts d
                WHERE d.creditor = ? AND d.debtor = ?
                UNION
                SELECT -1*d.amount as amount
                FROM debts d
                WHERE d.debtor = ? AND d.creditor = ?

            ) AS balances";
    $result = $mysqli->execute_query($sql, [$creditorID, $debtorID, $creditorID, $debtorID]);
    // check for errors
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }
    // attempt to get first row
    $row = $result->fetch_assoc();
    // check if there actually was a result
    if (!$row)
    {
        return false;
    }

    // now compare the actual balance to the desired balance
    return $row['balance'] >= $minAmount;
}

function addParticipant($transactionID, $userID, $paid, $borrowed)
{
    global $mysqli;
    $sql = "INSERT INTO transaction_participants (transaction_id, user_id, has_approved, amount)
            VALUES  (?, ?, 1, ?)";

    $response = $mysqli->execute_query($sql, [  $transactionID,
                                                $userID,
                                                $borrowed - $paid
                                            ]);

    // check that query was successful
    if (!$response) {
        handleDBError();
    }
}

function handlePOST($bodyJSON)
{
    global $mysqli;

    // authenticate user using cookie
	$currUserID = intval(validateSessionID());
	if ($currUserID == 0)
    {
        returnMessage("Valid session not found for user", HTTP_UNAUTHORIZED);
	}

    // get amount
    if (!array_key_exists('amount', $bodyJSON))
    {
        returnMessage('Missing \'amount\'', HTTP_BAD_REQUEST);
    }
    $amount = $bodyJSON['amount'];

    // check that the list of participants is valid
    if (!array_key_exists('chain', $bodyJSON))
    {
        returnMessage('Missing \'chain\'', HTTP_BAD_REQUEST);
    }
    $chain = $bodyJSON['chain'];

    // first check that length is proper
    if (!array_key_exists('length', $bodyJSON))
    {
        returnMessage('Missing \'length\'', HTTP_BAD_REQUEST);
    }
    if ($bodyJSON['length'] != count($chain))
    {
        returnMessage('\'length\' does not match the actual length of the chain', HTTP_BAD_REQUEST);
    }

    // for each user in the chain, verify that a balance does exists that is >= the given amount
    $debtorID = $currUserID;
    foreach ($chain as $user)
    {
        if (!array_key_exists('user_id', $user))
        {
            returnMessage('Missing \'user_id\'', HTTP_BAD_REQUEST);
        }
        $creditorID = intval($user['user_id']);

        // check that balance exists and as a balance >= the given amount
        if (!verifyBalance($creditorID, $debtorID, $amount))
        {
            returnMessage('Amount is greater than the debt from user id '.$debtorID.' to user id '.$creditorID, HTTP_BAD_REQUEST);
        }

        // this creditor becomes the debtor in the next link
        $debtorID = $creditorID;
    }

    // update all the balances now
    $debtorID = $currUserID;
    foreach ($chain as $user)
    {
        $creditorID = intval($user['user_id']);

        // when settling up, flip the debtor and creditor to reduce the balance
        if (!addDebt($debtorID, $creditorID, $amount))
        {
            handleDBError();
        }

        // this creditor becomes the debtor in the next link
        $debtorID = $creditorID;
    }

    // store settling up as a completed transaction
    $targetUserID = intval($chain[0]['user_id']);
    $transactionDate = date("Y-m-d", time());
    $sql = "INSERT INTO transactions (name, date, amount, description)
            SELECT CONCAT(debtor.username, ' Settle Up With ', creditor.username), ?, ?, ''
            FROM users debtor
            INNER JOIN users creditor ON creditor.user_id = ?
            WHERE debtor.user_id = ?;";

    $response = $mysqli->execute_query($sql,    [   $transactionDate,
                                                    $amount,
                                                    $targetUserID,
                                                    $currUserID
                                                ]);

    // check that query was successful
    if (!$response) {
        handleDBError();
    }

    // Get AUTO_INCREMENT ID for most recent insertion
    $transactionID = $mysqli->insert_id;

    // add all users as participants, pre-approved
    // start with the debtor (the current user)
    addParticipant($transactionID, $currUserID, $amount, 0);
    // next, the person with whom they are settling up
    addParticipant($transactionID, $targetUserID, 0, $amount);
    // finally, all the other people
    for ($index = 1; $index < count($chain); $index += 1)
    {
        addParticipant($transactionID, intval($chain[$index]['user_id']), $amount, $amount);
    }

    // add a "completed transaction" notification to each participant's inbox
    createCompleteTransactionNotifications($transactionID);

    // if we got here, all is good
    returnMessage('Success', HTTP_OK);
}

// MAIN ENTRY POINT
if ($_SERVER["REQUEST_METHOD"] == "GET")
{
	if (isset($_GET["user_id"]))
    {
		getSettleUpCandidates(intval($_GET["user_id"]));
	}
    else
    {
		returnMessage("Missing parameter for the other user's user_id", HTTP_BAD_REQUEST);
	}
}
elseif ($_SERVER["REQUEST_METHOD"] == "POST")
{
    // parse JSON in body
    $body = file_get_contents('php://input');
    $bodyJSON = json_decode($body, true);
    if ($bodyJSON === null)
    {
        returnMessage('Request body has malformed json', HTTP_BAD_REQUEST);
    }
    handlePOST($bodyJSON);
}
returnMessage('Invalid request type', HTTP_BAD_REQUEST);

?>
