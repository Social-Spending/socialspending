<?php

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
        write_log("Signatures do not match");
        exit(0);
    }

}

function write_log($msg)
{
    file_put_contents('./repo_pull.log', $msg."\n", FILE_APPEND);
}

// run a command and check if it ran successfully
// if the command failed to run, write its output to log and exit
function execute_command($cmd)
{
    // redirect stderr to stdout for all commands
    $cmd = $cmd. ' 2>&1';
    $output = array();
    $rv = 0;
    write_log($cmd);
    exec($cmd, $output, $rv);
    // write command output to log
    foreach ($output as $line)
    {
        write_log($line);
    }
    if ($rv)
    {
        write_log('Failed with status code '.$rv);
        exit(0);
    }
}


// Immediately send a response, do all processing in background
// Github requires a response in <10 seconds
// start output buffer
ob_start();
echo 'Received';
$size = ob_get_length();
// Disable compression (in case content length is compressed).
header("Content-Encoding: none");
header("Content-Length: {$size}");
// Close the connection and respond with 202:Accepted status code
header("Connection: close", true, 202);
// Flush all output.
ob_end_flush();
@ob_flush();
flush();
// Close current session (if it exists).
if(session_id()) session_write_close();


write_log('-----------New Webhook Job-----------');

// this should only be accessed by POST from github
const HEADER_SIGNATURE_NAME='HTTP_X_HUB_SIGNATURE_256';
if ($_SERVER['REQUEST_METHOD'] != 'POST' || !isset($_SERVER[HEADER_SIGNATURE_NAME]))
{
    write_log("Request must be POST with ".HEADER_SIGNATURE_NAME." in the header");
    exit(0);
}

// get string representation of body and verify
$payload = file_get_contents('php://input');
verify_signature($payload);


// jenky code to choose if this file is in the dev or prod endpoint
$branch = 'main';
// split the servername into an array of tokens separated by .
$servernameArray = explode('.', $_SERVER['SERVER_NAME']);
if ($servernameArray[0] == 'dev')
{
    $branch = 'develop';
}
write_log('Host branch: '.$branch);

// check if the push updated this branch
$jsonBody = json_decode($payload, true);
// ref looks like 'refs/heads/develop'
// split it up by '/' and take the last one
$refs = explode('/', $jsonBody['ref']);
$pushedBranch = end($refs);
write_log('Pushed branch was: '. $pushedBranch);
// stop if pushed branch was not the desired branch
if ($pushedBranch != $branch)
{
    exit(0);
}

// pull changes and override local changes
execute_command('git fetch origin '.$branch);
execute_command('git reset --hard origin/'.$branch);
execute_command('cd react_source && ./compile.sh');

// re-create database
// only do this on dev
if ($branch == 'develop')
{
    include_once('./templates/connection.php');
    if (!$mysqli->query('DROP TABLES IF EXISTS cookies, friendships, debts, transaction_participants, group_members, group_transactions, notifications, groups, users, transactions;'))
    {
        write_log('Failed to drop all tables');
        write_log($mysqli->error);
        exit(0);
    }
    $dbSQL = file_get_contents('database.sql');
    // returns false only if first one fails
    if (!$mysqli->multi_query($dbSQL))
    {
        write_log('Failed to re-create database');
        write_log($mysqli->error);
        exit(0);
    }
    // call next_result to check subsequent queries
    while($mysqli->more_results())
    {
        if (!$mysqli->next_result())
        {
            write_log('Failed to re-create database');
            write_log($mysqli->error);
            exit(0);
        }
    }

}


write_log('Pull successful');
?>
