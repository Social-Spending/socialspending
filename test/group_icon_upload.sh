#! /bin/bash
SERVER="http://localhost"
GROUP_ICON_UPLOAD_ENDPOINT="group_icon_upload.php"

USERNAME="Soap_Ninja"
PASSWORD="password"
USERNAME2="tester1"
PASSWORD2="password"

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

export PYTHONIOENCODING=utf8

# get cookie from login
echo "Getting Cookie for ${USERNAME}"
curl -v -c cookiefile -F user=${USERNAME} -F password=${PASSWORD} ${SERVER}"/login.php"
print_delimiter


# upload valid static icon to group 2
echo "Uploading valid static icon to group 2"
ICON1_URL=$(curl -s -b cookiefile -F 'group_id=2' -F 'icon=@valid_size_icon.gif' ${SERVER}"/"${GROUP_ICON_UPLOAD_ENDPOINT} | \
    python3 -c "import sys, json; from urllib.parse import unquote; print(unquote(json.load(sys.stdin)['icon_path']))")
echo "Icon is located at ${SERVER}${ICON1_URL}"
print_delimiter

# get group 2 icon
echo "Getting group2 icon"
curl -v -o icon1.gif -G ${SERVER}${ICON1_URL}
print_delimiter


# upload valid animated icon to group 2
echo "Uploading valid animated icon to group 2"
ICON2_URL=$(curl -s -b cookiefile -F 'group_id=2' -F 'icon=@valid_size_animated_icon.gif' ${SERVER}"/"${GROUP_ICON_UPLOAD_ENDPOINT} | \
    python3 -c "import sys, json; print(json.load(sys.stdin)['icon_path'])")
echo "Icon is located at ${SERVER}${ICON2_URL}"
print_delimiter

# get group 2 icon
echo "Getting group2 icon"
curl -v -o icon2.gif -G ${SERVER}${ICON2_URL}
print_delimiter


# upload invalid animated icon to group 2
echo "Uploading invalid animated icon to group 2"
curl -v -b cookiefile -F 'group_id=2' -F 'icon=@invalid_size_animated_icon.gif' ${SERVER}"/"${GROUP_ICON_UPLOAD_ENDPOINT}
print_delimiter


# get cookie for other use
echo "Getting Cookie for ${USERNAME2}"
curl -v -c cookiefile -F user=${USERNAME2} -F password=${PASSWORD2} ${SERVER}"/login.php"
print_delimiter

# upload valid static icon to group 2
echo "Uploading valid static icon to group 2 when user is not a member"
curl -v -b cookiefile -F 'group_id=2' -F 'icon=@valid_size_icon.gif' ${SERVER}"/"${GROUP_ICON_UPLOAD_ENDPOINT}
print_delimiter

echo "Check filesystem for fetched icons"
wait

rm -f cookiefile icon1.gif icon2.gif
