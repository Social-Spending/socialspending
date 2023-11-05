#! /bin/bash
SERVER="http://dev.localhost.local"
DELIMITER="--------------------------------------------------------------------------"

# send webook, header and body are in separate files
echo "Sending Simulated Push Webhook"
curl -v -c cookiefile -b cookiefile -d @example_github_webhook_body.json -H @example_github_webhook_headers.txt ${SERVER}"/repo_pull.php"
# newline
echo ""
echo ${DELIMITER}