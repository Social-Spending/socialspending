#! /bin/bash
SERVER="http://localhost"
GROUP_ENDPOINT="groups.php"
USERNAME="Soap_Ninja"
PASSWORD="password"

DELIMITER="--------------------------------------------------------------------------"

print_delimiter()
{
    # newline
    echo ""
    echo ${DELIMITER}
}

wait()
{
    echo "Press ENTER to continue, or type 'quit' to quit"
    read TEMP
    if [ "${TEMP}" == "quit" ]
    then
        exit 0
    fi
}

display_groups()
{
    # get groups
    echo "Getting Groups"
    curl -v -b cookiefile ${SERVER}"/"${GROUP_ENDPOINT}
    print_delimiter
}

# get cookie from login
echo "Getting Cookie"
curl -v -c cookiefile -b cookiefile -F user=${USERNAME} -F password=${PASSWORD} ${SERVER}"/login.php"
print_delimiter

# test getting groups
display_groups

# get groups brief
echo "Getting Groups Brief"
curl -v -b cookiefile -G -d "brief" ${SERVER}"/"${GROUP_ENDPOINT}
print_delimiter
wait

# get groups info nodebts
echo "Getting Groups info nodebts"
curl -v -b cookiefile -d "nodebts" -G ${SERVER}"/"${GROUP_ENDPOINT}
print_delimiter
wait

# get groups info brief and nodebts
echo "Getting Groups info brief nodebts"
curl -v -b cookiefile -d "brief" -d "nodebts" -G ${SERVER}"/"${GROUP_ENDPOINT}
print_delimiter
wait


# get specific group info for a group ths user is not a member of
echo "Getting info of Group that does not exist"
curl -v -b cookiefile -d "groupID=100" -G ${SERVER}"/"${GROUP_ENDPOINT}
print_delimiter
wait


# attempt to get without sending cookie; should return 401
echo "Getting Groups without Session ID"
curl -v ${SERVER}"/"${GROUP_ENDPOINT}
print_delimiter
wait

# create groups
echo "Creating Group 1"
curl -v -b cookiefile ${SERVER}"/"${GROUP_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"operation\":\"create\", \"group_name\":\"Test Group 1\", \"members\":[{\"user\":\"Roasted715Jr\"}, {\"user_id\":3}]}"
print_delimiter

echo "Creating Group 2"
curl -v -b cookiefile ${SERVER}"/"${GROUP_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"operation\":\"create\", \"group_name\":\"Test Group 2\", \"members\":[{\"user\":\"Roasted715Jr\"}, {\"user_id\":3}]}"
print_delimiter

display_groups
wait

# get user to input the group IDs of the new groups
echo "Enter the Group ID of one new group:"
read GID1
echo "Enter the Group ID of the other new group:"
read GID2


# get specific group info
echo "Getting specific info for Group "${GID1}
curl -v -b cookiefile -d "groupID="${GID1} -G ${SERVER}"/"${GROUP_ENDPOINT}
print_delimiter

# get specific group info brief
echo "Getting specific info for Group "${GID1}" Brief"
curl -v -b cookiefile -d "groupID="${GID1} -d "brief" -G ${SERVER}"/"${GROUP_ENDPOINT}
print_delimiter
wait

# get specific group info nodebts
echo "Getting specific info for Group "${GID1}" nodebts"
curl -v -b cookiefile -d "groupID="${GID1} -d "nodebts" -G ${SERVER}"/"${GROUP_ENDPOINT}
print_delimiter
wait

# get specific group info brief and nodebts
echo "Getting specific info for Group "${GID1}" brief nodebts"
curl -v -b cookiefile -d "groupID="${GID1} -d "brief" -d "nodebts" -G ${SERVER}"/"${GROUP_ENDPOINT}
print_delimiter
wait

# kick users
echo "Kicking user by username from Group "${GID2}
curl -v -b cookiefile ${SERVER}"/"${GROUP_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"operation\":\"kick_user\", \"group_id\":"${GID2}", \"user\":\"Roasted715Jr\"}"
print_delimiter
display_groups
wait

echo "Kicking user by UID from Group "${GID2}
curl -v -b cookiefile ${SERVER}"/"${GROUP_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"operation\":\"kick_user\", \"group_id\":"${GID2}", \"user_id\":3}"
print_delimiter
display_groups
wait

# leave group
echo "Leaving Group "${GID2}
curl -v -b cookiefile ${SERVER}"/"${GROUP_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"operation\":\"leave\", \"group_id\":"${GID2}"}"
print_delimiter
display_groups
echo "Also check phpmyadmin that the group was deleted after no members"
wait

# leave group of which the user is not a member
echo "Leaving Group "${GID2}" when current user is not a member"
curl -v -b cookiefile ${SERVER}"/"${GROUP_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"operation\":\"leave\", \"group_id\":"${GID2}"}"
print_delimiter
wait


# add user to group
echo "Adding member by email to Group "${GID1}
curl -v -b cookiefile ${SERVER}"/"${GROUP_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"operation\":\"add_user\", \"group_id\":"${GID1}", \"user\":\"tester1\"}"
print_delimiter


echo "Adding member by user ID to Group "${GID1}
curl -v -b cookiefile ${SERVER}"/"${GROUP_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"operation\":\"add_user\", \"group_id\":"${GID1}", \"user_id\":5}"
print_delimiter
display_groups
wait


# add user to group of which the current user is not a member
echo "Adding member to Group "${GID2}" when current user is not a member"
curl -v -b cookiefile ${SERVER}"/"${GROUP_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"operation\":\"add_user\", \"group_id\":"${GID2}", \"user\":\"tester1\"}"
print_delimiter
wait


# add user that doesn't exist
echo "Adding member to Group "${GID1}" when desired user does not exist"
curl -v -b cookiefile ${SERVER}"/"${GROUP_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"operation\":\"add_user\", \"group_id\":"${GID1}", \"user_id\":100}"
print_delimiter
display_groups
wait


# rename group
echo "Renaming Group "${GID1}
curl -v -b cookiefile ${SERVER}"/"${GROUP_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"operation\":\"rename\", \"group_id\":"${GID1}", \"group_new_name\":\"Test Group 1 renamed\"}"
print_delimiter
display_groups
wait


# rename group of which the user is not a member
echo "Renaming Group "${GID2}" when current user is not a member"
curl -v -b cookiefile ${SERVER}"/"${GROUP_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"operation\":\"rename\", \"group_id\":"${GID2}", \"group_new_name\":\"Test Group 2 renamed\"}"
print_delimiter
wait


# delete group
echo "Deleting Group "${GID1}
curl -v -b cookiefile ${SERVER}"/"${GROUP_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"operation\":\"delete\", \"group_id\":"${GID1}"}"
print_delimiter
display_groups
wait


# delete group of which the user is not a member
echo "Deleting Group "${GID2}" when current user is not a member"
curl -v -b cookiefile ${SERVER}"/"${GROUP_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"operation\":\"delete\", \"group_id\":"${GID2}"}"
print_delimiter
