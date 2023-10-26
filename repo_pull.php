<?php

// this should only be accessed by POST from github
const HEADER_SIGNATURE_NAME='HTTP_X_HUB_SIGNATURE_256';
if ($_SERVER['REQUEST_METHOD'] != 'POST' || !isset($_SERVER[HEADER_SIGNATURE_NAME]))
{
    echo "Request must be POST with ".HEADER_SIGNATURE_NAME." in the header";
    http_response_code(400);
    exit(0);
}

// function to verify the signature, so that we know this came from github
function verify_signature($payload)
{
    // shared secret with this server and github
    $secret = getenv('GITHUB_WEBHOOK_SECRET');
    // calculate HMAC using SHA-256
    $signature = 'sha256=' . hash_hmac('sha256', $payload, $secret);
    // compare calculated hash with expected hash included in the header
    if ($_SERVER[HEADER_SIGNATURE_NAME] != $signature)
    {
        echo "Signatures do not match";
        http_response_code(403);
        exit(0);
    }

}

// get string representation of body and verify
$payload = file_get_contents('php://input');
verify_signature($payload);

// pull changes and override local changes

echo "Pulling main";
`git fetch main && git reset --hard origin/main`;
echo "Compiling react";
`cd react_source && ./compile.sh`;
echo "Pull successful";
?>
