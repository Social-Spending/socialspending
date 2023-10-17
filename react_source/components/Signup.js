/*
 *  Functions:
 *      checkEmail: Checks value of email field and prevents user from submitting if not a valid email
 *          @param: emailRef - reference to email field
 *          @param: errorRef - reference to error text field to output error text
 *          @return: boolean - validity of email
 *          
 *      checkPassword: Checks value of password field and prevents user from submitting if not equal to verify password field
 *          @param: passwordRef - reference to password field
 *          @param: verifyRef   - reference to verify password field
 *          @param: errorRef    - reference to error text field to output error text
 *          @return: boolean    - validity of password
 *          
 *      checkUsername: Checks value of username field and prevents user from submitting if too short
 *          @param: userRef     - reference to username field
 *          @param: errorRef    - reference to error text field to print error text to
 *          @return: boolean    - validity of username
 *          
 *      Submit: Creates a post request to /signup.php containing values of email, username, and password fields.
 *          @param: userRef     - reference to username field
 *          @param: emailRef    - reference to email field
 *          @param: passwordRef - reference to password field
 *          @param: errorRef    - reference to error text field to print error text to
 *          
*/



import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useRef } from 'react';
import { Link, router } from "expo-router";

import Button from './Button.js'
import { HeaderText } from './TextComponents.js'

const Logo = require('../assets/images/LogoLong.png');



export default function Login() {

    const [emailDisabled    , setEmailDisabled]      = useState(true);
    const [passwordDisabled , setPasswordDisabled]   = useState(true);
    const [usernameDisabled , setUsernameDisabled]   = useState(true);

    const onEmailChange     = () => { setEmailDisabled      (checkEmail(emailRef, emailErrorMessageRef)); }
    const onPasswordChange  = () => { setPasswordDisabled   (checkPassword(passwordRef, passwordVerifyRef, passwordErrorMessageRef)); }
    const onUsernameChange  = () => { setUsernameDisabled   (checkUsername(userRef, userErrorMessageRef)); }
    const onSubmit          = () => { Submit                (userRef, emailRef, passwordRef, errorMessageRef); }

    const errorMessageRef           = useRef(null);
    const emailErrorMessageRef      = useRef(null);
    const emailRef                  = useRef(null);
    const userErrorMessageRef       = useRef(null);
    const userRef                   = useRef(null);
    const passwordErrorMessageRef   = useRef(null);
    const passwordRef               = useRef(null);
    const passwordVerifyRef         = useRef(null);

    return (

        <View style={styles.login}>

            <Image source={Logo} style={styles.logo} />

            <HeaderText size={2} style={[styles.label, { paddingTop: 0 }]}>Create your Account</HeaderText>
            <Text style={styles.text}>Create an account to get started with Social Spending</Text>

            <Text ref={errorMessageRef} id='signupForm_errorMessage' style={[styles.error, { paddingTop: 0 }]}></Text>

            <View style={styles.labelContainer}>
                <HeaderText size={5} style={styles.label}>EMAIL</HeaderText>
                <Text ref={emailErrorMessageRef} id='email_errorMessage' style={styles.error}></Text>
            </View>
            <input ref={emailRef} type='email' placeholder=" Enter your email address" style={styles.input} id='signupForm_email' name="Email" onInput={onEmailChange} />

            <View style={styles.labelContainer}>
                <HeaderText size={5} style={styles.label}>USERNAME</HeaderText>
                <Text ref={userErrorMessageRef} id='username_errorMessage' style={styles.error}></Text>
            </View>
            <input ref={userRef} placeholder=" Enter your desired username" style={styles.input} id='signupForm_user' name="Username" onInput={onUsernameChange} />

            <View style={styles.labelContainer}>
                <HeaderText size={5} style={styles.label}>PASSWORD</HeaderText>
            </View>
            <input ref={passwordRef} placeholder=" Password" style={styles.input} id='signupForm_password' type='password' name="Password" onInput={onPasswordChange} />

            <View style={styles.labelContainer}>
                <HeaderText size={5} style={styles.label}>VERIFY PASSWORD</HeaderText>
                <Text ref={passwordErrorMessageRef} id='password_errorMessage' style={styles.error}></Text>
            </View>
            <input ref={passwordVerifyRef} placeholder=" Verify Password" style={styles.input} id='signupForm_verifyPassword' type='password' name="Password" onInput={onPasswordChange} />

            <Button disabled={emailDisabled || passwordDisabled || usernameDisabled} style={styles.buttonContainer} label='Create Account' onClick={onSubmit} />

            <View style={{ flexDirection: 'row', paddingTop: '2em' }}>
                <Text style={styles.text}>Already have an account? </Text>
                <Link href="/login" style={[styles.text, { color: '#f7a072' }]}>Login</Link>
            </View>

        </View>
    );
}

