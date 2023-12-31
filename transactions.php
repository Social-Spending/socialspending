<?php

include_once('templates/connection.php');
include_once('templates/cookies.php');
include_once('templates/constants.php');
include_once("templates/jsonMessage.php");
include_once('templates/saveImage.php');
include_once('templates/groupHelpers.php');

include_once('templates/groupHelpers.php');
include_once('templates/notificationHelpers.php');

/*
Transactions PHP Endpoint
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


    Structure:

        Main entrypoint at the top of file. Called with each endpoint access. 

        Incoming request is triaged and dispatched to functions which exist
        at the bottom of the file.
*/

/*
    Request Types

    GET: Get ALL transactions associated with a given user

        Ex: https://socialspendingapp.com/transactions.php?user_id={USER_ID}
            Returns JSON Object of the following type:
                [
                    {
                        "transaction_id":1,
                        "transaction_name":"Halal Shack",
                        "transaction_date":"2023-09-29",
                        "transaction_description":"Bought you fools some food",
                        "receipt_path":"/transaction_receipts/01234567890abcdef.gif",
                        "group_id": 2,
                        "is_approved": 1,
                        "amount":2000,
                        "transaction_participants":[ 
                                                    {
                                                    "user_id":1,
                                                    "username":"Roasted715Jr",
                                                    "has_approved":0,
                                                    "amount":2000
                                                    },
                                                    {
                                                    "user_id": 2,
                                                    "username":"Soap_Ninja",
                                                    "has_approved":0,
                                                    "amount":-2000
                                                    } 
                                                    ]
                    },
                    {...}
                ]

    GET: Get single transaction, given by TRANSACTION_ID

        Ex: https://socialspendingapp.com/transactions.php?transaction_id={TRANSACTION_ID}

            Returns JSON Object of the following type:
                {
                    "transaction_id":1,
                    "transaction_name":"Halal Shack",
                    "transaction_date":"2023-09-29",
                    "transaction_description":"Bought you fools some food",
                    "receipt_path":"/transaction_receipts/01234567890abcdef.gif",
                    "group_id": 2,
                    "is_approved": 1,
                    "amount":2000,
                    "transaction_participants":[ 
                                                {
                                                "user_id":1,
                                                "username":"Roasted715Jr",
                                                "has_approved":0,
                                                "amount":2000
                                                },
                                                {
                                                "user_id": 2,
                                                "username":"Soap_Ninja",
                                                "has_approved":0,
                                                "amount":-2000
                                                } 
                                                ]
                }

    POST: Add a new transaction to the transaction table 

        Ex: https://socialspendingapp.com/transactions.php

            Expects JSON Object of the following type:
                {
                    "transaction_name":"Halal Shack",
                    "transaction_date":"2023-09-29",
                    "transaction_description":"Bought you fools some food",
                    "group_id":2,
                    "amount":2000,
                    "transaction_participants":[ 
                                                {
                                                    "user_id":1,
                                                    "paid":2000,
                                                    "spent":1000
                                                    },
                                                    {
                                                    "user_id": 2,
                                                    "paid":0,
                                                    "spent":1000
                                                    } 
                                                ]
                }

    PUT: Updates an existing transaction, given by TRANSACTION_ID

        Ex:https://socialspendingapp.com/transactions.php?transaction_id={TRANSACTION_ID}

            Expects JSON Object of the following type:
                {
                    "transaction_name":"Halal Shack",
                    "transaction_date":"2023-09-29",
                    "transaction_description":"Bought you fools some food",
                    "amount":2000,
                    "group_id":2,
                    "transaction_participants":[ 
                                                {
                                                    "user_id":1,
                                                    "paid":2000,
                                                    "spent":1000
                                                    },
                                                    {
                                                    "user_id": 2,
                                                    "paid":0,
                                                    "spent":1000
                                                    } 
                                                ]
                }

    DELETE: Deletes a transaction, given by TRANSACTION_ID

        Ex: https://socialspendingapp.com/transactions.php?transaction_id={TRANSACTION_ID}
    
        Expects no JSON Object, returns no JSON object
*/

###################
#                 #
# MAIN ENTRYPOINT #
#                 #
###################

/*
GET Request
    - Param 1 = 'user_id'
        * Returns all transactions associated with a given user
*/
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    
    //Check if user_id was passed as URL parameter
    if (isset($_GET['user_id'])) {
        getTransactions($_GET['user_id']);
        return;
    } 
    // Check if transaction_id was passed as URL parameter
    elseif (isset($_GET['transaction_id'])) {
        getTransaction($_GET['transaction_id']);
        return;
    } 
    // No other valid GET requests, fail out
    else {
        returnMessage("Incorrect parameters specified", HTTP_BAD_REQUEST);
    }
} 

