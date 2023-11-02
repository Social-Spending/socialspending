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

# remove transient cookie using signout
echo "Removing Transient Cookie using signout"
curl -v -c cookiefile -b cookiefile -G ${SERVER}"/signout.php"
print_delimiter


# get remembered cookie from login
echo "Getting Remembered Cookie from login"
curl -v -c cookiefile -b cookiefile -F user=${USERNAME} -F password=${PASSWORD} -F remember=true ${SERVER}"/login.php"
print_delimiter

# remove remembered cookie using signout
echo "Removing Remembered Cookie using signout"
curl -v -c cookiefile -b cookiefile -G ${SERVER}"/signout.php"
print_delimiter


# attempt to signout with cookie not assigned by database
echo "localhost	FALSE	/	FALSE	1701483888	session_id	3a5d5c82836646e1defa9fbeb2d97b4658df306a" >> cookiefile
echo "Attempting to signout session_id not assigned by database"
curl -v -c cookiefile -b cookiefile -G ${SERVER}"/signout.php"
print_delimiter

# attempt to signout without session_id
echo "Attempting to signout without session_id"
curl -v -c cookiefile -b cookiefile -G ${SERVER}"/signout.php"
print_delimiter