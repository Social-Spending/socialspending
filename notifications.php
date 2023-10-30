<?php

include_once("templates/connection.php");
include_once("templates/cookies.php");
include_once("templates/constants.php");

/*
GET Request
    - Param 1 = "notification_type"
    - Param 2 = "user_id"
*/
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    //Check if user_id and a notification type were passed
    if (isset($_GET["type"])) {
		getNotifications($_GET["type"]);
    }
	//No other valid GET requests, fail out
    else {
        http_response_code(HTTP_BAD_REQUEST);
    }
} 

/*
Selects the proper notifications to be returned
    - type = "friend_request", "approval_request", or "approved_transaction"
*/
function getNotifications($type) {
    //Get the user ID from the cookie
    $user_id = intval(validateSessionID());
    if ($user_id === 0) {
        http_response_code(HTTP_UNAUTHORIZED);
        return;
    }

	switch ($type) {
		case "friend_request":
			getFriendRequests($user_id);
			break;
		case "transaction_approval":
			getApprovalRequests($user_id);
			break;
		case "complete_transaction":
			getApprovedTransactions($user_id);
			break;
		default:
			http_response_code(HTTP_BAD_REQUEST);
			break;
	}
}

/*
Returns friend request notifications
    - user_id = User ID to return friend request notifications for
*/
function getFriendRequests($user_id) {
    global $mysqli;

    $sql = "SELECT  notifications.notification_id AS notification_id,
                    users.username AS username
            FROM notifications
            LEFT JOIN users ON users.user_id = notifications.friend_request_user_id
            WHERE notifications.user_id=? AND notifications.type=\"friend_request\"";

    $friend_requests = $mysqli->execute_query($sql, [$user_id]);

    //Append each row to a new array to allow for a proper JSON structure
    $friend_requests_array = [];
    for ($i = 0; $i < $friend_requests->num_rows; $i++) {
        array_push($friend_requests_array, $friend_requests->fetch_assoc());
    }

    //Send response
    $json_data = json_encode($friend_requests_array);
    header('Content-Type: application/json');
    echo $json_data;
}

/*
Returns transaction approval requests notifications
    - user_id = User ID to return transaction approval request notifications for
*/
function getApprovalRequests($user_id) {
    global $mysqli;

    $sql = "SELECT  notifications.notification_id AS notification_id,
    				transactions.name AS name
            FROM notifications
            LEFT JOIN transactions ON transactions.transaction_id = notifications.transaction_id
            WHERE notifications.user_id=? AND notifications.type=\"approval_request\"";

    $approval_requests = $mysqli->execute_query($sql, [$user_id]);

    $approval_requests_array = [];
    for ($i = 0; $i < $approval_requests->num_rows; $i++) {
        array_push($approval_requests_array, $approval_requests->fetch_assoc());
    }

    $json_data = json_encode($approval_requests_array);
    header('Content-Type: application/json');
    echo $json_data;
}

/*
Returns approved transaction notifications
    - user_id = User ID to return approved transaction notifications for
*/
function getApprovedTransactions($user_id) {
    global $mysqli;

    $sql = "SELECT  notifications.notification_id AS notification_id,
    				transactions.name AS name
            FROM notifications
            LEFT JOIN transactions ON transactions.transaction_id = notifications.transaction_id
            WHERE notifications.user_id=? AND notifications.type=\"approved_transaction\"";

    $approved_transactions = $mysqli->execute_query($sql, [$user_id]);

    $approved_transactions_array = [];
    for ($i = 0; $i < $approved_transactions->num_rows; $i++) {
        array_push($approved_transactions_array, $approved_transactions->fetch_assoc());
    }

    $json_data = json_encode($approved_transactions_array);
    header('Content-Type: application/json');
    echo $json_data;
}

/*
Removes a notification from the database
    - notification_id = ID of notification to remove from the DB
*/
function removeNotification($notification_id) {
    global $mysqli;

    $sql = "DELETE FROM notifications
            WHERE notification_id=?";

    $user_id = $mysqli->execute_query($sql, [$notification_id])->fetch_assoc()["user_id"];

    if (!verifyUser($user_id)) {
        http_response_code(HTTP_UNAUTHORIZED);
        return;
    }
}

?>
