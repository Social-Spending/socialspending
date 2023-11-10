<?php

include_once('templates/connection.php');
include_once('templates/cookies.php');
include_once('templates/constants.php');
include_once("templates/jsonMessage.php");


$DKIM_PRIVATE_KEY = "dkim/id_rsa";
$DKIM_DOMAIN = "socialspendingapp.com";
$DKIM_SELECTOR = "s4096";

/*
Forgot Password PHP Endpoint
    POC: njones9

    Primary Functions:  

    Helper Functions:   


    Notes:


    TODO:



    Structure:

        Main entrypoint at the top of file. Called with each endpoint access. 

        Incoming request is triaged and dispatched to functions which exist
        at the bottom of the file.
*/

###################
#                 #
# MAIN ENTRYPOINT #
#                 #
###################

/*
GET Request
    Sends a random email to njones9
*/
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    
    sendEmail();
    return;
} 


function sendEmail() {
    global $DKIM_PRIVATE_KEY, $DKIM_DOMAIN, $DKIM_SELECTOR;

    $to = "njones9@umbc.edu";
    $subject = "Social Spending Email";
    $message = "Just a test of the ability to send automated emails from PHP endpoints.";

    

    $priv_key = file_get_contents($DKIM_PRIVATE_KEY);

    $headers = "From: noreply@socialspendingapp.com";
    $headers .= "\r\nTo: " . $to;
    $headers .= "\r\nSubject: " . $subject;
    $headers .= "\r\nDate: " . date('r');
    
    $body = $headers . "\r\n\r\n" . $message; 

    $digital_sig = NULL;

    openssl_sign($body, $digital_sig, $priv_key);

    $digital_sig = base64_encode($digital_sig);

    $dkim_header = "DKIM-Signature: v=1; a=rsa-sha256; s=$DKIM_SELECTOR; d=$DKIM_DOMAIN; c=simple/simple; q=dns/txt; bh=; h=from:to:subject:date; b=$digital_sig;";

    $headers .= "\r\n" . $dkim_header;

    if (mail($to, $subject, $message, $headers) == false) 
    {
        http_response_code(500);
        echo "Failure to Send";
    } else {
        http_response_code(202);
        echo "Successful Send";
    }
    return;
}

?>