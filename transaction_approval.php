<?php

include_once('templates/connection.php');
include_once('templates/cookies.php');
include_once('templates/constants.php');
include_once("templates/jsonMessage.php");

include_once('notifications.php');

include_once('templates/debtHelpers.php');

/*
Transaction Approval PHP Endpoint
    POC: njones9

    Primary Functions:  approveTransaction($transaction_id)
                        submitTransaction($transaction_id)

    Helper Functions:   checkTransactionStatus($transaction_id)


    Notes:

        Includes some error checking, but is not safe against malicious usage.

    TODO:

        Only permits a single creditor for a transaction in current state
        
        No other transaction code has this limitation

    Structure:

        Main entrypoint at the top of file. Called with each endpoint access. 

        Incoming request is triaged and dispatched to functions which exist
        at the bottom of the file.
*/

###################
#                 #
# MAIN ENTRYPOINT #
#                 #
###################



/*
PUT Request - User is accepting an approval_request
    - Requires URL parameter for transaction_id
*/
if ($_SERVER["REQUEST_METHOD"] == "PUT")
{

    $_PUT = file_get_contents("php://input");
    
    if (!empty($_PUT)) 
    {
        $json = json_decode($_PUT, true);
        if (isset($json['transaction_id'])) {
            approveTransaction($json['transaction_id']);
            return;
        }

    } 
    returnMessage("No transaction_id included", HTTP_BAD_REQUEST);
    return;    
}




/*
Sets all approvals to false for a given transaction
    Params
        $transaction_id - The unique identifier for the transaction being modified
    Returns
        $boolval($response) - Boolean whether update was successful
*/
function resetTransactionApprovals($transaction_id)
{
    global $mysqli;
    
    $sql = "UPDATE  transaction_participants
            SET     has_approved = ?
            WHERE   transaction_id = ?";

    
    $response = $mysqli->execute_query($sql, [false, $transaction_id]);

    return boolval($response);
}

/*
Approves a transaction for a given transaction
    Params
        $transaction_id - The unique identifier for the transaction being modified
    Returns

*/
function approveTransaction($transaction_id) 
{
    global $mysqli;

    $user_id = intval(validateSessionID());

    // Unathorized, no user_id associated with cookie
    if ($user_id === 0)
    {
        returnMessage("User not signed in", HTTP_UNAUTHORIZED);
        return;
    }

    //Users can only approve their own transactions
    //SQL will handle if the user isn't actually a participant
    $sql = "UPDATE  transaction_participants
            SET     has_approved = ?
            WHERE   transaction_id = ? AND user_id = ?";

    $response = $mysqli->execute_query($sql, [true, $transaction_id, $user_id]);

    //User has submitted approval for a transaction they dont belong in
    if (!boolval($response))
    {
        returnMessage("transaction_id or user_id doesn't exist", HTTP_BAD_REQUEST);
        return;
    }
    
    //remove notifications
    $sql = "SELECT  notifications.notification_id AS notification_id
            FROM notifications
            WHERE notifications.user_id=? AND notifications.transaction_id=?";

    $approval_requests = $mysqli->execute_query($sql, [$user_id, $transaction_id]);

    for ($i = 0; $i < $approval_requests->num_rows; $i++) {        
        removeNotification($approval_requests->fetch_assoc()['notification_id']);
    }
    
    //See if all users have now accepted, TRUE = all users have accepted
    if (checkTransactionStatus($transaction_id)) 
    {
        if (submitTransaction($transaction_id) === false)
        {
            //Transaction failed to submit in some way
            returnMessage("Error submitting transaction", HTTP_BAD_REQUEST);
            return;
        }
    }

    //Approval submitted successfully, debt possibly modified
    return;
}

/*
Checks whether all transaction participants have approved of the transaction
    Params
        $transaction_id - The unique identifier for the transaction being modified
    
    Returns
        true - All users in $transaction_id has approved
        false - Some users have still yet to approve $transaction_id
*/
function checkTransactionStatus($transaction_id)
{
    global $mysqli;

    $sql = "SELECT  ALL     user_id
            FROM            transaction_participants
            WHERE           has_approved = false AND transaction_id = ?";

    $response = $mysqli->execute_query($sql, [$transaction_id]);

    return !boolval($response->num_rows);
}

/*
Uses a transaction will full-approval and modifies the debt table
	Params
		$transaction_id - The unique identifier for a given transaction
	Returns
		false - error submiting transaction (transaction malformed)
		true - transaction submitted succesfully

*/
function submitTransaction($transaction_id)
{
	global $mysqli;

	//Get the creditors (owed money, amount < 0), first
	$sql = "SELECT	user_id, amount
			FROM	transaction_participants
			WHERE	transaction_id = ? AND amount < 0";
	
	$creditor_response = $mysqli->execute_query($sql, [$transaction_id]);

    // Need a creditor associated with the transaction
	if (!$creditor_response || mysqli_num_rows($creditor_response) == 0) 
	{
		return false;
	}

    //Determine the amount that all creditors lent
    $sum_credited = 0;
    while ($creditor = $creditor_response->fetch_assoc())
    {
        $sum_credited += $creditor['amount'];
    }

	$sql = "SELECT	user_id, amount
			FROM	transaction_participants
			WHERE	transaction_id = ? AND amount > 0";
	
	$debtor_response = $mysqli->execute_query($sql, [$transaction_id]);

	while ($debtor = $debtor_response->fetch_assoc())
	{   
        mysqli_data_seek($creditor_response,0);
        while ($creditor = $creditor_response->fetch_assoc())
        {
            /*
            Divide amount borrowed among creditors, ratioed by contribution amount (positive)
            
            amount_owed_to_creditor = amount_borrowed * (amount_creditor_lent / amount_all_creditors_lent)
                (Postitive)         =   (Positive)    *   [  (Negative)       /          (Negative) ]
            
            */
            $amount_owed = $debtor['amount'] * ($creditor['amount'] / $sum_credited );

            //Add amount to debt ledger
            if (addDebt($creditor['user_id'], $debtor['user_id'], $amount_owed) === false)
            { 
                return false; 
            }
        }

	}

	return true;	
}

?>
