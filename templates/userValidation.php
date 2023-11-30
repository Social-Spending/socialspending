<?php

// username validation constants
const MIN_USERNAME_LEN = 4;
const VALID_USERNAME_REGEX = '/[a-z]|[0-9]|-|_/i';

// email validation constants
// Standard RFC 5322 Compliant email regex obtained from here https://emailregex.com/
const VALID_EMAIL_REGEX = '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';

// password validation constants
const MIN_PASSWORD_LEN = 8;
const VALID_PASSWORD_REGEX = '/[a-z]|[A-Z]|[0-9]|[!@#\$%\^&*?+=\-_]/';


// return 0 if username is valid
// return -1 if username contains invalid characters
function checkUsername($username)
{
    // check that the username meets minimum length requirement
    if (strlen($username) < MIN_USERNAME_LEN)
    {
        return -1;
    }

    // check that username does not contain invalid chars
    // remove all valid chars
    $invalidStr = preg_replace(VALID_USERNAME_REGEX, '', $username);
    if (strlen($invalidStr) > 0)
    {
        return -1;
    }
    return 0;
}

// return 0 if email is valid
// return -1 if email contains invalid characters or is not a valid format
function checkEmail($email)
{
    // if email matches the given regex, the email is *valid*
    if (preg_match(VALID_EMAIL_REGEX, $email))
    {
        return 0;
    }
    return -1;
}

// return 0 if password is valid
// return -1 if password contains invalid characters or does not satisfy the requirements of a good password
function checkPassword($password)
{
    // check that the password meets minimum length requirement
    if (strlen($password) < MIN_PASSWORD_LEN)
    {
        return -1;
    }

    // check that password does not contain invalid chars
    // remove all valid chars
    $invalidStr = preg_replace(VALID_PASSWORD_REGEX, '', $password);
    if (strlen($invalidStr) > 0)
    {
        return -1;
    }
    return 0;
}

?>
