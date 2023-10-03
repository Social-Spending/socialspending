<?php
    // Must do cookie setting here, before any content is sent
    // if the user's current cookie corresponds to an account, log them in
?>

<!DOCTYPE html>
<html>
    <head>
        <script src="unauthenticated_header.js"></script>
        <script src="signup.js"></script>
        <link rel="stylesheet" href="global.css"/>
        <link rel="stylesheet" href="signup.css"/>
        <link rel="stylesheet" href="header.css"/>
    </head>

    <body>
        <?php readfile('templates/unauthenticated_header.html'); ?>
        <div class="container">
            <div id="signupForm">
                <label for="signupForm_username">Username</label>
                <input type="text" id="signupForm_username">
            </div>
        </div>
    </body>
</html>