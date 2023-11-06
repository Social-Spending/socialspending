<?php
/*
    Request Types:
    - GET:  Can be used to get information about a group
        DEFAULT operation: get information about all groups for which a user is a member
            - Request:
                - Headers:
                    - cookies: session_id=***
                - URL Parameters:
                    - brief=[true | false]
                    - nodebts=[true | false]
            - Response:
                - Status Codes:
                    - 200 if group information was fetched correctly
                    - 400 if url parameters are invalid
                    - 401 if session_id cookie is not present or invalid
                    - 500 if the database could not be reached
                - Content-Type:application/json
                - body: serialized JSON in the following format
                    {
                        "message":<RESULT>,
                        "groups":
                        [
                            {
                                "group_name":<GROUP NAME>,
                                "group_id":<GROUP ID>,
                                "icon_path":<PATH TO ICON FILE>,
                                "debt":<DEBT>,
                                "members":
                                [
                                    {
                                        "username":<USERNAME>,
                                        "user_id":<USER ID>,
                                        "debt":<DEBT>
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
                                        "user_debt":<USER_DEBT>
                                    },
                                    ...,
                                    {}
                                ]
                            },
                            ...,
                            {}
                        ]
                    }
                    The "members" list does not include the currently logged in user.
                    "debt" is an integer value that is the (positive) amount the user owes or the (negative) amount the user is owed.
                    If `brief=true` in the URL parameters, the "members" and "transactions" nodes are omitted from all groups.
                    If `nodebts=true` in the URL parameters, the "debt" and "transactions" nodes are omitted everywhere.
                    <RESULT> is a message explaining the status code to a user.
                    <USER_DEBT> will be a (positive) amount the user owes for a given transaction or ...
                        the (negative) amount the user is owed from that transaction.
                    <PATH TO ICON FILE> will be a relative path that is url-encoded in utf-8...
                        Before using the value to assemble a URI, pass the value through the decodeURI function (in javascript)
        GROUP INFO operation: get information about a certain group
            - Request:
                - Headers:
                    - cookies: session_id=***
                - URL Parameters:
                    - brief=<true | false>
                    - nodebts=[true | false]
                    - groupID=<GROUP ID>
            - Response:
                - Status Codes:
                    - 200 if group information was fetched correctly
                    - 400 if url parameters are invalid
                    - 401 if session_id cookie is not present or invalid
                    - 404 if the currently logged in user is not a member of the specified group or the group does not exist
                    - 500 if the database could not be reached
                - Content-Type:application/json
                - body: serialized JSON in the following format
                    {
                        "message":<RESULT>,
                        "group_name":<GROUP NAME>,
                        "group_id":<GROUP ID>,
                        "icon_path":<PATH TO ICON FILE>,
                        "debt":<DEBT>,
                        "members":
                        [
                            {
                                "username":<USERNAME>,
                                "user_id":<USER ID>,
                                "debt":<DEBT>
                            },
                            ...,
                            {}
                        ],
                        "transactions":
                        [
                            {
                                "transaction_id":<TRANSACTION ID>,
                                "name":<TRANSACTION NAME>,
                                "user_debt":<USER_DEBT>
                            },
                            ...,
                            {}
                        ]
                    }
                    The "members" list does not include the currently logged in user.
                    "debt" is an integer value that is the (positive) amount the user owes or the (negative) amount the user is owed.
                    If `brief=true` in the URL parameters, the "members" and "transactions" nodes are omitted.
                    If `nodebts=true` in the URL parameters, the "debt" and "transactions" nodes are omitted everywhere.
                    <RESULT> is a message explaining the status code to a user.
                    <USER_DEBT> will be a (positive) amount the user owes for a given transaction or ...
                        the (negative) amount the user is owed from that transaction.
                    <PATH TO ICON FILE> will be a relative path that is url-encoded in utf-8...
                        Before using the value to assemble a URI, pass the value through the decodeURI function (in javascript)
    - POST: Used to perform multiple operations, where the operation is specified by a key provided in JSON
        CREATE operation: create a group and add the given users to the group
            - Request:
                - Headers:
                    - Content-Type: application/json
                    - cookies: session_id=***
                - body: serialized JSON in one of the following formats
                    {
                        "operation":"create",
                        "group_name":<GROUP NAME>,
                        "members":
                        [
                            {
                                "user":<USERNAME/EMAIL>,
                                "user_id":<USER ID>
                            },
                            ...,
                            {}
                        ]
                    }
                    Where either "user":<USERNAME/EMAIL> OR "user_id":<USER ID> are specified for each user.
                    If both username/email and user ID are specified, the user ID will be used.
                    "members" may be omitted or empty, in which case a group will be created with only the currently logged in user.
            - Response:
                - Status Codes:
                    - 200 if user successfully created the group and added all users
                    - 400 if request body is invalid
                    - 401 if session_id cookie is not present or invalid
                    - 404 if one or more specified user(s) does not exist
                    - 500 if the database could not be reached
                - Headers:
                    - Content-Type: application/json
                - body: serialized JSON in the following format
                    {
                        "message":<RESULT>
                    }
                    Where <RESULT> is a message explaining the status code to a user
        ADD_USER operation: add a specified user to the specified group
            - Request:
                - Headers:
                    - Content-Type: application/json
                    - cookies: session_id=***
                - body: serialized JSON in one of the following formats
                    {
                        "operation":"add_user",
                        "group_id":<GROUP ID>,
                        "user":<USERNAME/EMAIL>,
                        "user_id":<USER ID>
                    }
                    And where either "user":<USERNAME/EMAIL> OR "user_id":<USER ID> are specified.
                    If both username/email and user ID are specified, the user ID will be used.
            - Response:
                - Status Codes:
                    - 200 if user was successfully added to the group
                    - 400 if request body is invalid
                    - 401 if session_id cookie is not present or invalid
                    - 404 if currently logged in user is not a member of this group, group does not exist, or user does not exist
                    - 500 if the database could not be reached
                - Headers:
                    - Content-Type: application/json
                - body: serialized JSON in the following format
                    {
                        "message":<RESULT>
                    }
                    Where <RESULT> is a message explaining the status code to a user
        DELETE operation:   delete the specified group
                            only works if the currently logged in user is a member of the group
            - Request:
                - Headers:
                    - Content-Type: application/json
                    - cookies: session_id=***
                - body: serialized JSON in one of the following formats
                    {
                        "operation":"delete",
                        "group_id":<GROUP ID>,
                    }
            - Response:
                - Status Codes:
                    - 200 if group was successfully deleted
                    - 400 if request body is invalid
                    - 401 if session_id cookie is not present or invalid
                    - 404 if currently logged in user is not a member of this group or group does not exist
                    - 500 if the database could not be reached
                - Headers:
                    - Content-Type: application/json
                - body: serialized JSON in the following format
                    {
                        "message":<RESULT>
                    }
                    Where <RESULT> is a message explaining the status code to a user
        RENAME operation:   change the name of the specified group
                            only works if the currently logged in user is a member of the group
            - Request:
                - Headers:
                    - Content-Type: application/json
                    - cookies: session_id=***
                - body: serialized JSON in one of the following formats
                    {
                        "operation":"rename",
                        "group_id":<GROUP ID>,
                        "group_new_name":<NEW GROUP NAME>
                    }
            - Response:
                - Status Codes:
                    - 200 if group was successfully renamed
                    - 400 if request body is invalid
                    - 401 if session_id cookie is not present or invalid
                    - 404 if currently logged in user is not a member of this group or group does not exist
                    - 500 if the database could not be reached
                - Headers:
                    - Content-Type: application/json
                - body: serialized JSON in the following format
                    {
                        "message":<RESULT>
                    }
                    Where <RESULT> is a message explaining the status code to a user
        LEAVE operation:    remove the current user from the specified group, if they are present
            - Request:
                - Headers:
                    - Content-Type: application/json
                    - cookies: session_id=***
                - body: serialized JSON in one of the following formats
                    {
                        "operation":"leave",
                        "group_id":<GROUP ID>,
                    }
            - Response:
                - Status Codes:
                    - 200 if user successfully left the group
                    - 400 if request body is invalid
                    - 401 if session_id cookie is not present or invalid
                    - 404 if currently logged in user is not a member of this group or group does not exist
                    - 500 if the database could not be reached
                - Headers:
                    - Content-Type: application/json
                - body: serialized JSON in the following format
                    {
                        "message":<RESULT>
                    }
                    Where <RESULT> is a message explaining the status code to a user
        KICK_USER operation:    remove the specified user from the specified group, of which
                                the currently logged in user is member
            - Request:
                - Headers:
                    - Content-Type: application/json
                    - cookies: session_id=***
                - body: serialized JSON in one of the following formats
                    {
                        "operation":"kick_user",
                        "group_id":<GROUP ID>,
                        "user":<USERNAME/EMAIL>,
                        "user_id":<USER ID>
                    }
                    And where either "user":<USERNAME/EMAIL> OR "user_id":<USER ID> are specified.
                    If both username/email and user ID are specified, the user ID will be used.
            - Response:
                - Status Codes:
                    - 200 if user was successfully removed from the group
                    - 400 if request body is invalid
                    - 401 if session_id cookie is not present or invalid
                    - 404 if currently logged in user is not a member of this group,
                            group does not exist, or specified user does not exist
                    - 500 if the database could not be reached
                - Headers:
                    - Content-Type: application/json
                - body: serialized JSON in the following format
                    {
                        "message":<RESULT>
                    }
                    Where <RESULT> is a message explaining the status code to a user
*/

