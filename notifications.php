<?php

include_once("templates/connection.php");
include_once("templates/cookies.php");
include_once("templates/constants.php");

/*
GET Request
    - Param 1 = "notification_type"
    - Param 2 = "user_id"
        * Returns all notifications of a given type directed towards a certain user
*/
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    //Check if user_id and a notification type were passed
    if (isset($_GET["type"]) && isset($_GET["user_id"])) {
		getNotification($_GET["type"], $_GET["user_id"]);
    }
	//No other valid GET requests, fail out
    else {
        http_response_code(HTTP_BAD_REQUEST);
    }
} 

/*
POST Request
    - Requires JSON object in body
*/
elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!empty($_POST) && is_string($_POST) && json_decode($_POST, true)) {
        // addNewTransaction($_POST);
    } else {
        http_response_code(HTTP_BAD_REQUEST);
    }
}

function getNotification($type, $user_id) {
	switch ($type) {
		case "friend_request":
			getFriendRequests($user_id);
			break;
		case "approval_request":
			getApprovalRequests($user_id);
			break;
		case "approved_transaction":
			getApprovedTransactions($user_id);
			break;
		default:
			http_response_code(HTTP_BAD_REQUEST);
			break;
	}
}

function getFriendRequests($user_id) {
    global $mysqli;

    //Verify current user ID corresponds to the notifications requested
    if (!verifyUser($user_id)) {
        http_response_code(HTTP_UNAUTHORIZED);
        return;
    }

    $sql = "SELECT  notifications.notification_id AS notification_id,
                    users.username AS username
            FROM notifications
            LEFT JOIN users ON users.user_id = notifications.friend_request_user_id
            WHERE notifications.user_id=? AND notifications.type=\"friend_request\"";

    $friend_requests = $mysqli->execute_query($sql, [$user_id]);

    $friend_requests_array = [];
    for ($i = 0; $i < $friend_requests->num_rows; $i++) {
        array_push($friend_requests_array, $friend_requests->fetch_assoc());
    }

    $json_data = json_encode($friend_requests_array);
    header('Content-Type: application/json');
    echo $json_data;
}

function getApprovalRequests($user_id) {
    global $mysqli;

    //Verify current user ID corresponds to the notifications requested
    if (!verifyUser($user_id)) {
        http_response_code(HTTP_UNAUTHORIZED);
        return;
    }

    $sql = "SELECT  notifications.notification_id AS notification_id,
    				transaction.name AS name
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

function getApprovedTransactions($user_id) {
    global $mysqli;

    //Verify current user ID corresponds to the notifications requested
    if (!verifyUser($user_id)) {
        http_response_code(HTTP_UNAUTHORIZED);
        return;
    }

    $sql = "SELECT  notifications.notification_id AS notification_id,
    				transaction.name AS name
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

function removeNotification($notification_id) {
    global $mysqli;

    /********************We already verify this from all function entry points****************/
    // //Verify current user ID corresponds to the notification
    // $sql = "SELECT user_id
    //         FROM notifications
    //         WHERE notification_id=?";

    // $user_id = $mysqli->execute_query($sql, [$notification_id])->fetch_assoc()["user_id"];

    // if (!verifyUser($user_id)) {
    //     http_response_code(HTTP_UNAUTHORIZED);
    //     return;
    // }

    $sql = "DELETE FROM notifications
            WHERE notification_id=?";

    $mysqli->execute_query($sql, [$notification_id]);
}

?>
