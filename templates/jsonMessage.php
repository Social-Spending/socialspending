<?php

// print a message encoded in JSON, set header status code, and exit
function returnMessage($msg, $status)
{
    $resultJSON = array();
    $resultJSON['message'] = $msg;
    header('Content-Type: application/json');
    http_response_code($status);
    print(json_encode($resultJSON));
    exit(0);

}

function handleDBError()
{
    returnMessage('Unable to contact database', 500);
}

?>
