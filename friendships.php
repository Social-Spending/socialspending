<?php

include_once("templates/connection.php");
include_once("templates/cookies.php");
include_once("templates/constants.php");
include_once("notifications.php");

/*
POST Request
    - Requires JSON object in body
*/
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $_POST = file_get_contents("php://input");

    if (!empty($_POST) && is_string($_POST) && json_decode($_POST, true)) {
        $json = json_decode($_POST, true);

        if ($json["operation"] == "accept" && isset($json["notification_id"]))
            acceptFriendRequest($json["notification_id"]);
        elseif ($json["operation"] == "reject" && isset($json["notification_id"]))
            rejectFriendRequest($json["notification_id"]);
        elseif ($json["operation"] == "add" && isset($json["username"]))
            sendFriendRequest($json["username"]);
        elseif ($json["operation"] == "remove" && isset($json["username"]))
            removeFriend($json["username"]);
        else
            http_response_code(HTTP_BAD_REQUEST);
    } else {
        http_response_code(HTTP_BAD_REQUEST);
    }
}

function sendFriendRequest($username) {
    global $mysqli;

    //Validate the user
    $user_id = intval(validateSessionID());
    if ($user_id == 0) {
        http_response_code(HTTP_UNAUTHORIZED);
        return;
    }

    //Get the other user's ID
    $sql = "SELECT user_id
            FROM users
            WHERE username=?";
    
    $result = $mysqli->execute_query($sql, [$username]);
    if ($result->num_rows == 0) {
        http_response_code(HTTP_BAD_REQUEST);
        return;
    }

    $other_user_id = $result->fetch_assoc()["user_id"];

    //Create notification
    $sql = "INSERT INTO notifications (user_id, type, friend_request_user_id)
            VALUES (?, \"friend_request\", ?)";

    $mysqli->execute_query($sql, [$other_user_id, $user_id]);

    http_response_code(HTTP_OK);
}

function acceptFriendRequest($notification_id) {
    global $mysqli;

    //Verify current user ID corresponds to the notification
    $sql = "SELECT user_id
            FROM notifications
            WHERE notification_id=?";

    $response = $mysqli->execute_query($sql, [$notification_id]);
    if ($response->num_rows == 0) {
        http_response_code(HTTP_BAD_REQUEST);
        return;
    }

    $user_id = $response->fetch_assoc()["user_id"];
    if (!verifyUser($user_id)) {
        http_response_code(HTTP_UNAUTHORIZED);
        return;
    }

    //Perform the operation
    $sql = "INSERT INTO friendships (user_id_1, user_id_2)
            SELECT notifications.user_id, notifications.friend_request_user_id
            FROM notifications
            WHERE notifications.notification_id=?";

    $mysqli->execute_query($sql, [$notification_id]);

    removeNotification($notification_id);

    http_response_code(HTTP_OK);
}

function rejectFriendRequest($notification_id) {
    global $mysqli;

    //Verify current user ID corresponds to the notification
    $sql = "SELECT user_id
            FROM notifications
            WHERE notification_id=?";

    $response = $mysqli->execute_query($sql, [$notification_id]);
    if ($response->num_rows == 0) {
        http_response_code(HTTP_BAD_REQUEST);
        return;
    }

    $user_id = $response->fetch_assoc()["user_id"];
    if (!verifyUser($user_id)) {
        http_response_code(HTTP_UNAUTHORIZED);
        return;
    }

    //Perform the operation
    removeNotification($notification_id);

    http_response_code(HTTP_OK);
}

function removeFriend($username) {
    global $mysqli;

    $cur_user_id = intval(validateSessionID());

    if ($cur_user_id == 0) {
        http_response_code(HTTP_UNAUTHORIZED);
        return;
    }

    //Find user ID for friend
    $sql = "SELECT user_id
            FROM users
            WHERE username=?";

    $result = $mysqli->execute_query($sql, [$username]);
    if ($result->num_rows == 0) {
        http_response_code(HTTP_BAD_REQUEST);
        return;
    }

    $friend_user_id = $result->fetch_assoc()["user_id"];

    //Perform the operation
    $sql = "DELETE FROM friendships
            WHERE (user_id_1=? OR user_id_1=?) AND (user_id_2=? OR user_id_2=?)";

    $mysqli->execute_query($sql, [$cur_user_id, $friend_user_id, $cur_user_id, $friend_user_id]);

    http_response_code(HTTP_OK);
}

?>
