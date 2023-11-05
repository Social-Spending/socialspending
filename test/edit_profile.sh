#! /bin/bash
SERVER="http://localhost"
USER_PROFILE_ENDPOINT="/user_profile.php"
USERNAME="tester2"
NEW_USERNAME="tester2edit"
PASSWORD="password"
NEW_PASSWORD="pass"

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


# get cookie from login
echo "Getting Cookie"
curl -v -c cookiefile -F user=${USERNAME} -F password=${PASSWORD} ${SERVER}"/login.php"
print_delimiter

# edit username, email, and password
echo "Updating username, email, and password"
curl -v -b cookiefile -F "username=tester2edit" -F "email=tester2edit@example.com" -F "password=${NEW_PASSWORD}" ${SERVER}${USER_PROFILE_ENDPOINT}
print_delimiter

# get user profile
echo "Getting Current user's profile"
curl -v -b cookiefile -G ${SERVER}${USER_PROFILE_ENDPOINT}
print_delimiter

# try new login
echo "Getting Cookie"
curl -v -c cookiefile -F user=${NEW_USERNAME} -F password=${NEW_PASSWORD} ${SERVER}"/login.php"
print_delimiter
