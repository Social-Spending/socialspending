<?php

include_once("templates/connection.php");
include_once("templates/cookies.php");
include_once("templates/constants.php");
include_once("notifications.php");
include_once("templates/jsonMessage.php");

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    viewFriends();
}

/*
POST Request
    - Requires JSON object in body
*/
elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
    $_POST = file_get_contents("php://input");

    if (!empty($_POST) && is_string($_POST) && json_decode($_POST, true)) {
        $json = json_decode($_POST, true);

        if (!isset($json["operation"])) {
            returnMessage("Missing parameter 'operation'", HTTP_BAD_REQUEST);
        }

        if ($json["operation"] == "accept" && isset($json["notification_id"]))
            acceptFriendRequest($json["notification_id"]);
        elseif ($json["operation"] == "reject" && isset($json["notification_id"]))
            rejectFriendRequest($json["notification_id"]);
        elseif ($json["operation"] == "add" && isset($json["username"]))
            sendFriendRequest($json["username"]);
        elseif ($json["operation"] == "remove" && isset($json["username"]))
            removeFriend($json["username"]);
        else
            returnMessage("Incorrect operation or missing second parameter", HTTP_BAD_REQUEST);
    } else {
        returnMessage("Invalid POST request", HTTP_BAD_REQUEST);
    }
}

function sendFriendRequest($username) {
    global $mysqli;

    //Validate the user
    $user_id = intval(validateSessionID());
    if ($user_id == 0) {
        returnMessage("Valid session not found for user", HTTP_UNAUTHORIZED);
    }

    //Get the other user's ID
    $sql = "SELECT user_id
            FROM users
            WHERE username=?";
    
    $result = $mysqli->execute_query($sql, [$username]);
    if ($result->num_rows == 0) {
        // http_response_code(HTTP_BAD_REQUEST);
        // return;
        returnMessage("Username " . $username . " not found", HTTP_BAD_REQUEST);
    }

    $other_user_id = $result->fetch_assoc()["user_id"];

    //Create notification
    $sql = "INSERT INTO notifications (user_id, type, friend_request_user_id)
            VALUES (?, \"friend_request\", ?)";

    $mysqli->execute_query($sql, [$other_user_id, $user_id]);

    returnMessage("Success", HTTP_OK);
}

function removeFriend($username) {
    global $mysqli;

    $cur_user_id = intval(validateSessionID());

    if ($cur_user_id == 0) {
        returnMessage("Valid session not found for user", HTTP_UNAUTHORIZED);
    }

    //Find user ID for friend
    $sql = "SELECT user_id
            FROM users
            WHERE username=?";

    $result = $mysqli->execute_query($sql, [$username]);
    if ($result->num_rows == 0) {
        returnMessage("Username " . $username . " not found", HTTP_BAD_REQUEST);
    }

    $friend_user_id = $result->fetch_assoc()["user_id"];

    //Perform the operation
    $sql = "DELETE FROM friendships
            WHERE (user_id_1=? OR user_id_1=?) AND (user_id_2=? OR user_id_2=?)";

    $mysqli->execute_query($sql, [$cur_user_id, $friend_user_id, $cur_user_id, $friend_user_id]);

    returnMessage("Success", HTTP_OK);
}

function viewFriends() {
    global $mysqli;

    $user_id = intval(validateSessionID());
    if ($user_id == 0) {
        returnMessage("Valid session not found for user", HTTP_UNAUTHORIZED);
    }

    $friends_array = [];

    //Find friendships where we are the first user
    $sql = "SELECT users.username, users.user_id
            FROM friendships
            LEFT JOIN users
            ON friendships.user_id_2 = users.user_id
            WHERE user_id_1=?";
    
    $result = $mysqli->execute_query($sql, [$user_id]);

    for ($i = 0; $i < $result->num_rows; $i++) {
        array_push($friends_array, $result->fetch_assoc());
    }

    //Find friendships where we are the second user
    $sql = "SELECT users.username, users.user_id
            FROM friendships
            LEFT JOIN users
            ON friendships.user_id_1 = users.user_id
            WHERE user_id_2=?";
    
    $result = $mysqli->execute_query($sql, [$user_id]);

    for ($i = 0; $i < $result->num_rows; $i++) {
        array_push($friends_array, $result->fetch_assoc());
    }

    $json_data = json_encode($friends_array);
    header('Content-Type: application/json');
    echo $json_data;
    http_response_code(200);
    exit(0);

}

function acceptFriendRequest($notification_id) {
    global $mysqli;

    //Verify current user ID corresponds to the notification
    $sql = "SELECT user_id
            FROM notifications
            WHERE notification_id=?";

    $response = $mysqli->execute_query($sql, [$notification_id]);
    if ($response->num_rows == 0) {
        returnMessage("Notification with ID " . $notification_id . " not found", HTTP_BAD_REQUEST);
    }

    $user_id = $response->fetch_assoc()["user_id"];
    if (!verifyUser($user_id)) {
        returnMessage("Notification does not correspond with logged in user", HTTP_UNAUTHORIZED);
    }

    //Perform the operation
    $sql = "INSERT INTO friendships (user_id_1, user_id_2)
            SELECT notifications.user_id, notifications.friend_request_user_id
            FROM notifications
            WHERE notifications.notification_id=?";

    $mysqli->execute_query($sql, [$notification_id]);

    removeNotification($notification_id);

    returnMessage("Success", HTTP_OK);
}

function rejectFriendRequest($notification_id) {
    global $mysqli;

    //Verify current user ID corresponds to the notification
    $sql = "SELECT user_id
            FROM notifications
            WHERE notification_id=?";

    $response = $mysqli->execute_query($sql, [$notification_id]);
    if ($response->num_rows == 0) {
        returnMessage("Notification with ID " . $notification_id . " not found", HTTP_BAD_REQUEST);
    }

    $user_id = $response->fetch_assoc()["user_id"];
    if (!verifyUser($user_id)) {
        returnMessage("Notification does not correspond with logged in user", HTTP_UNAUTHORIZED);
    }

    //Perform the operation
    removeNotification($notification_id);

    returnMessage("Success", HTTP_OK);
}

?>