/*
POST Request
    - Requires JSON object in body
*/
elseif ($_SERVER["REQUEST_METHOD"] == "POST")      
{
    $_POST = file_get_contents("php://input");
    if (!empty($_POST)) 
    {
        if (is_string($_POST) && json_decode($_POST, true)) {
            addNewTransaction(json_decode($_POST, true));
        }
    }
}

/*
PUT Request
    - Requires JSON object in body
*/
elseif ($_SERVER["REQUEST_METHOD"] == "PUT")
{
    $_PUT = file_get_contents("php://input");

    if (!empty($_PUT)) 
    {
        if (is_string($_PUT) && json_decode($_PUT, true)) {
            updateExistingTransaction(json_decode($_PUT, true));
        }
    }
}

/*
DELETE Request
    - Param 1 = 'transaction_id'
        * Deletes a transaction

*/
elseif ($_SERVER["REQUEST_METHOD"] == "DELETE")
{    

    $_DELETE = file_get_contents("php://input");
    //Check that transaction_id was passed as URL parameter
    if (!empty($_DELETE) && is_string($_DELETE) && json_decode($_DELETE, true)) {
        $json = json_decode($_DELETE, true);

        if (isset($json["transaction_id"])) {
            deleteTransaction($json['transaction_id']);
            return;

        } else{
            returnMessage("No transaction_id passed", HTTP_BAD_REQUEST);
        }
        
       
    } else {
        // No user_id passed, bad request. Cannot retrieve all transactions for everyone
        returnMessage("Error while parsing JSON", HTTP_BAD_REQUEST);
    }
}


/*
Returns all transactions associated with a given user
    * Returns all data about that transaction
*/
function getTransactions($user_id)
{   
    global $mysqli;

    $passed_user_id = intval(validateSessionID());

    if ($passed_user_id === 0) 
    {
        // Forbidden, no identifier
        returnMessage("User not signed in", HTTP_UNAUTHORIZED);
        return;
    }

    if ($passed_user_id !== intval($user_id))
    {
        // User attempted to access resource they cannot access
        returnMessage("User must be part of transaction", HTTP_FORBIDDEN);
    }

    //Retrieves all information about transactions that $user_id participated in
    $sql = "SELECT  transactions.transaction_id AS transaction_id,
                    transactions.name AS transaction_name,
                    transactions.date AS transaction_date,
                    transactions.description AS transaction_description,
                    transactions.group_id AS group_id,
                    transactions.receipt_path as receipt_path,
                    transactions.amount AS amount,
                    CASE WHEN COUNT(tp2.user_id) = SUM(tp2.has_approved)
                        THEN 1
                        ELSE 0
                    END AS is_approved

                FROM transactions
                JOIN transaction_participants tp2 ON tp2.transaction_id = transactions.transaction_id
                JOIN transaction_participants tp ON tp.transaction_id = transactions.transaction_id
                WHERE tp.user_id = ?
                GROUP BY transaction_id";

    $transactions = $mysqli->execute_query($sql, [$user_id]);

    //Associative array for encode/return
    $response = array();

    $i = 0;
    while ($row = $transactions->fetch_assoc()) 
    {
        // Set index in array to *another* associative array
        $response[$i] = encapsulateTransactionData($row);
        $i++;
    }
    

    $json_data = json_encode(array_values($response));
    header('Content-Type: application/json');
    echo $json_data;
    return;

}



/*
Returns transaction data for a single transaction
    * Returns data only about THAT transaction
*/
function getTransaction($transaction_id) {

    global $mysqli;

    $passed_user_id = intval(validateSessionID());

    if ($passed_user_id === 0) 
    {
        // Unauthorized, no user_id associated with cookie
        returnMessage("User not signed in", HTTP_UNAUTHORIZED);
    }

    //Retrieves all information about transactions that $user_id participated in
    $sql = "SELECT  transactions.transaction_id AS transaction_id,
                    transactions.name AS transaction_name,
                    transactions.date AS transaction_date,
                    transactions.description AS transaction_description,
                    transactions.group_id as group_id,
                    transactions.receipt_path as receipt_path,
                    transactions.amount AS amount,
                    CASE WHEN COUNT(tp.user_id) = SUM(tp.has_approved)
                        THEN 1
                        ELSE 0
                    END AS is_approved
      
            FROM transactions
            JOIN transaction_participants tp ON tp.transaction_id = transactions.transaction_id
            WHERE transactions.transaction_id = ?
            GROUP BY transaction_id";

    $transaction = $mysqli->execute_query($sql, [$transaction_id]);

    //Convert data to associative array
    $response = encapsulateTransactionData($transaction->fetch_assoc());

    // User attempted to access transaction they are not a part of
    if (!checkParticipantsForUser($response, $passed_user_id) && !verifyGroupAndUserIDs($passed_user_id, $response["group_id"]))
    {
        returnMessage("User must be part of transaction", HTTP_FORBIDDEN);
    }


    $json_data = json_encode($response);
    header('Content-Type: application/json');
    echo $json_data;
    return;
}


