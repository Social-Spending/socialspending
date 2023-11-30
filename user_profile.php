<?php
/*
    Request Types:
    - GET:  Get information about a user's profile
        - Request:
            - Headers:
                - cookies: session_id=***
            - URL Parameters:
                - user_id=<USER ID>
                - user=<USERNAME/EMAIL>
                - limit=<LIMIT>
                user is an optional username or email of a given user.
                user_id and user are optional.
                    If neither are specified, return the profile for the current user.
                    If either are specified, return the profile matching the specified user.
                    If both are specified, return the profile matching the specified user_id.
                limit is the most number of groups or transactions to include in the response.
                    If not included, the limit will be 5.
        - Response:
            - Status Codes:
                - 200 if current user's information was fetched correctly
                - 400 if request type was invalid or parameters were malformed
                - 401 if session_id cookie is not present or invalid
                - 404 if a user was specified and does not exist
                - 500 if the database could not be reached
            - Content-Type:application/json
            - body: serialized JSON in the following format
                {
                    "message":<RESULT>,
                    "user_id":<USER ID>,
                    "username":<USERNAME>,
                    "email":<USER EMAIL>,
                    "icon_path":<PATH TO ICON FILE | null>,
                    "debt":<DEBT | null>,
                    "is_friend":<true | false>,
                    "is_pending_friend":<true | false>,
                    "friend_request_notification_id":<[FRIEND REQUEST notification_id] | null>,
                    "friend_request_can_approve":<true | false | null>
                    "groups":
                    [
                        {
                            "group_name":<GROUP NAME>,
                            "group_id":<GROUP ID>,
                            "icon_path":<PATH TO ICON FILE>
                        },
                        ...,
                        {}
                    ],
                    "transactions":
                    [
                        {
                            "transaction_id":<TRANSACTION ID>,
                            "name":<TRANSACTION NAME>,
                            "date":<TRANSACTION DATE>,
                            "user_debt":<USER_DEBT>,
                            "is_approved":<0|1>
                        }
                    ]
                }
                <RESULT> is a message explaining the status code to a user.
                <DEBT> is the (positive) amount the current user owes the specified user,...
                    or (negative) amount the specified user owes the current user.
                "groups" is a list of groups the current user has in common with the specified user.
                "transactions" is a list of most recent transactions where the current user and the specified user are both participants.
                <PATH TO ICON FILE> will be a relative path that is url-encoded in utf-8...
                    Before using the value to assemble a URI, pass the value through the decodeURI function (in javascript)
                If "is_friend"==false, "debt" will be null.
                If "is_pending_friend"==false, "friend_request_notification_id" and "friend_request_can_approve" will be null.
                "friend_request_can_approve" indicates if the friend request is directed towards the current user...
                    If "friend_request_can_approve"==false, the current user may cancel the friend request
                    If "friend_request_can_approve"==true, the current user may accept or reject the friend request
    - POST: Update the current user's profile information
        - Request:
            - Headers:
                - cookies: session_id=***
            - Form Body Data:
                - username:<USERNAME>
                - email:<EMAIL>
                - password:<PASSWORD>
                At least one of the form values must be provided
        - Response:
            - Status Codes:
                - 200 if current user's information was updated correctly
                - 400 if request type was invalid or parameters were malformed
                - 401 if session_id cookie is not present or invalid
                - 500 if the database could not be reached
            - Content-Type:application/json
            - body: serialized JSON in the following format
                {
                    "message":<RESULT>
                }
                <RESULT> is a message explaining the status code to a user.
*/

include_once('templates/connection.php');
include_once('templates/cookies.php');
include_once('templates/jsonMessage.php');
include_once('templates/userValidation.php');

