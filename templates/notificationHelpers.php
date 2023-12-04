<?php

// create "completed transaction" notifications for the given transaction
function createCompleteTransactionNotifications($transactionID)
{
    global $mysqli;

    $sql = "INSERT INTO notifications (user_id, type, transaction_id)
            SELECT tp.user_id, 'approved_transaction', tp.transaction_id
            FROM transaction_participants tp
            WHERE tp.transaction_id = ?;";

    $response = $mysqli->execute_query($sql, [$transactionID]);

    // check that query was successful
    if (!$response)
    {
        handleDBError();
    }
}

/*
Removes a notification from the database
    - notification_id = ID of notification to remove from the DB
*/
function removeNotification($notification_id) {
    global $mysqli;

    $sql = "DELETE FROM notifications
            WHERE notification_id = ?";

    $mysqli->execute_query($sql, [$notification_id]);
}

/*
Adds a new notification to a given user's feed about a transaction
    Params
        $transaction_id - The unique identifier for the transaction being modified
        $user_id - The user that should be notified

TODO: Does not check if the user exists. Does it need to?
*/
function addApprovalRequestNotification($transaction_id, $user_id)
{
    global $mysqli;

    $sql = "INSERT INTO notifications
                        (user_id, type, transaction_id)
            VALUES (?, \"approval_request\", ?)";

    $mysqli->execute_query($sql, [$user_id, $transaction_id]);

}

/*
Adds a new notification to a given user's feed about a transaction
    Params
        $transaction_id - The unique identifier for the transaction being modified
*/
function createApprovalRequestNotification($transaction_id)
{
    global $mysqli;

    $sql = "INSERT INTO notifications (user_id, type, transaction_id)
            SELECT tp.user_id, 'approval_request', tp.transaction_id
            FROM transaction_participants tp
            WHERE tp.transaction_id = ? AND tp.has_approved = 0;";

    $mysqli->execute_query($sql, [$transaction_id]);

}

?>
