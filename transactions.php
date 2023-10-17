<?php
include_once('templates/connection.php');
include_once('templates/cookies.php');

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


    Notes:

        In the current state, this DOES NOT integrate with the debt computation
        mechanisms. JSON objects could use some better notation for follow-on usage.

        Includes some error checking, but is not safe against malicious usage. There
        is no permission checking, any request can modify anything.

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
        http_response_code(400);
        return;
    }
} 

/*
POST Request
    - Requires JSON object in body
*/
elseif ($_SERVER["REQUEST_METHOD"] == "POST") 
{
    if (!empty($_POST)) 
    {
        if (is_string($_POST) && json_decode($_POST, true)) {
            addNewTransaction($_POST);
        }
    }
}

/*
UPDATE Request
    - Requires JSON object in body
*/
elseif ($_SERVER["REQUEST_METHOD"] == "UPDATE")
{
    if (!empty($_POST)) 
    {
        if (is_string($_POST) && json_decode($_POST, true)) {
            updateExistingTransaction($_POST);
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
    //Check that user_id was passed as URL parameter
    if (isset($_DELETE['transaction_id'])) 
    {
        deleteTransaction($_DELETE['transaction_id']);
        return;
    } else {
        // No user_id passed, bad request. Cannot retrieve all transactions for everyone
        http_response_code(400);
        return;
    }
}


/*
Returns all transactions associated with a given user
    * Returns all data about that transaction
*/
function getTransactions($user_id)
{   
    global $mysqli;

    $passed_user_id = validateSessionID();

    if ($passed_user_id === 0 || $passed_user_id !== $user_id) 
    {
        // Forbidden, bad cookie
        http_response_code(401);
        return;
    }

    //Retrieves all information about transactions that $user_id particpated in
    $sql = "SELECT  transaction_participants.user_id AS user_id,
                    transactions.transaction_id AS transaction_id,
                    transactions.name AS transaction_name,
                    transactions.date AS transaction_date,
                    transactions.description AS transaction_description
                    
            FROM transaction_participants
            LEFT JOIN transactions ON transactions.transaction_id = transactions.transaction_id
            WHERE transaction_participants.user_id = ?";

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

    $passed_user_id = validateSessionID();

    if ($passed_user_id === 0) 
    {
        // Unathorized, no user_id associated with cookie
        http_response_code(401);
    }

    //Retrieves all information about transactions that $user_id particpated in
    $sql = "SELECT  transactions.transaction_id AS transaction_id,
                    transactions.name AS transaction_name,
                    transactions.date AS transaction_date,
                    transactions.description AS transaction_description
      
            FROM transactions
            WHERE transactions.transaction_id = ?";

    $transaction = $mysqli->execute_query($sql, [$transaction_id]);

    //Convert data to associative array
    $response = encapsulateTransactionData($transaction->fetch_assoc());

    // User attempted to access transaction they are not a part of
    if (!checkParticipantsForUser($response, $passed_user_id))
    {
        http_response_code(401);
        return;
    }


    $json_data = json_encode(array_values($response));
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
        if ($participant['user_id'] === $user_id) {
            return true;
        }
    }

    return false;
    
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


    // Fetch data about participants *in* that given transaction
    $transaction['transaction_participants'] = array();

    // User with user_id=$user_id should ALWAYS be a participant
    $sql = "SELECT  transaction_participants.user_id AS user_id,
                    users.username AS username,
                    transaction_participants.has_approved AS has_approved,
                    transaction_participants.amount AS amount

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
        $transaction['transaction_participants'][$j]['has_approved'] = $subrow['has_approved'];
        $transaction['transaction_participants'][$j]['amount'] = $subrow['amount'];
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
        http_response_code(400);
        return;
    }

    // At this point, we can assume that JSON data is valid

    $passed_user_id = validateSessionID();

    // Unathorized, no user_id associated with cookie OR
    // User attempted to access transaction they are not a part of
    if ($passed_user_id === 0 ||
        !checkParticipantsForUser($data, $passed_user_id)) 
    {
        http_response_code(401);
        return;
    }

    
    //TODO this follows the same pattern as validation, room for improvement

    $sql = "INSERT INTO transactions    
                        (name, date, description)
                VALUES  (?, ?, ?)";

    $response = $mysqli->execute_query($sql, [  $data['transaction_name'],
                                                $data['transaction_date'],
                                                $data['transaction_description'] ]);

    //$response === true if insertion successful
    if ($response !== true) {
        //JSON was valid, clearly something internal (HTTP_500) occured
        http_response_code(500);
        return;
    }

    //Get AUTO_INCREMENT ID for most recent insertion
    $transaction_id = $mysqli->insert_id;

    foreach($data['transaction_participants'] as $participant) 
    {
        $sql = "INSERT INTO transaction_participants    
                            (transaction_id, user_id, amount)
                    VALUES  (?, ?, ?, ?)";

        $response = $mysqli->execute_query($sql, [  $transaction_id,
                                                    $participant['user_id'],
                                                    $participant['amount'] ]);

        //$response === true if insertion successful
        if ($response !== true) {
            //JSON was valid, clearly something internal (HTTP_500) occured
            http_response_code(500);
            return;
        }
    }
    
    return;
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
    global $mysqli;

    // If invalid data, return HTTP_400 (Bad Request)
    // Need an existing transaction d
    if (!validateTransactionData($data) || !isset($data['transaction_id'])) {  
        http_response_code(400);
        return;
    }

    $passed_user_id = validateSessionID();

    // Unathorized, no user_id associated with cookie OR
    // User attempted to access transaction they are not a part of
    if ($passed_user_id === 0 ||
        !checkParticipantsForUser($data, $passed_user_id)) 
    {
        http_response_code(401);
        return;
    }


    $sql = "UPDATE  transactions
            SET     transaction_name = ?,
                    transaction_date = ?,
                    transaction_description = ?
            WHERE   transaction_id = ?";
    
    //TODO: this DOES NOT handle participant changes at ALL
    
    $response = $mysqli->execute_query($sql, [  $data['transaction_name'],
                                                $data['transaction_date'],
                                                $data['transaction_description'],
                                                $data['transaction_id'] ]);

    //$response === true if update successful
    if ($response !== true) {
        //JSON was valid, clearly something internal (HTTP_500) occured
        http_response_code(500);
        return;
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
    $nkt = ['transaction_name', 'transaction_date', 'transaction_description'];

    //Needed keys for participants (p)
    $nkp = ['user_id', 'amount'];

    /*
    Find the keys in common between the needed_keys and the keys provided
    If the number of keys in common matches the number of keys needed, all necessary keys exist
    If not, return HTTP_400, bad request formatting
    */
    if (count($nkt) !== count(array_intersect(array_keys($data), $nkt))) {
        return false;
    }

    // Repeat for each participant (p)in non-associative array, ensures each user block is valid
    foreach ($data['transaction_participants'] as $p)
    {
        if (count($nkp) !== count(array_intersect(array_keys($p), $nkp))) {
            return false;
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
    $sql = "SELECT  transaction_participants.user_id AS user_id,
            FROM transaction_participants
            WHERE transaction_id = ?";
    
    $transaction_participants = $mysqli->execute_query($sql, [$transaction_id]);

    //Format in such a way that we can use checkParticipantsForUser helper function
    $data = array();
    $data['transaction_participants'] = $transaction_participants;


    $passed_user_id = validateSessionID();

    // Unathorized, no user_id associated with cookie OR
    // User attempted to delete transaction they are not a part of
    if ($passed_user_id === 0 ||
        !checkParticipantsForUser($data, $passed_user_id)) 
    {
        http_response_code(401);
        return;
    }

    //Let foreign key constraints handle the heavy-lifting here.
    $sql = "DELETE FROM     transactions
            WHERE           transaction_id = ?";

    $response = $mysqli->execute_query($sql, [$transaction_id]);

    //$response === true if delete successful
    if ($response !== true) {
        http_response_code(400);
        return;
    }
}


?>