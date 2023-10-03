<?php
    // Must do cookie setting here, before any content is sent
    // this page requires a cookie corresponding to a logged-in user
    /* if user does not have cookie,
        or cookie does not correspond to an entry in the database...
        redirect to */

    // if (false)
    // {
    //     if (!empty($_SERVER['HTTPS']) && ('on' == $_SERVER['HTTPS'])) {
    //         $uri = 'https://';
    //     } else {
    //         $uri = 'http://';
    //     }
    //     $uri .= $_SERVER['HTTP_HOST'];
    //     header('Location: '.$uri.'/login.php');
    //     exit;
    // }
?>

<!DOCTYPE html>
<html>
    <head>
        <script src="authenticated_header.js"></script>
        <script src="signup.js"></script>
        <link rel="stylesheet" href="global.css"/>
        <link rel="stylesheet" href="signup.css"/>
        <link rel="stylesheet" href="header.css"/>
    </head>

    <body>
        <?php readfile('templates/unauthenticated_header.html'); ?>
        <div class="container">
            <div>
                You have been authenticated.
            </div>
        </div>
    </body>
</html>