/*
Helper function to check whether a $user_id is a participant in the transaction
    Params
        $array - associative array for transaction
        $user_id - user_id attempting to manipulate transaction
    Returns
        true - $user_id is in participants
        false - $user_id is not participant
*/
function checkParticipantsForUser($array, $user_id) 
{   

    foreach($array['transaction_participants'] as $participant)
    {
        if (intval($participant['user_id']) === $user_id) {
            return true;
        }
    }

    return false;
    
}


/* Helper function to check whether the sum of amounts for all participants is 0
    Params
        $date - associative array for transaction
    Returns
        true - sum of amounts is 0
        false - sum of amounts is not 0
*/
function checkAmountsSum($data)
{
    $paidSum = 0;
    $spentSum = 0;
    foreach($data['transaction_participants'] as $participant)
    {
        $paidSum += intval($participant['paid']);
        $spentSum += intval($participant['spent']);
    }

    $transactionTotal = $data['amount'];
    return ($paidSum == $transactionTotal && $spentSum == $transactionTotal);
}

/*
Pass this function a row of data from a sql query concerning transactions
    Returns an associative array entailing all details of that transaction
    Used in both GET methods
    $row = $query->fetch_assoc()
*/
function encapsulateTransactionData($row) 
{

    global $mysqli;

    // Data about a given transaction
    //$transaction['user_id'] = $row['user_id'];
    $transaction['transaction_id'] = $row['transaction_id'];
    $transaction['transaction_name'] = $row['transaction_name'];
    $transaction['transaction_date'] = $row['transaction_date'];
    $transaction['transaction_description'] = $row['transaction_description'];
    $transaction['group_id'] = $row['group_id'];
    $transaction['is_approved'] = $row['is_approved'];
    $transaction['receipt_path'] = $row['receipt_path'];
    $transaction['amount'] = $row['amount'];


    // Fetch data about participants *in* that given transaction
    $transaction['transaction_participants'] = array();

    // User with user_id=$user_id should ALWAYS be a participant
    $sql = "SELECT  transaction_participants.user_id AS user_id,
                    users.username AS username,
                    users.icon_path AS icon_path,
                    transaction_participants.has_approved AS has_approved,
                    transaction_participants.paid AS paid,
                    transaction_participants.spent AS spent

            FROM transaction_participants
            LEFT JOIN users on users.user_id = transaction_participants.user_id
            WHERE transaction_id = ?";
    
    $transaction_id = $row['transaction_id'];
    $transaction_participants = $mysqli->execute_query($sql, [$transaction_id]);

    $j = 0;
    while ($subrow = $transaction_participants->fetch_assoc()) 
    {
        // Data about the participants in a given transaction
        $transaction['transaction_participants'][$j]['user_id'] = $subrow['user_id'];
        $transaction['transaction_participants'][$j]['username'] = $subrow['username'];
        $transaction['transaction_participants'][$j]['icon_path'] = $subrow['icon_path'];
        $transaction['transaction_participants'][$j]['has_approved'] = $subrow['has_approved'];
        $transaction['transaction_participants'][$j]['amount'] = $subrow['spent'] - $subrow['paid'];
        $j++;
    }

    //Return array for use elsewhere
    return $transaction;
}