include_once('templates/connection.php');
include_once('templates/cookies.php');
include_once('templates/jsonMessage.php');

function handleGET($userID)
{
    global $mysqli;

    // Get URL parameters
    // 'brief' URL param
    $brief = false;
    if (isset($_GET['brief']) && $_GET['brief'] != 'false')
    {
        $brief = true;
    }
    // 'nodebts' URL param
    $nodebts = false;
    if (isset($_GET['nodebts']) && $_GET['nodebts'] != 'false')
    {
        $nodebts = true;
    }
    // 'groupID' param
    if (isset($_GET['groupID']))
    {
        handleGetGroupInfo($userID, $brief, $nodebts);
    }

    // DEFAULT operation, get info about all groups of which the user is a member
    $groupArray = array();
    // make the request
    $sql =  'SELECT g.group_id, g.group_name, g.icon_path FROM groups as g '.
            'INNER JOIN group_members as gm ON gm.group_id = g.group_id '.
            'WHERE gm.user_id = ?;';

    $result = $mysqli->execute_query($sql, [$userID]);
    // check that query was successful
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }

    // add each group to groupArray
    while ($row = $result->fetch_assoc())
    {
        $groupArray[] = $row;
    }

    for ($index = 0; $index < count($groupArray); $index++)
    {
        fillUserBalanceAndMembers($groupArray[$index], $userID, $brief, $nodebts);
    }

    // convert array to JSON and return it
    $returnArray = array();
    $returnArray['message'] = 'Success';
    $returnArray['groups'] = $groupArray;
    print(json_encode($returnArray));
    http_response_code(200);
    exit(0);
}

