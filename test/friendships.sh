#! /bin/bash
SERVER="http://localhost"
FRIEND_ENDPOINT="friendships.php"
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

display_friends()
{
    echo "Getting Friends"
    curl -v -b cookiefile ${SERVER}"/"${FRIEND_ENDPOINT}
    print_delimiter
}

# get cookie from login
echo "Getting Cookie"
curl -v -c cookiefile -F user=${USERNAME} -F password=${PASSWORD} ${SERVER}"/login.php"
print_delimiter

# test getting friends
display_friends

# add friend
echo "Adding tester1 as a friend"
curl -v -b cookiefile ${SERVER}"/"${FRIEND_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"operation\":\"add\", \"username\":\"tester1\"}"
print_delimiter

display_friends