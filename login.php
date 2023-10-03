<?php
    // Must do cookie setting here, before any content is sent
    // if the user's current cookie corresponds to an account, log them in
?>

<!DOCTYPE html>
<html>
    <head>
        <script src="unauthenticated_header.js"></script>
        <script src="login.js"></script>
        <link rel="stylesheet" href="global.css"/>
        <link rel="stylesheet" href="header.css"/>
        <link rel="stylesheet" href="login.css"/>
    </head>

    <body>
        <?php readfile('templates/unauthenticated_header.html'); ?>
        <div class="container">
            <div>

            </div>
        </div>
    </body>
</html>