function handleGET()
{
    global $mysqli, $_VALIDATE_COOKIE_ERRORNO;

    // user must have valid sessionID
    $currUserID = validateSessionID();
    if ($currUserID == 0)
    {
        // failed to validate cookie, check if it was db error or just invalid cookie
        if ($_VALIDATE_COOKIE_ERRORNO == SESSION_ID_INVALID)
        {
            returnMessage('Invalid session_id cookie', 401);
        }
        handleDBError();
    }

    // get limit
    $limit = 5;
    if (isset($_GET['limit']))
    {
        $limit = (int)($_GET['limit']);
    }

    // get user by user_id
    if (isset($_GET['user_id']))
    {
        // check that user exists
        $profileUserID = $_GET['user_id'];
        $sql = 'SELECT user_id from users WHERE user_id = ?;';
        $result = $mysqli->execute_query($sql, [$profileUserID]);
        // check that query was successful
        if (!$result)
        {
            // query failed, internal server error
            handleDBError();
        }
        // check that user was found
        if ($result->num_rows == 0)
        {
            returnMessage('User with user_id '.$profileUserID.' not found', 404);
        }
    }
    // get user by username/email
    elseif (isset($_GET['user']))
    {
        // user username/email to get userID
        $profileUser = $_GET['user'];
        $sql = 'SELECT user_id from users WHERE username = ? OR email = ?;';
        $result = $mysqli->execute_query($sql, [$profileUser, $profileUser]);
        // check that query was successful
        if (!$result)
        {
            // query failed, internal server error
            handleDBError();
        }
        // check that user was found
        if ($result->num_rows == 0)
        {
            returnMessage('User with username/email '.$profileUser.' not found', 404);
        }
        // add user_id to list of member to add
        $row = $result->fetch_assoc();
        $profileUserID = $row['user_id'];
    }
    // otherwise, get profile of current user
    else
    {
        $profileUserID = $currUserID;
    }


    // get the profile user's info
    $sql = "SELECT u.user_id, u.username, u.email, u.icon_path, COALESCE(SUM(dsum.debt), 0) as debt
            FROM users u
            LEFT JOIN (
                SELECT
                    CASE WHEN debtor = ? THEN creditor ELSE debtor END AS creditor,
                    CASE WHEN debtor = ? THEN amount ELSE -1*amount END AS debt
                FROM debts
                WHERE debtor = ? OR creditor = ?
            ) as dsum ON u.user_id = dsum.creditor
            WHERE u.user_id = ?
            GROUP BY u.user_id;";
    $result = $mysqli->execute_query($sql, [$currUserID, $currUserID, $currUserID, $currUserID, $profileUserID]);
    // check for errors
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }
    // unpack data
    $row = $result->fetch_assoc();
    // $returnArray = array(
    //     'user_id' => $row['user_id'],
    //     'username' => $row['username'],
    //     'email' => $row['email'],
    //     'icon_path' => $row['icon_path'],
    //     'debt' => $row['debt']
    // );
    $returnArray = $row;

    if ($profileUserID != $currUserID)
    {
        // get if these users are friends
        $sql = "SELECT user_id_1, user_id_2
                FROM friendships
                WHERE (user_id_1 = ? AND user_id_2 = ?)
                OR (user_id_1 = ? AND user_id_2 = ?);";
        $result = $mysqli->execute_query($sql, [$profileUserID, $currUserID, $currUserID, $profileUserID]);
        // check for errors
        if (!$result)
        {
            // query failed, internal server error
            handleDBError();
        }
        // check if there was a row, meaning these two are friends
        $returnArray['is_friend'] = $result->num_rows > 0;


        // get if there is an outstanding friend request
        if (!$returnArray['is_friend'])
        {
            // query to check if there is already a friend request
            $sql = "SELECT notification_id, user_id as destination_user_id
                FROM notifications
                WHERE type = 'friend_request'
                AND ((friend_request_user_id = ? AND user_id = ?) OR (friend_request_user_id = ? AND user_id = ?))";
            $result = $mysqli->execute_query($sql, [$currUserID, $profileUserID, $profileUserID, $currUserID]);
            if (!$result)
            {
                handleDBError();
            }
            $returnArray['is_pending_friend'] = $result->num_rows > 0;
            // if there is a pending friend request, get whether the current user sent it or
            if ($returnArray['is_pending_friend'])
            {
                $row = $result->fetch_assoc();
                $returnArray['friend_request_notification_id'] = $row['notification_id'];
                // user can approve if the notification is in the currently logged in user's inbox
                $returnArray['friend_request_can_approve'] = $row['destination_user_id'] == $currUserID;
            }
        }
        else
        {
            $returnArray['is_pending_friend'] = false;
            $returnArray['friend_request_notification_id'] = null;
            $returnArray['friend_request_can_approve'] = null;
        }

        // get groups both users are a member of
        $sql = "SELECT g.group_id, g.group_name, g.icon_path
                FROM group_members gm1
                INNER JOIN group_members gm2 ON gm1.group_id = gm2.group_id AND gm1.user_id <> gm2.user_id
                INNER JOIN groups g ON gm2.group_id = g.group_id
                WHERE gm1.user_id = ? AND gm2.user_id = ?
                LIMIT ?;";
        $result = $mysqli->execute_query($sql, [$profileUserID, $currUserID, $limit]);
        // check for errors
        if (!$result)
        {
            // query failed, internal server error
            handleDBError();
        }
        // unpack data
        $groups = array();
        while ($row = $result->fetch_assoc())
        {
            $groups[] = $row;
        }
        $returnArray['groups'] = $groups;

        // get transactions common to both users
        $sql = "SELECT t.transaction_id, t.name, t.date, tp1.amount as user_debt,
                    CASE WHEN COUNT(tp3.user_id) = SUM(tp3.has_approved)
                        THEN 1
                        ELSE 0
                    END AS is_approved
                FROM transaction_participants tp1
                INNER JOIN transaction_participants tp2 ON tp1.transaction_id = tp2.transaction_id AND tp1.user_id <> tp2.user_id
                INNER JOIN transactions t ON t.transaction_id = tp1.transaction_id
                INNER JOIN transaction_participants tp3 ON tp3.transaction_id = t.transaction_id
                WHERE tp1.user_id = ? AND tp2.user_id = ?
                GROUP BY t.transaction_id
                ORDER BY t.date DESC
                LIMIT ?;";
        $result = $mysqli->execute_query($sql, [$profileUserID, $currUserID, $limit]);
        // check for errors
        if (!$result)
        {
            // query failed, internal server error
            handleDBError();
        }
        // unpack data
        $transactions = array();
        while ($row = $result->fetch_assoc())
        {
            $transactions[] = $row;
        }
        $returnArray['transactions'] = $transactions;
    }


    // convert result to JSON and return
    $returnArray['message'] = 'Success';
    print(json_encode($returnArray));
    header('Content-Type: application/json', true, 200);
    exit(0);
}

