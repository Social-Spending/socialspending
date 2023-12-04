import * as globals from '../utils/globals.js';

/**
 * Checks value of email field and prevents user from submitting if not a valid email
 * @param {React.MutableRefObject} emailRef reference to email field
 * @param {React.MutableRefObject} errorRef reference to error text field to output error text
 * @returns {boolean}                       validity of email; false when email is valid
 */
export function checkEmail(emailRef, errorRef) {


    // Standard RFC 5322 Compliant email regex obtained from here https://emailregex.com/
    const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const match = emailRef.current.value.match(regex);

    if (match) {
        errorRef.current.innerText = "";
        emailRef.current.removeAttribute("aria-invalid");
        emailRef.current.removeAttribute("aria-errormessage");
        return false;

    } else {
        errorRef.current.innerText = "Please enter a valid email address";
        emailRef.current.setAttribute("aria-invalid", true);
        emailRef.current.setAttribute("aria-errormessage", errorRef.current.id);
        return true;
    }
}

/**
 * Checks value of username field and prevents user from submitting if too short
 * @param {React.MutableRefObject} userRef  reference to username field
 * @param {React.MutableRefObject} errorRef reference to error text field to print error text to
 * @returns {boolean}                       validity of username; false when username is valid
 */
export function checkUsername(userRef, errorRef) {

    // check username is min width
    if (userRef.current.value.length < 4) {
        errorRef.current.innerText = "Username must be at least 4 characters";
        userRef.current.setAttribute("aria-invalid", true);
        userRef.current.setAttribute("aria-errormessage", errorRef.current.id);
        return true;
    }

    // remove all the valid chars using the regex; if any chars remain, they are invalid
    let validUserNameCharRegex = /[a-z]|[A-Z]|[0-9]|-|_/g;
    let invalidChars = userRef.current.value.replaceAll(validUserNameCharRegex, '');
    if (invalidChars.length > 0) {
        errorRef.current.innerText = "Username cannot contain characters: \"" + invalidChars + "\"";
        userRef.current.setAttribute("aria-invalid", true);
        userRef.current.setAttribute("aria-errormessage", errorRef.current.id);
        return true;
    }

    // no error
    errorRef.current.innerText = "";
    userRef.current.removeAttribute("aria-invalid");
    userRef.current.removeAttribute("aria-errormessage");
    return false;
}

/**
 * Checks value of password field and prevents user from submitting if not equal to verify password field
 * @param {React.MutableRefObject} passwordRef  reference to password field
 * @param {React.MutableRefObject} verifyRef    reference to verify password field
 * @param {React.MutableRefObject} errorRef     reference to error text field to output error text
 * @returns {boolean}                           validity of password; false when password is valid
 */
export function checkPassword(passwordRef, verifyRef, errorRef) {

    // enforce minimum number of chars for password
    if (passwordRef.current.value.length < 8) {
        errorRef.current.innerText = "Password must be at least 8 characters";
        passwordRef.current.removeAttribute("aria-invalid");
        passwordRef.current.removeAttribute("aria-errormessage");
        verifyRef.current.removeAttribute("aria-invalid");
        verifyRef.current.removeAttribute("aria-errormessage");
        return true;

    }

    // remove all the valid chars using the regex; if any chars remain, they are invalid
    let validPasswordCharRegex = /[a-z]|[A-Z]|[0-9]|[!@#\$%\^&*?+=\-_]/g;
    let invalidChars = passwordRef.current.value.replaceAll(validPasswordCharRegex, '');
    if (invalidChars.length > 0) {
        errorRef.current.innerText = "Password cannot contain characters: \"" + invalidChars + "\"";
        passwordRef.current.removeAttribute("aria-invalid");
        passwordRef.current.removeAttribute("aria-errormessage");
        verifyRef.current.removeAttribute("aria-invalid");
        verifyRef.current.removeAttribute("aria-errormessage");
        return true;
    }


    // check that password was entered the same both times
    if (passwordRef.current.value != verifyRef.current.value) {
        errorRef.current.innerText = "Passwords do not match";
        passwordRef.current.removeAttribute("aria-invalid");
        passwordRef.current.removeAttribute("aria-errormessage");
        verifyRef.current.removeAttribute("aria-invalid");
        verifyRef.current.removeAttribute("aria-errormessage");
        return true;
    }

    // passed all checks
    errorRef.current.innerText = "";
    passwordRef.current.setAttribute("aria-invalid", true);
    passwordRef.current.setAttribute("aria-errormessage", errorRef.current.id);
    verifyRef.current.setAttribute("aria-invalid", true);
    verifyRef.current.setAttribute("aria-errormessage", errorRef.current.id);
    return false;
}

export const styles = {
    signup: {
        width: '50vh',
        minWidth: '27em',
        height: '70vh',
        minHeight: '39em',
        backgroundColor: globals.COLOR_WHITE,
        boxShadow: '0px 0px 5px 5px #eee',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: '3em',
        width: '9em',
        minWidth: '2em',
        borderRadius: 1,
    },
};
