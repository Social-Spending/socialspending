<?php

include_once('templates/connection.php');
include_once('templates/cookies.php');
include_once('templates/constants.php');
include_once("templates/jsonMessage.php");

require('vendor/autoload.php');
use Aws\Ses\SesClient; 
use Aws\Exception\AwsException;

$SES_CRED_FILE = 'SES_CREDENTIALS.json';

$SES_REGION = "us-east-1";
$SES_SOURCE_EMAIL = "noreply@socialspendingapp.com";
$SES_EMAIL_SUBJECT = "Account Recovery - SocialSpendingApp";
$SES_ENDPOINT = "https://email.$SES_REGION.amazonaws.com/";


try {
        $ses_cred_file = file_get_contents($SES_CRED_FILE);
        $ses_creds = json_decode($ses_cred_file, true);
    
        $SES_ACCESS_KEY = $ses_creds['SES_ACCESS_KEY'];
        $SES_SECRET_KEY = $ses_creds['SES_SECRET_KEY'];

} catch (Exception $e) 
{
    returnMessage("No valid SES credentials found.", HTTP_INTERNAL_SERVER_ERROR);
}





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
    Reset the password for the following email
*/
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET["email"])) {
        resetPassword($_GET['email']);
    }
    return;
}
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //$_POST = file_get_contents("php://input");

    if (!isset($_GET['access_code']))
    {
        returnMessage('Access code not found', HTTP_UNAUTHORIZED);
    }

    exchangeCookie($_GET['access_code']);
}

function resetPassword($email) 
{
    global $mysqli;

    $sql = "SELECT  users.user_id AS user_id,
                    users.username,
                    users.email AS email

                FROM users
                WHERE email = ?";

    $response = $mysqli->execute_query($sql, [$email]);

    //No user found with given email, pretend no error occured
    if ($response == null || mysqli_num_rows($response) == 0) 
    {
        http_response_code(HTTP_OK);
        return;
    }

    $user = $response->fetch_assoc();
    $user_id = $user['user_id'];
    $username = $user['username'];

    //Generate a new random access code for use in URL params, store it in table
    $access_code = generateToken(ACCESS_CODE_LEN);

    $expiry_date = time() + ACCESS_CODE_EXPIRY_TIME;
    $formatted_expiry_date = date("Y-m-d H:i:s", $expiry_date);

    $sql = "INSERT INTO forgotten_passwords (user_id, access_code, expiration_date)
                 VALUES                     (?      , ?          , ?              )
            ON DUPLICATE KEY UPDATE         access_code = ?";

    $response = $mysqli->execute_query($sql, [$user_id, $access_code, $formatted_expiry_date, $access_code]);

    sendEmail($username, $access_code, $email);
}



function sendEmail($username, $access_code, $email) 
{

    global $SES_ACCESS_KEY, $SES_SECRET_KEY, $SES_REGION, $SES_SOURCE_EMAIL, $SES_EMAIL_SUBJECT;

    $SES_Client = new Aws\Ses\SesClient([
        'credentials'   => array    (
                                        'key'       => $SES_ACCESS_KEY,
                                        'secret'    => $SES_SECRET_KEY
                                    ),
        'version'       => '2010-12-01',
        'region'        => $SES_REGION
    ]);

    $forgot_password_link = "https://socialspendingapp.com/forgotpassword?access_code=$access_code";
    
    $html_body = "
                    <h2> Password Reset - SocialSpendingApp </h2>
                    <p> Hello $username,</p>

                    <p> It appears that someone recently requested to reset your password for your SocialSpendingApp account.
                        If you did not make this request, please disregard this email.</p>

                    <p> To reset your password, click on the link below:</p>
                    <p><a href=$forgot_password_link>Reset Password</a></p>
                    <p>If the above link doesn't work, copy and paste the following URL into your favorite browser:</p>
                    <p>$forgot_password_link</p>

                    <p>\nPlease note that this link is only valid for the next 24 hours.
                       After that, you'll need to request another password reset.</p> 
                    
                    <p>Best regards,<br>
                       The SocialSpendingApp Team</p>
                ";

    $plaintext_body = " Hello $username, We noticed that you recently requested to reset your password for your SocialSpendingApp account.
                        If you did not make this request, please disregard this email. To reset your password, click on the link below: $forgot_password_link
                        Please note that this link is only valid for the next 24 hours. After that, you'll need to request another password reset. 
                        Best regards, \nThe SocialSpendingApp Team";
    
    $recipient_emails = [$email];
    $char_set = 'UTF-8';

    try {
        $SES_Client->sendEmail([
                                    'Destination' =>        [
                                                                'ToAddresses' => $recipient_emails,
                                                            ],
                                    'ReplyToAddresses' =>   [$SES_SOURCE_EMAIL],

                                    'Source' =>             $SES_SOURCE_EMAIL,
                                    
                                    'Message' =>            [
                            
                                                                'Body' =>       [
                                                                                    'Html' =>   [
                                                                                                    'Charset' => $char_set,
                                                                                                    'Data' => $html_body,
                                                                                                ],
                                                                                    'Text' =>   [
                                                                                                    'Charset' => $char_set,
                                                                                                    'Data' => $plaintext_body,
                                                                                                ],
                                                                                ],
                                                                'Subject' =>    [
                                                                                    'Charset' => $char_set,
                                                                                    'Data' => $SES_EMAIL_SUBJECT,
                                                                                ],
                                                            ],
                                ]);

    } catch (AwsException $e) {
        // output error message if fails
        echo $e->getMessage();
        echo "\n";
    }

}

function exchangeCookie($access_code)
{
    global $mysqli;

    //Check the passed access code
    $sql = "SELECT  user_id AS user_id

            FROM    forgotten_passwords
            WHERE   access_code = ?";

    $response = $mysqli->execute_query($sql, [strval($access_code)]);

    //Bad access code
    if ($response == null || mysqli_num_rows($response) == 0) {
        returnMessage('Invalid or expired access code.', HTTP_UNAUTHORIZED);
    }

    $user_id = $response->fetch_assoc()['user_id'];

    //Delete the used token from database
    /*
    $sql = "DELETE FROM     forgotten_passwords
            WHERE           user_id = ?";

    $response = $mysqli->execute_query($sql, [$user_id]);
    */

    //Set the cookie on the user so they are temporarily 'authenticated'
    createAndSetSessionID($user_id, false);

    return;
}

?>