// function will add the current users' balance, and the members list (if brief==false)
// $group is the associative array for this group, and will be populated with data
// $userID is the user_id of the current user
// $brief indicates whether or not to include the 'members' list
function fillUserBalanceAndMembers(&$group, $userID, $brief, $nodebts)
{
    global $mysqli;

    $groupID = $group['group_id'];
    if ($brief && !$nodebts)
    {
        // just get the current user's balance
        // query to get all debts to/from this user with other people in the group
        $sql =  'SELECT SUM(debt_amount) AS net_debt '.
                'FROM ( '.
                    'SELECT SUM(amount) AS debt_amount '.
                    'FROM debts AS d '.
                    'JOIN group_members as gm ON d.creditor = gm.user_id '.
                    'WHERE d.debtor = ? AND gm.group_id = ? '.
                    'UNION ALL '.
                    'SELECT -SUM(amount) AS debt_amount '.
                    'FROM debts AS d '.
                    'JOIN group_members as gm ON d.debtor = gm.user_id '.
                    'WHERE d.creditor = ? AND gm.group_id = ? '.
                ') AS debt_combined;';
        /*
        $sql =  'SELECT SUM(d.amount) as credits, 0 as debts FROM group_members as gm '.
                'INNER JOIN debts as d ON (d.debtor=gm.user_id AND d.creditor = ?) '.
                'WHERE gm.group_id = ? '.
                'UNION '.
                'SELECT 0 as credits, SUM(d.amount) as debts FROM group_members as gm '.
                'INNER JOIN debts as d ON (d.creditor=gm.user_id AND d.debtor = ?) '.
                'WHERE gm.group_id = ?;';
        */
        $result = $mysqli->execute_query($sql, [$userID, $groupID, $userID, $groupID]);

        // check that query was successful
        if (!$result)
        {
            // query failed, internal server error
            handleDBError();
        }

        // store debt in group array
        if ($row = $result->fetch_assoc())
        {
            $group['debt'] = $row['net_debt'];
        }
        else
        {
            $group['debt'] = 0;
        }
    }
    else
    {
        // get a list of all members and their balances
        // members will start as an associate array indexed by user_id
        $membersArray = array();
        // query to get all members
        $sql =  'SELECT u.user_id, u.username FROM group_members as gm '.
                'INNER JOIN users as u ON u.user_id=gm.user_id '.
                'WHERE gm.group_id = ?;';
        $result = $mysqli->execute_query($sql, [$groupID]);

        // check that query was successful
        if (!$result)
        {
            // query failed, internal server error
            handleDBError();
        }

        while ($row = $result->fetch_assoc())
        {
            if (!$nodebts)
            {
                $row['debt'] = 0;
            }
            $membersArray[$row['user_id']] = $row;
        }

        if (!$nodebts)
        {
            // query to get all debts between members of the group
            $sql =  'SELECT d.creditor, d.debtor, d.amount '.
                    'FROM debts d '.
                    'JOIN group_members gm1 ON d.creditor = gm1.user_id '.
                    'JOIN group_members gm2 ON d.debtor = gm2.user_id '.
                    'WHERE gm1.group_id = ? AND gm2.group_id = ?;';
            /*
            $sql =  'SELECT d.creditor, d.debtor, d.amount FROM group_members as gm '.
                    'INNER JOIN debts as d ON d.debtor=gm.user_id '.
                    'WHERE gm.group_id = ? '.
                    'INTERSECT '.
                    'SELECT d.creditor, d.debtor, d.amount FROM group_members as gm '.
                    'INNER JOIN debts as d ON d.creditor=gm.user_id '.
                    'WHERE gm.group_id = ?;';
            */
            $result = $mysqli->execute_query($sql, [$groupID, $groupID]);

            // check that query was successful
            if (!$result)
            {
                // query failed, internal server error
                handleDBError();
            }

            while ($row = $result->fetch_assoc())
            {
                $membersArray[$row['debtor']]['debt'] += $row['amount'];
                $membersArray[$row['creditor']]['debt'] -= $row['amount'];
            }

            // store balance for current user
            $group['debt'] = $membersArray[$userID]['debt'];

            // brief==false and nodebts=false, also add list of transactions
            fillGroupTransactions($group, $userID);
        }

        // do not include current user as a member
        unset($membersArray[$userID]);

        // convert array to simple indexed array and store with group
        $group['members'] = array_values($membersArray);
    }
}

