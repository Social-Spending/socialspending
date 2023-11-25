<?php

include_once("templates/connection.php");
include_once("templates/cookies.php");
include_once("templates/constants.php");
include_once("templates/jsonMessage.php");

/*
GET Request
    - Param 1 = "notification_type"
    - Param 2 = "user_id"
POST Request
    - Param 1 = "operation"
    - Param 2 = "notification_id"
*/
if (str_contains($_SERVER["REQUEST_URI"], "notifications.php")) {
    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        handleGET();
    }
    elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
        $body = file_get_contents("php://input");
        $bodyJSON = json_decode($body, true);

        //Check if user_id and a notification type were passed
        if (isset($bodyJSON["operation"]) && $bodyJSON["operation"] == "dismiss" && isset($bodyJSON["notification_id"])) {
            dismissNotification($bodyJSON["notification_id"]);
        }
        //No other valid POST requests, fail out
        else {
            returnMessage("Operation and/or notification_id not given or invalid", HTTP_BAD_REQUEST);
        }
    }
} 

function handleGET() {
    $user_id = intval(validateSessionID());
    if ($user_id === 0) {
        returnMessage("Valid session not found for user", HTTP_UNAUTHORIZED);
    }

    $response = ["friend_requests" => getFriendRequests($user_id),
                "transaction_approvals" => getApprovalRequests($user_id),
                "completed_transactions" => getApprovedTransactions($user_id),
                "group_invites" => getGroupInvites($user_id)
                ];

    $json_data = json_encode($response);
    header('Content-Type: application/json');
    echo $json_data;
    http_response_code(HTTP_OK);
}

/*
Returns friend request notifications
    - user_id = User ID to return friend request notifications for
*/
function getFriendRequests($user_id) {
    global $mysqli;

    $sql = "SELECT  notifications.notification_id AS notification_id,
                    users.username AS username,
                    users.user_id AS friend_id
            FROM notifications
            LEFT JOIN users ON users.user_id = notifications.friend_request_user_id
            WHERE notifications.user_id=? AND notifications.type=\"friend_request\"
            ORDER BY notifications.notification_timestamp DESC";

    $friend_requests = $mysqli->execute_query($sql, [$user_id]);

    //Append each row to a new array to allow for a proper JSON structure
    $friend_requests_array = [];
    for ($i = 0; $i < $friend_requests->num_rows; $i++) {
        array_push($friend_requests_array, $friend_requests->fetch_assoc());
    }

    return $friend_requests_array;
}

/*
Returns transaction approval requests notifications
    - user_id = User ID to return transaction approval request notifications for
*/
function getApprovalRequests($user_id) {
    global $mysqli;

    $sql = "SELECT  notifications.notification_id AS notification_id,
    				transactions.name AS name,
                    transactions.transaction_id AS transaction_id
            FROM notifications
            LEFT JOIN transactions ON transactions.transaction_id = notifications.transaction_id
            WHERE notifications.user_id=? AND notifications.type=\"approval_request\"
            ORDER BY notifications.notification_timestamp DESC";

    $approval_requests = $mysqli->execute_query($sql, [$user_id]);

    $approval_requests_array = [];
    for ($i = 0; $i < $approval_requests->num_rows; $i++) {
        array_push($approval_requests_array, $approval_requests->fetch_assoc());
    }

    return $approval_requests_array;
}

/*
Returns approved transaction notifications
    - user_id = User ID to return approved transaction notifications for
*/
function getApprovedTransactions($user_id) {
    global $mysqli;

    $sql = "SELECT  notifications.notification_id AS notification_id,
    				transactions.name AS name,
                    transactions.transaction_id AS transaction_id
            FROM notifications
            LEFT JOIN transactions ON transactions.transaction_id = notifications.transaction_id
            WHERE notifications.user_id=? AND notifications.type=\"approved_transaction\"
            ORDER BY notifications.notification_timestamp DESC";

    $approved_transactions = $mysqli->execute_query($sql, [$user_id]);

    $approved_transactions_array = [];
    for ($i = 0; $i < $approved_transactions->num_rows; $i++) {
        array_push($approved_transactions_array, $approved_transactions->fetch_assoc());
    }

    return $approved_transactions_array;
}

/*
Returns group invite notifications
    - user_id = User ID to return notifications for
*/
function getGroupInvites($user_id) {
    global $mysqli;

    $sql = "SELECT  n.notification_id AS notification_id,
    				g.group_name AS group_name,
                    n.group_id AS group_id
            FROM notifications n
            JOIN groups g ON g.group_id = n.group_id
            WHERE n.user_id = ? AND n.type = 'group_invite'
            ORDER BY n.notification_timestamp DESC";

    $results = $mysqli->execute_query($sql, [$user_id]);
    // check if failure
    if (!$results)
    {
        // not sure if this is the way notifications.php returns other error messages
        handleDBError();
    }

    $group_invites_array = array();
    while ($row = $results->fetch_assoc()) {
        array_push($group_invites_array, $row);
    }

    return $group_invites_array;    
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

    
    http_response_code(HTTP_OK);
    return;
   
}

/*
Dismiss a notification
    Params
        $transaction_id - The key for the transaction to dismiss
*/
function dismissNotification($notification_id)
{
    global $mysqli;

    //Get the user ID from the cookie
    $user_id = intval(validateSessionID());
    if ($user_id === 0) {
        returnMessage("Valid session not found for user", HTTP_UNAUTHORIZED);
    }

    $sql = "DELETE
            FROM notifications
            WHERE notification_id = ? AND user_id = ?;";
    $response = $mysqli->execute_query($sql, [$notification_id, $user_id]);

    if (!$response)
    {
        http_response_code(HTTP_INTERNAL_SERVER_ERROR);
    }

    if ($mysqli->affected_rows == 0)
    {
        http_response_code(HTTP_NOT_FOUND);
    }

    http_response_code(HTTP_OK);
}

?>