/*
Adds new transaction, populates both `transactions` and `transaction_participants`
    * transaction_name - non-unique name for transaction
    * transaction_date - date of the transaction
    * transaction_description - brief text description

    * transaction_participants - associative array
        ** user_id - unique id of participants. MUST include submitter user_id
        ** amount - amount owed by user_id for this transaction
*/
function addNewTransaction($data)
{
    global $mysqli;

    // If invalid data, return HTTP_400 (Bad Request)
    if (!validateTransactionData($data)) {  
        returnMessage("Invalid request", HTTP_BAD_REQUEST);
    }

    // At this point, we can assume that JSON data is valid

    $passed_user_id = intval(validateSessionID());

    // Unauthorized, no user_id associated with cookie
    if ($passed_user_id === 0)
    {
        returnMessage("User not signed in", HTTP_UNAUTHORIZED);
    }

    // User attempted to access transaction they are not a part of
    if (!checkParticipantsForUser($data, $passed_user_id))
    {
        returnMessage("User must be part of transaction", HTTP_FORBIDDEN);
    }

    // check that sum of all spent and all paid both equal the amount
    if (!checkAmountsSum($data))
    {
        returnMessage("Sum of paid and sum of spent must match the transaction amount", HTTP_BAD_REQUEST);
    }

    if (!is_null($data['group_id']) && !is_numeric($data['group_id'])) 
    {
        returnMessage("group_id must be NULL or INT", HTTP_BAD_REQUEST);
    }

    //Verify that the user belongs to the group they have passed
    if (!is_null($data['group_id']))
    {
        verifyGroupAndUserIDs(validateSessionID(), $data['group_id']);
    }
    
    //TODO this follows the same pattern as validation, room for improvement

    $sql = "INSERT INTO transactions    (name, date, amount, description, group_id)
                                VALUES  (?, ?, ?, ?, ?)";

    $response = $mysqli->execute_query($sql,    [   $data['transaction_name'],
                                                    $data['transaction_date'],
                                                    $data['amount'],
                                                    $data['transaction_description'],
                                                    $data['group_id']
                                                ]);

    //$response === true if insertion successful
    if ($response !== true) {
        //JSON was valid, clearly something internal (HTTP_500) occurred
        returnMessage("Error creating transaction", HTTP_INTERNAL_SERVER_ERROR);
    }

    //Get AUTO_INCREMENT ID for most recent insertion
    // The transaction_participant that created the transaction should already be approved
    $transaction_id = $mysqli->insert_id;


    foreach($data['transaction_participants'] as $participant) 
    {
        $sql = "INSERT INTO transaction_participants    
                            (transaction_id, user_id, has_approved, paid, spent)
                    VALUES  (?, ?, ?, ?, ?)";

        $response = $mysqli->execute_query($sql, [  $transaction_id,
                                                    $participant['user_id'],
                                                    ($participant['user_id'] == $passed_user_id) ? 1 : 0,
                                                    $participant['paid'],
                                                    $participant['spent'] ]);

        //$response === true if insertion successful
        if ($response !== true) {
            //JSON was valid, clearly something internal (HTTP_500) occurred
            returnMessage("Error creating transaction", HTTP_INTERNAL_SERVER_ERROR);
        }
        
    }
    //Send out notifications for approval
    createApprovalRequestNotification($transaction_id);

    $resultJSON = array();
    $resultJSON["transaction_id"] = $transaction_id;
    header('Content-Type: application/json');
    http_response_code(HTTP_OK);
    print(json_encode($resultJSON));
    exit(0);
}


/*
Adds new transaction, populates both `transactions` and `transaction_participants`
    * NEED to check that a transaction_id is given
        ** validateTransactionData DOES NOT check this param

TODO: Should a transaction update reset has_approved??
TODO: Maybe HTTP_500 isn't the best. What if ID doesn't exist?
    * This would be user's fault, theoretically.

NOTE: Approval should probably be handled outside of this method
*/
function updateExistingTransaction($data)
{
    returnMessage("Request Type Not Supported", HTTP_BAD_REQUEST);

    global $mysqli;

    // If invalid data, return HTTP_400 (Bad Request)
    // Need an existing transaction d
    if (!validateTransactionData($data) || !isset($data['transaction_id'])) {  
        http_response_code(HTTP_BAD_REQUEST);
        return;
    }

    $passed_user_id = intval(validateSessionID());

    // Unauthorized, no user_id associated with cookie OR
    if ($passed_user_id === 0)
    {
        returnMessage("User not signed in", HTTP_UNAUTHORIZED);
    }

    // User attempted to access transaction they are not a part of
    if (!checkParticipantsForUser($data, $passed_user_id))
    {
        returnMessage("User must be part of transaction", HTTP_FORBIDDEN);
    }

    
    $sql = "UPDATE  transactions
            SET     transaction_name = ?,
                    transaction_date = ?,
                    transaction_description = ?,
                    amount = ?
            WHERE   transaction_id = ?";
    
    //TODO: this DOES NOT handle participant changes at ALL
    
    $response = $mysqli->execute_query($sql, [  $data['transaction_name'],
                                                $data['transaction_date'],
                                                $data['transaction_description'],
                                                $data['amount'],
                                                $data['transaction_id'] ]);

    //$response === true if update successful
    if ($response !== true) {
        //JSON was valid, clearly something internal (HTTP_500) occurred
        returnMessage("Failed to update transaction", HTTP_INTERNAL_SERVER_ERROR);
    }

    //$transaction_id = $data['transaction_id'];

    /*
    TODO

    Need to be able to:
        * remove participants
        * add new participants
        * modifiying existing participants
    */

    return;
}