// function will add the list of transactions linked to this group
// does not check if brief==false, do that before calling this
// $group is the associative array for this group, and will be populated with data
// $userID is the user_id of the current user
function fillGroupTransactions(&$group, $userID)
{
    global $mysqli;

    $groupID = $group['group_id'];

    // query to get all transactions linked to this group
    $sql =  'SELECT t.transaction_id, t.name, t.date, COALESCE(tp.amount, 0) as user_debt '.
            'FROM transactions t '.
            'JOIN group_transactions gt ON t.transaction_id = gt.transaction_id '.
            'LEFT JOIN transaction_participants tp ON tp.user_id = ? AND tp.transaction_id = t.transaction_id '.
            'WHERE gt.group_id = ?;';
    $result = $mysqli->execute_query($sql, [$userID, $groupID]);

    // check that query was successful
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }

    // put all transactions into an array;
    $transactions = array();
    while ($row = $result->fetch_assoc())
    {
        $transactions[] = $row;
    }

    // convert array to simple indexed array and store with group
    $group['transactions'] = array_values($transactions);
}

function handleGetGroupInfo($userID, $brief, $nodebts)
{
    global $mysqli;
    $groupID = $_GET['groupID'];

    // GROUP INFO operation, get info about a specific group, of which the user is a member
    // make the request
    $sql =  'SELECT g.group_id, g.group_name, g.icon_path FROM group_members as gm '.
            'INNER JOIN groups as g ON g.group_id = gm.group_id '.
            'WHERE gm.user_id = ? AND gm.group_id = ?;';

    $result = $mysqli->execute_query($sql, [$userID, $groupID]);
    // check that query was successful
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }

    // check if the group exists
    if ($result->num_rows == 0)
    {
        returnMessage('Group does not exist or user is not a member', 404);
    }

    // get result with group_id and group_name
    $returnArray = $result->fetch_assoc();

    // populate user's balance and maybe members list
    fillUserBalanceAndMembers($returnArray, $userID, $brief, $nodebts);

    // convert result to JSON and return
    $returnArray['message'] = 'Success';
    print(json_encode($returnArray));
    http_response_code(200);
    exit(0);

}

