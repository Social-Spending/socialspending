<?php

include_once("templates/connection.php");
include_once("templates/cookies.php");
include_once("templates/constants.php");

/*
GET Request
    - Param 1 = "user_id"
        * Returns all transactions associated with a given user
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
elseif ($_SERVER["REQUEST_METHOD"] == "POST") 
{
    // if (!empty($_POST)) 
    // {
    //     if (is_string($_POST) && json_decode($_POST, true)) {
    //         addNewTransaction($_POST);
    //     }
    // }
    http_response_code(HTTP_BAD_REQUEST);
}

function getNotification($type, $user_id) {
	switch ($type) {
		case "friend_requests":
			getFriendRequests($user_id);
			break;
		case "approval_requests":
			getApprovalRequests($user_id);
			break;
		case "approved_transactions":
			getApprovedTransactions($user_id);
			break;
		default:
			http_response_code(HTTP_BAD_REQUEST);
			break;
	}
}

function getFriendRequests($user_id) {
    global $mysqli;

    $sql = "SELECT users.username AS username
            FROM notifications
            LEFT JOIN users ON users.user_id = notifications.friend_request_user_id
            WHERE notifications.user_id=? AND notifications.type=\"friend_request\"";

    $friend_requests = $mysqli->execute_query($sql, [$user_id]);

    $json_data = json_encode($friend_requests->fetch_all());
    header('Content-Type: application/json');
    echo $json_data;
}

function getApprovalRequests($user_id) {

}

function getApprovedTransactions($user_id) {

}

function acceptFriendRequest($notification_id) {

}

function rejectFriendRequest($notification_id) {

}

?>
