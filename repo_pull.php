<?php

// this should only be accessed by POST from github
const HEADER_SIGNATURE_NAME='HTTP_X_HUB_SIGNATURE_256';
if ($_SERVER['REQUEST_METHOD'] != 'POST' || !isset($_POST[HEADER_SIGNATURE_NAME]))
{
    echo "Request must be POST with ".HEADER_SIGNATURE_NAME." in the header";
    http_response_code(400);
    exit(0);
}

// function to verify the signature, so that we know this came from github
function verify_signature($payload)
{
    $secret = getenv('GITHUB_WEBHOOK_SECRET');
    $signature = 'sha256=' . hash_hmac('sha256', $payload, $secret);
    if ($_POST[HEADER_SIGNATURE_NAME] != $signature)
    {
        echo "Signatures do not match";
        http_response_code(403);
        exit(0);
    }

}

$payload = json_decode(stream_get_contents(STDIN));
verify_signature($payload);

echo "Pulling main";
`git pull`;
echo "Compiling react";
`cd react_source && ./compile.sh`;
echo "Pull successful";
?>