function handlePOST($userID)
{
    // verify that json was set in header
    if ($_SERVER['CONTENT_TYPE'] != 'application/json')
    {
        returnMessage('Request header must have Content-Type: application/json', 400);
    }

    // parse JSON in body
    $body = file_get_contents('php://input');
    $bodyJSON = json_decode($body, true);
    if ($bodyJSON === null)
    {
        returnMessage('Request body has malformed json', 400);
    }

    // execute different functions based on operation
    if ($bodyJSON['operation'] === null)
    {
        returnMessage('Operation not specified in request', 400);
    }

    $operation = $bodyJSON['operation'];
    if ($operation == 'create')
    {
        handleCreate($userID, $bodyJSON);
    }
    elseif ($operation == 'add_user')
    {
        handleAddUser($userID, $bodyJSON);
    }
    elseif ($operation == 'kick_user')
    {
        handleKickUser($userID, $bodyJSON);
    }
    elseif ($operation == 'delete')
    {
        handleDelete($userID, $bodyJSON);
    }
    elseif ($operation == 'rename')
    {
        handleRename($userID, $bodyJSON);
    }
    elseif ($operation == 'leave')
    {
        handleLeave($userID, $bodyJSON);
    }
    returnMessage('Operation '.$operation.' not recognized', 400);

}

function handleCreate($userID, $bodyJSON)
{
    global $mysqli;

    // get new group name
    if ($bodyJSON['group_name'] === null)
    {
        returnMessage('group_name not set', 400);
    }
    $newGroupName = $bodyJSON['group_name'];

    // query to create group
    $sql = 'INSERT INTO groups (group_name) VALUES ( ? );';
    $result = $mysqli->execute_query($sql, [$newGroupName]);
    // check that query was successful
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }

    // get group ID
    $sql = 'SELECT LAST_INSERT_ID();';
    $result = $mysqli->execute_query($sql);
    // check that query was successful
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }
    // get groupID from result
    $groupID = $result->fetch_row()[0];


    // get a list of members to add to this group
    $newMembers = array();
    $newMembers[] = $userID;
    // array users that could not be found
    $usersInvalidJSON = array();
    $usersNotFound = array();
    if ($bodyJSON['members'] !== null)
    {
        foreach ($bodyJSON['members'] as $newMember)
        {
            // add user by user_id
            if ($newMember['user_id'] !== null)
            {
                // check that this user exists
                $userID = $newMember['user_id'];
                $sql = 'SELECT user_id from users WHERE user_id = ?;';
                $result = $mysqli->execute_query($sql, [$userID]);
                // check that query was successful
                if (!$result)
                {
                    // query failed, internal server error
                    handleDBError();
                }
                // check that user was found
                if ($result->num_rows == 0)
                {
                    $usersNotFound[] = $newMember;
                }
                // add user_id to list of member to add
                $row = $result->fetch_assoc();
                $newMembers[] = $row['user_id'];
            }
            // add user by username/email
            elseif ($newMember['user'] !== null)
            {
                // user username/email to get userID
                $user = $newMember['user'];
                $sql = 'SELECT user_id from users WHERE username = ? OR email = ?;';
                $result = $mysqli->execute_query($sql, [$user, $user]);
                // check that query was successful
                if (!$result)
                {
                    // query failed, internal server error
                    handleDBError();
                }
                // check that user was found
                if ($result->num_rows == 0)
                {
                    $usersNotFound[] = $newMember;
                }
                // add user_id to list of member to add
                $row = $result->fetch_assoc();
                $newMembers[] = $row['user_id'];
            }
            else
            {
                // neither 'user' nor 'user_id' was specified
                $usersInvalidJSON[] = $newMember;
            }
        }
    }


    // now add the members
    foreach ($newMembers as $userIDToAdd)
    {
        insertGroupMembership($groupID, $userIDToAdd);
    }

    // print users that with malformed JSON
    $numUsersInvalid = count($usersInvalidJSON);
    if ($numUsersInvalid > 0)
    {
        $usersInvalidString = 'Missing \'user\' or \'user_id\' key for users: ';
        for ($index = 0; $index < $numUsersInvalid; $index++)
        {
            // append this use JSON that could not be found
            $usersInvalidString = $usersInvalidString.json_encode($usersInvalidJSON[$index]);
            // if not the last entry, also append a comma
            if ($index != $numUsersInvalid - 1)
            {
                $usersInvalidString = $usersInvalidString.', ';
            }
        }
        returnMessage($usersInvalidString, 400);
    }

    // print users that could not be found
    $numUsersNotFound = count($usersNotFound);
    if ($numUsersNotFound > 0)
    {
        $usersNotFoundString = 'Could Not find the following users: ';
        for ($index = 0; $index < $numUsersNotFound; $index++)
        {
            // append this use JSON that could not be found
            $usersNotFoundString = $usersNotFoundString.json_encode($usersNotFound[$index]);
            // if not the last entry, also append a comma
            if ($index != $numUsersNotFound - 1)
            {
                $usersNotFoundString = $usersNotFoundString.', ';
            }
        }
        returnMessage($usersNotFoundString, 404);
    }

    // otherwise, success
    returnMessage('Success', 200);
}