/*
Checks whether data regarding a new/existing transaction is valid
See addNewTransaction() for data formatting
Returns:
    * true - data is valid
    * false - data is invalid, return HTTP_400
*/
function validateTransactionData($data)
{
    // Needed keys for transactions (t)
    $nkt = ['transaction_name', 'transaction_date', 'transaction_description', 'amount'];

    //Needed keys for participants (p)
    $nkp = ['user_id', 'paid', 'spent'];

     /*
    Find the keys in common between the needed_keys and the keys provided
    If the number of keys in common matches the number of keys needed, all necessary keys exist
    If not, return HTTP_400, bad request formatting
    */
    foreach($nkt as $key){
        if(!isset($data[$key])) return false;
    }

    foreach ($data['transaction_participants'] as $participant)
    {
        // Repeat for each participant (p)in non-associative array, ensures each user block is valid
        foreach($nkp as $key){
            if(!isset($participant[$key])) return false;
        }
    }

    //No issues found with data
    return true;
}

/*
Deletes a transaction with the specified transaction_id
If fails, transaction never existed, blame the user

TODO: feels like there is more I need to do?
*/
function deleteTransaction($transaction_id)
{   
    global $mysqli;


    // Need to get participants for specified transaction for data security
    $sql = "SELECT  transaction_participants.user_id AS user_id
            FROM    transaction_participants
            WHERE   transaction_id = ?";

    $transaction_participants = $mysqli->execute_query($sql, [intval($transaction_id)]);

    // No transaction found, return 404
    if (mysqli_num_rows($transaction_participants) == 0)
    {
        returnMessage("Transaction not found", HTTP_NOT_FOUND);
    }

    //Format in such a way that we can use checkParticipantsForUser helper function
    $data = array();
    $data['transaction_participants'] = $transaction_participants;


    $passed_user_id = intval(validateSessionID());

    // Unauthorized, no user_id associated with cookie OR
    if ($passed_user_id === 0)
    {
        returnMessage("User not signed in", HTTP_UNAUTHORIZED);
    }

    // User attempted to access transaction they are not a part of
    if (!checkParticipantsForUser($data, $passed_user_id))
    {
        returnMessage("User must be part of transaction", HTTP_FORBIDDEN);
    }

    //Let foreign key constraints handle the heavy-lifting here.
    $sql = "DELETE FROM     transactions
            WHERE           transaction_id = ?";

    $response = $mysqli->execute_query($sql, [$transaction_id]);

    //$response === true if delete successful
    if ($response !== true) {
        returnMessage("Failed delete", HTTP_INTERNAL_SERVER_ERROR);
    }
}

function uploadReceipt($transaction_id) {
    global $mysqli, $_VALIDATE_IMAGE_FAILURE_MESSAGE;

    echo "In image upload\n";

    // // get data from POST
    // // if (!isset($_POST['transaction_id']) || !isset($_FILES['receipt']))
    // // {
    // //     returnMessage('Missing form fields', 400);
    // // }
    // // $transactionID = $_POST['transaction_id'];

    // // parse to image and save as gif to filesystem
    // $serverFileName = validateAndSaveImage($_FILES['receipt'], int->max, 0, 0, TRANSACTION_RECEIPT_DIR);
    // if (!$serverFileName)
    // {
    //     returnMessage($_VALIDATE_IMAGE_FAILURE_MESSAGE, 400);
    // }

    // // TODO get and remove old icon file if size becomes an issue

    // // query to store image path with the transaction
    // $sql =  'UPDATE transactions t '.
    //         'INNER JOIN transaction_members tm ON tm.transaction_id = t.transaction_id '.
    //         'SET g.receipt_path = ? '.
    //         'WHERE t.transaction_id = ? AND tm.user_id = ?;';

    // $result = $mysqli->execute_query($sql, ["/".$serverFileName, $transactionID, $userID]);
    // // check for errors
    // if (!$result)
    // {
    //     // query failed, internal server error
    //     handleDBError();
    // }
    // // check that row was affected
    // if ($mysqli->affected_rows == 0)
    // {
    //     // delete file
    //     unlink($serverFileName);
    //     returnMessage('Transaction not found or user is not a part of it', 404);
    // }

    // // success
    // $returnArray = array();
    // $returnArray['message'] = 'Success';
    // $returnArray['icon_path'] = '/'.$serverFileName;
    // header('Content-Type: application/json', true, 200);
    // print(json_encode($returnArray));
    // exit(0);
}

?>