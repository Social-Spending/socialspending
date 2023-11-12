<?php

include_once('templates/connection.php');
include_once('templates/cookies.php');

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

?>