/*
 *  Signup:
 *  
 *      Displays a form allowing email, username, and a password as input
 *      Submit button makes a request to /signup.php contianing email, password, and username
 *      On signup, the user recieves a session cookie and is redirected to /summary
 *  
 */

import * as globals from '../utils/globals.js'

import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useRef } from 'react';
import { Link, router } from "expo-router";

import Button from './Button.js'

const Logo = require('../assets/images/logo/logo-name-64.png');



export default function Signup() {

    const [emailDisabled    , setEmailDisabled]      = useState(true);
    const [passwordDisabled , setPasswordDisabled]   = useState(true);
    const [usernameDisabled , setUsernameDisabled]   = useState(true);

    // Refs must be used in the same component they were declared in call any of these functions from a component executes them in said 
    // components where the refs are null. This fixes that by rerouting the function to run in this component

    const onEmailChange     = () => { setEmailDisabled      (checkEmail(emailRef, emailErrorMessageRef)); }
    const onPasswordChange  = () => { setPasswordDisabled   (checkPassword(passwordRef, passwordVerifyRef, passwordErrorMessageRef)); }
    const onUsernameChange  = () => { setUsernameDisabled   (checkUsername(userRef, userErrorMessageRef)); }
    const onSubmit          = () => { submitForm            (userRef, emailRef, passwordRef, errorMessageRef); }

    const errorMessageRef           = useRef(null);
    const emailErrorMessageRef      = useRef(null);
    const emailRef                  = useRef(null);
    const userErrorMessageRef       = useRef(null);
    const userRef                   = useRef(null);
    const passwordErrorMessageRef   = useRef(null);
    const passwordRef               = useRef(null);
    const passwordVerifyRef         = useRef(null);

    return (

        <View style={styles.singup}>

            <Image source={Logo} style={styles.logo} />

            <Text style={[globals.styles.label, globals.styles.h2, { padding: 0 }]}>Create your Account</Text>
            <Text style={[globals.styles.text, { paddingTop: '1em'}]}>Create an account to get started with Social Spending</Text>

            <Text ref={errorMessageRef} id='signupForm_errorMessage' style={[globals.styles.error, { paddingTop: 0 }]}></Text>

            <View style={globals.styles.labelContainer}>
                <Text style={[globals.styles.h5, globals.styles.label]}>EMAIL</Text>
                <Text ref={emailErrorMessageRef} id='email_errorMessage' style={globals.styles.error}></Text>
            </View>
            <input tabIndex={1} ref={emailRef} type='email' placeholder=" Enter your email address" style={globals.styles.input} id='signupForm_email' name="Email" onInput={onEmailChange} />

            <View style={globals.styles.labelContainer}>
                <Text style={[globals.styles.h5, globals.styles.label]}>USERNAME</Text>
                <Text ref={userErrorMessageRef} id='username_errorMessage' style={globals.styles.error}></Text>
            </View>
            <input tabIndex={2} ref={userRef} placeholder=" Enter your desired username" style={globals.styles.input} id='signupForm_user' name="Username" onInput={onUsernameChange} />

            <View style={globals.styles.labelContainer}>
                <Text style={[globals.styles.h5, globals.styles.label]}>PASSWORD</Text>
            </View>
            <input tabIndex={3} ref={passwordRef} placeholder=" Password" style={globals.styles.input} id='signupForm_password' type='password' name="Password" onInput={onPasswordChange} />

            <View style={globals.styles.labelContainer}>
                <Text style={[globals.styles.h5, globals.styles.label]}>VERIFY PASSWORD</Text>
                <Text ref={passwordErrorMessageRef} id='password_errorMessage' style={globals.styles.error}></Text>
            </View>
            <input tabIndex={4} ref={passwordVerifyRef} placeholder=" Verify Password" style={globals.styles.input} id='signupForm_verifyPassword' type='password' name="Password" onInput={onPasswordChange} />

            <Button disabled={emailDisabled || passwordDisabled || usernameDisabled} style={globals.styles.formButton} label='Create Account' onClick={onSubmit} />

            <View style={{ flexDirection: 'row', paddingTop: '2em' }}>
                <Text style={globals.styles.text}>Already have an account? </Text>
                <Link href="/login" style={[globals.styles.text, { color: globals.COLOR_ORANGE }]}>Login</Link>
            </View>

        </View>
    );
}

/**
 * Checks value of email field and prevents user from submitting if not a valid email
 * @param {React.MutableRefObject} emailRef reference to email field
 * @param {React.MutableRefObject} errorRef reference to error text field to output error text
 * @returns {boolean}                       validity of email
 */
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

/**
 * Checks value of username field and prevents user from submitting if too short
 * @param {React.MutableRefObject} userRef  reference to username field
 * @param {React.MutableRefObject} errorRef reference to error text field to print error text to
 * @returns {boolean}                       validity of username
 */
function checkUsername(userRef, errorRef) {

    if (userRef.current.value.length >= 4) {
        errorRef.current.innerText = "";
        return false;

    } else {
        errorRef.current.innerText = "Username must be at least 4 characters";
        return true;
    }
}

/**
 * Checks value of password field and prevents user from submitting if not equal to verify password field
 * @param {React.MutableRefObject} passwordRef  reference to password field
 * @param {React.MutableRefObject} verifyRef    reference to verify password field
 * @param {React.MutableRefObject} errorRef     reference to error text field to output error text
 * @returns {boolean}                           validity of password
 */
function checkPassword(passwordRef, verifyRef, errorRef) {

    if (passwordRef.current.value != verifyRef.current.value) {
        errorRef.current.innerText = "Passwords do not match";
        return true;

    } else {
        errorRef.current.innerText = "";
        return false;
    }
}

/**
 * @param {React.MutableRefObject} userRef          reference to username field
 * @param {React.MutableRefObject} emailRef         reference to email field
 * @param {React.MutableRefObject} passwordRef      reference to password field
 * @param {React.MutableRefObject} errorRef         reference to error text field to print error text to
 */
async function submitForm(userRef, emailRef, passwordRef, errorRef) {

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
            router.push("/summary");

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
    singup: {
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
    
    

});