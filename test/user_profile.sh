#! /bin/bash
SERVER="http://localhost"
USER_PROFILE_ENDPOINT="/user_profile.php"
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


# get cookie from login
echo "Getting Cookie"
curl -v -c cookiefile -F user=${USERNAME} -F password=${PASSWORD} ${SERVER}"/login.php"
print_delimiter

# get current user's profile
echo "Getting Current user's profile"
curl -v -b cookiefile -G ${SERVER}${USER_PROFILE_ENDPOINT}
print_delimiter

echo "Getting user's profile for user_id 1"
curl -v -b cookiefile -d "user_id=1" -G ${SERVER}${USER_PROFILE_ENDPOINT}
print_delimiter

echo "Getting user's profile for user_id 1"
curl -v -b cookiefile -d "user_id=1" -d "limit=1" -G ${SERVER}${USER_PROFILE_ENDPOINT}
print_delimiter

echo "Getting user's profile for Vanquisher"
curl -v -b cookiefile -d "user=Vanquisher" -G ${SERVER}${USER_PROFILE_ENDPOINT}
print_delimiter

echo "Getting user's profile for tester1"
curl -v -b cookiefile -d "user=tester1" -G ${SERVER}${USER_PROFILE_ENDPOINT}
print_delimiter
