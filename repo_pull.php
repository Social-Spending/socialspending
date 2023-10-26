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


// jenky code to choose if this file is in the dev or prod endpoint
$branch = 'main';
// split the servername into an array of tokens separated by .
$servernameArray = explode('.', $_SERVER['SERVER_NAME']);
if ($servernameArray[0] == 'dev')
{
    $branch = 'develop';
}

// get string representation of body and verify
$payload = file_get_contents('php://input');
verify_signature($payload);

// pull changes and override local changes

echo 'Pulling '.$branch;
$output = null;
$rv = 0;
if (!exec('git fetch origin '.$branch.' && git reset --hard origin/'.$branch, $output, $rv) || $rv)
{
    // fail if exec returned false or the commmands returned non-zero status code
    echo 'Failed to pull from Github';
    http_response_code(500);
    exit(0);
}
echo 'Compiling react';
// for some reason env vars are not being passed to exec()?
$rv = 0;
if (!exec('cd react_source && ./compile.sh', $output, $rv) || $rv)
{
    // fail if exec returned false or the command returned non-zero satus code
    echo 'Failed to Compile React';
    http_response_code(500);
    exit(0);
}

echo "Pull successful";
?>
