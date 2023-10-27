<?php
include_once("templates/cookies.php");
include_once("notifications.php");

// /*
// GET Request
//     - Param 1 = "notification_type"
//     - Param 2 = "user_id"
//         * Returns all notifications of a given type directed towards a certain user
// */
// if ($_SERVER["REQUEST_METHOD"] == "GET") {
//     //Check if user_id and a notification type were passed
//     if (isset($_GET["type"]) && isset($_GET["user_id"])) {
// 		getNotification($_GET["type"], $_GET["user_id"]);
//     }
// 	//No other valid GET requests, fail out
//     else {
//         http_response_code(HTTP_BAD_REQUEST);
//     }
// } 

// /*
// POST Request
//     - Requires JSON object in body
// */
// elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
//     if (!empty($_POST) && is_string($_POST) && json_decode($_POST, true)) {
//         // addNewTransaction($_POST);
//     } else {
//         http_response_code(HTTP_BAD_REQUEST);
//     }
// }

/*
Returns the notification ID for a friend request given the user ID of the sender and receiver
*/
function getRequestNotificationID($sender_id, $receiver_id) {
    global $mysqli;

    $sql = "SELECT notification_id
            FROM notifications
            WHERE user_id=? AND friend_request_user_id=?";

    $resposne = $mysqli->execute_query($sql, [$receiver_id, $sender_id]);

    return $response->fetch_assoc()["notification_id"];
}

function acceptFriendRequest($notification_id) {
    global $mysqli;

    //Verify current user ID corresponds to the notification
    $sql = "SELECT user_id
            FROM notifications
            WHERE notification_id=?";

    $user_id = $mysqli->execute_query($sql, [$notification_id])->fetch_assoc()["user_id"];

    if (!verifyUser($user_id)) {
        http_response_code(HTTP_UNAUTHORIZED);
        return;
    }

    $sql = "INSERT INTO friendships (user_id_1, user_id_2)
            SELECT notifications.user_id, notifications.friend_request_user_id
            FROM notifications
            WHERE notifications.notification_id=?";

    $response = $mysqli->execute_query($sql, [$notification_id]);

    removeNotification($notification_id);
}

?>
