<?php
include_once("cookies.php");
include_once("../notifications.php");

/*
Returns the notification ID for a friend request given the user ID of the sender and receiver
*/
function getRequestNotificationID($sender_id, $receiver_id) {
    global mysqli;

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