function handlePOST()
{
    global $mysqli, $_VALIDATE_COOKIE_ERRORNO;

    // user must have valid sessionID
    $currUserID = validateSessionID();
    if ($currUserID == 0)
    {
        // failed to validate cookie, check if it was db error or just invalid cookie
        if ($_VALIDATE_COOKIE_ERRORNO == SESSION_ID_INVALID)
        {
            returnMessage('Invalid session_id cookie', 401);
        }
        handleDBError();
    }

    if (isset($_POST["username"]) && $_POST["username"] != "") {
        $newUsername = $_POST["username"];
        // check that username is valid
        if (checkUsername($newUsername)) {
            returnMessage('Username is invalid', 400);
        }

        $sql = "SELECT * FROM users WHERE username = ?";
        $result = $mysqli->execute_query($sql, [$newUsername]);

        if (!$result)
            handleDBError();

        //Check to see if a user with this username exists
        if ($result->num_rows > 0) {
            $result = $result->fetch_assoc();

            //If someone else has the username, return with an error.
            //Otherwise, we don't need to do anything
            if ($result["user_id"] != $currUserID) {
                returnMessage("An account with that username already exists", 400);
            }
        } else {
            $sql = "UPDATE users SET username = ? WHERE user_id = ?;";
            $result = $mysqli->execute_query($sql, [$newUsername, $currUserID]);

            if (!$result)
                handleDBError();
        }
    }

    if (isset($_POST["email"]) && $_POST["email"] != "") {
        $newEmail = $_POST["email"];
        // check that email is valid
        if (checkEmail($newEmail)) {
            returnMessage('Email is invalid', 400);
        }

        $sql = "SELECT * FROM users WHERE email = ?";
        $result = $mysqli->execute_query($sql, [$newEmail]);

        if (!$result)
            handleDBError();

        //Check to see if a user with this email exists
        if ($result->num_rows > 0) {
            $result = $result->fetch_assoc();

            //If someone else has the email, return with an error.
            //Otherwise, we don't need to do anything
            if ($result["user_id"] != $currUserID) {
                returnMessage("An account with that email already exists", 400);
            }
        } else {
            $sql = "UPDATE users SET email = ? WHERE user_id = ?;";
            $result = $mysqli->execute_query($sql, [$newEmail, $currUserID]);

            if (!$result)
                handleDBError();
        }
    }

    if (isset($_POST["password"]) && $_POST["password"] != "") {
        $newPassword = $_POST["password"];
        // check that password is valid
        if (checkPassword($newPassword)) {
            returnMessage('Password is invalid', 400);
        }
        $newPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT);

        $sql = "UPDATE users SET pass_hash = ? WHERE user_id = ?;";
        $result = $mysqli->execute_query($sql, [$newPasswordHash, $currUserID]);

        if (!$result)
            handleDBError();
    }

    returnMessage('Success', 200);

}

// request type must be GET
if ($_SERVER['REQUEST_METHOD'] == 'GET')
{
    handleGET();
}
elseif ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    handlePOST();
}
returnMessage('Invalid request type', 400);

?>
