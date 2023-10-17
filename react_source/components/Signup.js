import { StyleSheet, Text, View, Image } from 'react-native';
import { useState } from 'react';
import { Link } from "expo-router";

import Button from './Button.js'
import { HeaderText } from './TextComponents.js'

const Logo = require('../assets/images/LogoLong.png');



export default function Login() {

    const [emailDisabled, setEmailDisabled] = useState(true);
    const [passwordDisabled, setPasswordDisabled] = useState(true);
    const [usernameDisabled, setUsernameDisabled] = useState(true);

    const onEmailChange = () => { setEmailDisabled(checkEmail()); }
    const onPasswordChange = () => { setPasswordDisabled(checkPassword()); }
    const onUsernameChange = () => { setUsernameDisabled(checkUsername()); }

    return (

        <View style={styles.login}>

            <Image source={Logo} style={styles.logo} />

            <HeaderText size={2} style={[styles.label, { paddingTop: 0 }]}>Create your Account</HeaderText>
            <Text style={styles.text}>Create an account to get started with Social Spending</Text>

            <Text id='signupForm_errorMessage' style={[styles.error, { paddingTop: 0 }]}></Text>

            <View style={styles.labelContainer}>
                <HeaderText size={5} style={styles.label}>EMAIL</HeaderText>
                <Text id='email_errorMessage' style={styles.error}></Text>
            </View>
            <input type='email' placeholder=" Enter your email address" style={styles.input} id='signupForm_email' name="Email" onInput={onEmailChange} />

            <View style={styles.labelContainer}>
                <HeaderText size={5} style={styles.label}>USERNAME</HeaderText>
                <Text id='username_errorMessage' style={styles.error}></Text>
            </View>
            <input placeholder=" Enter your desired username" style={styles.input} id='signupForm_user' name="Username" onInput={onUsernameChange} />

            <View style={styles.labelContainer}>
                <HeaderText size={5} style={styles.label}>PASSWORD</HeaderText>
            </View>
            <input placeholder=" Password" style={styles.input} id='signupForm_password' type='password' name="Password" onInput={onPasswordChange} />

            <View style={styles.labelContainer}>
                <HeaderText size={5} style={styles.label}>VERIFY PASSWORD</HeaderText>
                <Text id='password_errorMessage' style={styles.error}></Text>
            </View>
            <input placeholder=" Verify Password" style={styles.input} id='signupForm_verifyPassword' type='password' name="Password" onInput={onPasswordChange} />

            <Button disabled={emailDisabled || passwordDisabled || usernameDisabled} style={styles.buttonContainer} label='Create Account' onClick={Submit} />

            <View style={{ flexDirection: 'row', paddingTop: '2em' }}>
                <Text style={styles.text}>Already have an account? </Text>
                <Link href="/login" style={[styles.text, { color: '#f7a072' }]}>Login</Link>
            </View>

        </View>
    );
}

function checkEmail() {
    let email = document.getElementById('signupForm_email');
    let errorDiv = document.getElementById('email_errorMessage');

    // Standard RFC 5322 Compliant email regex obtained from here https://emailregex.com/
    const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const match = email.value.match(regex);

    if (match) {
        errorDiv.innerText = "";
        return false;

    } else {
        errorDiv.innerText = "Please enter a valid email address";
        return true;
    }
}

function checkUsername() {
    let username = document.getElementById('signupForm_user');
    let errorDiv = document.getElementById('username_errorMessage');

    if (username.value.length >= 4) {
        errorDiv.innerText = "";
        return false;

    } else {
        errorDiv.innerText = "Username must be at least 4 characters";
        return true;
    }
}

function checkPassword() {
    let password = document.getElementById('signupForm_password');
    let verify = document.getElementById('signupForm_verifyPassword');
    let errorDiv = document.getElementById('password_errorMessage');

    if (password.value != verify.value) {
        errorDiv.innerText = "Passwords do not match";
        return true;

    } else {
        errorDiv.innerText = "";
        return false;
    }
}



async function Submit() {


    let userTextbox = document.getElementById('signupForm_user');
    let emailTextbox = document.getElementById('signupForm_email');
    let passwordTextbox = document.getElementById('signupForm_password');

    // pul username and password in form data for a POST request
    let payload = new URLSearchParams();
    payload.append('user', userTextbox.value);
    payload.append('email', emailTextbox.value);
    payload.append('password', passwordTextbox.value);

    // assemble endpoint for authentication
    let url = window.location.origin + '/signup.php';

    // do the POST request
    try {
        let response = await fetch(url, { method: 'POST', body: payload, credentials: 'same-origin' });

        if (response.status === 200) {
            // success, redirect user
            // check if this url specifies a url to which to redirect
            window.location.href = window.location.origin + "/login";
        }
        else {
            // failed, display error message returned by server
            let errorDiv = document.getElementById('signupForm_errorMessage');
            let responseJSON = await response.json();
            errorDiv.innerText = responseJSON['message'];
            errorDiv.classList.remove('hidden');
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