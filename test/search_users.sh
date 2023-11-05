#! /bin/bash
SERVER="http://localhost"
SEARCH_ENDPOINT="search_users.php"
USERNAME="Soap_Ninja"
PASSWORD="password"

DELIMITER="--------------------------------------------------------------------------"

print_delimiter()
{
    # newline
    echo ""
    echo ${DELIMITER}
}

# get cookie from login
echo "Getting Cookie"
curl -v -c cookiefile -b cookiefile -F user=${USERNAME} -F password=${PASSWORD} ${SERVER}"/login.php"
print_delimiter

# search for 'matthew'
echo "Search for 'matthew'"
curl -v -b cookiefile ${SERVER}"/"${SEARCH_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"search_term\":\"matthew\"}"
print_delimiter

# search for 'soap'
echo "Search for 'soap'"
curl -v -b cookiefile ${SERVER}"/"${SEARCH_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"search_term\":\"soap\"}"
print_delimiter

# search for 'tester'
echo "Search for 'tester'"
curl -v -b cookiefile ${SERVER}"/"${SEARCH_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"search_term\":\"tester\"}"
print_delimiter

# search for 'a'
echo "Search for 'a'"
curl -v -b cookiefile ${SERVER}"/"${SEARCH_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"search_term\":\"a\"}"
print_delimiter

# search for 'asdf'
echo "Search for 'asdf'"
curl -v -b cookiefile ${SERVER}"/"${SEARCH_ENDPOINT} -H "Content-Type: application/json" \
    -d "{\"search_term\":\"asdf\"}"
print_delimiter
