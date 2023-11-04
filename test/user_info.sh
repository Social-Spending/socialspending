#! /bin/bash
SERVER="http://localhost"
USERNAME="Soap_Ninja"
PASSWORD="password"

DELIMITER="--------------------------------------------------------------------------"

print_delimiter()
{
    # newline
    echo ""
    echo ${DELIMITER}
}

# get transient cookie from login
echo "Getting Transient Cookie from login"
curl -v -c cookiefile -b cookiefile -F user=${USERNAME} -F password=${PASSWORD} ${SERVER}"/login.php"
print_delimiter

# get current user information
echo "Getting Current user info"
curl -v -c cookiefile -b cookiefile -G ${SERVER}"/user_info.php"
print_delimiter

# get current user information without session_id
echo "Getting Current user info"
curl -v -G ${SERVER}"/user_info.php"
print_delimiter

# attempt to get current user info with cookie not assigned by database
echo "localhost	FALSE	/	FALSE	1701483888	session_id	3a5d5c82836646e1defa9fbeb2d97b4658df306a" > cookiefile
echo "Attempting to get current user info with session_id not assigned by database"
curl -v -c cookiefile -b cookiefile -G ${SERVER}"/user_info.php"
print_delimiter

# empty cookiefile from erroneous session_id
echo "" > cookiefile