function insertGroupMembership($groupID, $userID)
{
    global $mysqli;
    $sql = 'INSERT INTO group_members (group_id, user_id) VALUES (?, ?);';
    $result = $mysqli->execute_query($sql, [$groupID, $userID]);
    // check that query was successful
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }
}

// verify that a group exists and that the given user is a member
// send an error response if group not found or user is not a member
function verifyGroupAndUserIDs($userID, $groupID)
{
    global $mysqli;
    // check that this group exists and user is a member
    $sql =  'SELECT gm.group_id FROM group_members as gm '.
            'WHERE gm.user_id = ? AND gm.group_id = ?;';
    $result = $mysqli->execute_query($sql, [$userID, $groupID]);
    // check that query was successful
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }
    // check that group was found
    if ($result->num_rows == 0)
    {
        returnMessage('Group with group_id '.$groupID.' doesn\'t exist or user is not a member.', 404);
    }
}

// given the request body as a json object, return the specified group ID
// send an error response if group_id was not given
function getGroupIDFromJSON($bodyJSON)
{
    // get new group_id
    if ($bodyJSON['group_id'] === null)
    {
        returnMessage('group_id not set', 400);
    }
    return $bodyJSON['group_id'];
}

// given the request body as a json object, return the specified user
// send an error response if the user is not specified or the user or user does not exist
function getSpecifiedUserFromJSON($bodyJSON)
{
    global $mysqli;

    // get user by user_id
    if ($bodyJSON['user_id'] !== null)
    {
        // check that this user exists
        $userID = $bodyJSON['user_id'];
        $sql = 'SELECT user_id from users WHERE user_id = ?;';
        $result = $mysqli->execute_query($sql, [$userID]);
        // check that query was successful
        if (!$result)
        {
            // query failed, internal server error
            handleDBError();
        }
        // check that user was found
        if ($result->num_rows == 0)
        {
            returnMessage('User with user_id '.$userID.' not found', 404);
        }
        return $userID;
    }
    // get user by username/email
    elseif ($bodyJSON['user'] !== null)
    {
        // user username/email to get userID
        $user = $bodyJSON['user'];
        $sql = 'SELECT user_id from users WHERE username = ? OR email = ?;';
        $result = $mysqli->execute_query($sql, [$user, $user]);
        // check that query was successful
        if (!$result)
        {
            // query failed, internal server error
            handleDBError();
        }
        // check that user was found
        if ($result->num_rows == 0)
        {
            returnMessage('User with username/email '.$user.' not found', 404);
        }
        // add user_id to list of member to add
        $row = $result->fetch_assoc();
        return $row['user_id'];
    }

    // neither 'user' nor 'user_id' was specified
    returnMessage('Missing \'user_id\' or \'user\'', 400);
}

