#! /bin/bash
SERVER="http://localhost"
USERNAME="Soap_Ninja"
PASSWORD="password"

# get cookie from login
echo "Getting Cookie"
curl -v -c cookiefile -b cookiefile -F user=${USERNAME} -F password=${PASSWORD} ${SERVER}"/login.php"
# newline
echo ""

# test creating group
