<?php

include_once('templates/connection.php');
include_once('templates/cookies.php');
include_once('templates/constants.php');

/*
Transaction Approval PHP Endpoint
    POC: njones9

    Primary Functions:  getTransactions($user_id)
                        getTransaction($transaction_id)

                        addNewTransaction($json_obj)
                        updateExistingTransaction($json_obj)

                        deleteTransaction($json_obj)

    Helper Functions:   encapsulateTransactionData($row)
                        validateTransactionData($json_obj)
                        checkParticipantsForUser($array, $user_id)


    Notes:

        In the current state, this DOES NOT integrate with the debt computation
        mechanisms. JSON objects could use some better notation for follow-on usage.

        Includes some error checking, but is not safe against malicious usage.

    TODO:

        The updateExistingTransactions function needs some attention. Not all
        mutable values have setters.

        The Notes section provides some egregious flaws in data security.

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
PUT Request
    - Requires URL parameter for transaction_id
*/
if ($_SERVER["REQUEST_METHOD"] == "PUT")
{

    if (!empty($_PUT)) 
    {
        if (is_string($_PUT) && json_decode($_PUT, true)) {
            updateExistingTransaction($_PUT);
        }
    }
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
*/
function approveTransaction($transaction_id) 
{
    global $mysqli;

    $user_id = intval(validateSessionID());

    // Unathorized, no user_id associated with cookie
    if ($user_id === 0)
    {
        http_response_code(HTTP_UNAUTHORIZED);
        return;
    }

    //Users can only approve their own transactions
    //SQL will handle if the user isn't actually a participant
    $sql = "UPDATE  transaction_participants
            SET     has_approved = ?
            WHERE   transaction_id = ? AND user_id = ?";

    $mysqli->execute_query($sql, [true, $transaction_id, $user_id]);

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

?>