function handleAddUser($userID, $bodyJSON)
{
    global $mysqli;

    $groupID = getGroupIDFromJSON($bodyJSON);
    verifyGroupAndUserIDs($userID, $groupID);
    $userIDToAdd = getSpecifiedUserFromJSON($bodyJSON);

    // add user
    insertGroupMembership($groupID, $userIDToAdd);

    // otherwise, success
    returnMessage('Success', 200);
}

function handleKickUser($userID, $bodyJSON)
{
    global $mysqli;

    $groupID = getGroupIDFromJSON($bodyJSON);
    verifyGroupAndUserIDs($userID, $groupID);

    $userIDToRemove = getSpecifiedUserFromJSON($bodyJSON);

    // remove user from group
    deleteGroupMembership($groupID, $userIDToRemove);

    checkIfGroupIsEmpty($groupID);

    // otherwise, success
    returnMessage('Success', 200);
}

function deleteGroupMembership($groupID, $userID)
{
    global $mysqli;
    // delete group membership
    $sql = 'DELETE FROM group_members WHERE (group_id, user_id) = (?, ?);';
    $result = $mysqli->execute_query($sql, [$groupID, $userID]);
    // check that query was successful
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }
}

function deleteGroup($groupID)
{
    global $mysqli;

    // delete group
    $sql = 'DELETE FROM groups WHERE group_id = ?;';
    $result = $mysqli->execute_query($sql, [$groupID]);
    // check that query was successful
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }
}

// check if, after removing a user from a group, it has no members.
// if the group has no members, delete it
function checkIfGroupIsEmpty($groupID)
{
    global $mysqli;
    // get count of users
    $sql = 'SELECT COUNT(user_id) FROM group_members WHERE group_id = ?;';
    $result = $mysqli->execute_query($sql, [$groupID]);
    // check that query was successful
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }
    $numMembers = $result->fetch_row()[0];

    if ($numMembers == 0)
    {
        // no members in this group, delete it
        deleteGroup($groupID);
    }
}

function handleDelete($userID, $bodyJSON)
{
    global $mysqli;

    $groupID = getGroupIDFromJSON($bodyJSON);
    verifyGroupAndUserIDs($userID, $groupID);

    deleteGroup($groupID);

    // otherwise, success
    returnMessage('Success', 200);

}

function handleRename($userID, $bodyJSON)
{
    global $mysqli;

    $groupID = getGroupIDFromJSON($bodyJSON);
    verifyGroupAndUserIDs($userID, $groupID);
    // get new group name
    if ($bodyJSON['group_new_name'] === null)
    {
        returnMessage('group_new_name not set', 400);
    }
    $newGroupName = $bodyJSON['group_new_name'];

    // update group name
    $sql = 'UPDATE groups SET group_name = ? WHERE group_id = ?;';
    $result = $mysqli->execute_query($sql, [$newGroupName, $groupID]);
    // check that query was successful
    if (!$result)
    {
        // query failed, internal server error
        handleDBError();
    }

    // otherwise, success
    returnMessage('Success', 200);

}

function handleLeave($userID, $bodyJSON)
{
    global $mysqli;

    $groupID = getGroupIDFromJSON($bodyJSON);
    verifyGroupAndUserIDs($userID, $groupID);

    // delete group membership for this user
    deleteGroupMembership($groupID, $userID);

    checkIfGroupIsEmpty($groupID);

    // otherwise, success
    returnMessage('Success', 200);
}

// user must have valid sessionID
$userID = validateSessionID();
if ($userID == 0)
{
    // failed to validate cookie, check if it was db error or just invalid cookie
    if ($_VALIDATE_COOKIE_ERRORNO == SESSION_ID_INVALID)
    {
        returnMessage('Invalid session_id cookie', 401);
    }
    handleDBError();
}

// handle different request types
if ($_SERVER['REQUEST_METHOD'] == 'GET')
{
    handleGET($userID);
}
elseif ($_SERVER['REQUEST_METHOD'] == 'POST')
{
    handlePOST($userID);
}
returnMessage('Request method not supported', 400);
?>