function checkEmail(emailRef, errorRef) {


    // Standard RFC 5322 Compliant email regex obtained from here https://emailregex.com/
    const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const match = emailRef.current.value.match(regex);

    if (match) {
        errorRef.current.innerText = "";
        return false;

    } else {
        errorRef.current.innerText = "Please enter a valid email address";
        return true;
    }
}

function checkUsername(userRef, errorRef) {

    if (userRef.current.value.length >= 4) {
        errorRef.current.innerText = "";
        return false;

    } else {
        errorRef.current.innerText = "Username must be at least 4 characters";
        return true;
    }
}

function checkPassword(passwordRef, verifyRef, errorRef) {

    if (passwordRef.current.value != verifyRef.current.value) {
        errorRef.current.innerText = "Passwords do not match";
        return true;

    } else {
        errorRef.current.innerText = "";
        return false;
    }
}



async function Submit(userRef, emailRef, passwordRef, errorRef) {

    // pul username and password in form data for a POST request
    let payload = new URLSearchParams();
    payload.append('user', userRef.current.value);
    payload.append('email', emailRef.current.value);
    payload.append('password', passwordRef.current.value);

    // do the POST request
    try {
        let response = await fetch("/signup.php", { method: 'POST', body: payload, credentials: 'same-origin' });

        if (response.ok) {
            // success, redirect user
            // check if this url specifies a url to which to redirect
            router.replace("/login");

        }
        else {
            // failed, display error message returned by server
            let responseJSON = await response.json();
            errorRef.current.innerText = responseJSON['message'];
            errorRef.current.classList.remove('hidden');
        }
    }
    catch (error) {
        console.log("error in in POST request to signup (/signup.php)");
        console.log(error);
    }
}

const styles = StyleSheet.create({
    login: {
        width: '50vh',
        minWidth: '27em',
        height: '70vh',
        minHeight: '39em',
        backgroundColor: '#FFF',
        boxShadow: '0px 0px 5px 5px #eee',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: '4em',
        width: '8em',
        minWidth: '2em',
        borderRadius: 1,
    },
    input: {
        width: '75%',
        height: '2.5em',
        fontSize: '.86em',
        borderRadius: 2,
        borderTopStyle: 'none',
        borderRightStyle: 'none',
        borderLeftStyle: 'none'
    },
    error: {
        paddingTop: '1.75em',
        paddingRight: '.416em',
        paddingLeft: '.416em',
        color: '#F00'
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%'
    },
    label: {
        paddingTop: '2em',
        paddingBottom: '.5em',
        color: '#777'
    },
    forgot: {
        paddingTop: '2em',
        color: '#f7a072',
        paddingBottom: '.5em',
        alignSelf: 'flex-end'
    },
    checkbox: {
        marginTop: '.75em',
        color: '#777',
        backgroundColor: 'red'
    },
    text: {
        color: '#777',
        fontSize: '.83em',
        fontWeight: 600
    },
    buttonContainer: {
        width: '75%',
        height: '1.75em',
        fontSize: '1.17em',
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '1em',
        backgroundColor: '#f7a072',
        borderRadius: 4,
        boxShadow: '3px 3px 3px #aaa',
    },

});