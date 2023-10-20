/*
 *  Functions:
 *      submitForm: Creates a post request to /login.php containing values of username, and password fields.
 *          @param: userRef     - reference to username field
 *          @param: passwordRef - reference to password field
 *          @param: errorRef    - reference to error text field to print error text to
 *          
*/


import { StyleSheet, Text, View, Image } from 'react-native';
import { Link, router } from "expo-router";
import { useRef } from 'react';

import Button from './Button.js'
import { HeaderLink, HeaderText } from './TextComponents.js'

const Logo = require('../assets/images/logo/logo-name-128x64.png');

export default function Login() {

    const onSubmit = () => { submitForm(userRef, passwordRef, rememberRef, errorMessageRef); }

    const errorMessageRef   = useRef(null);
    const userRef           = useRef(null);
    const passwordRef       = useRef(null);
    const rememberRef       = useRef(null);

    return (

        <View style={styles.login}>


            <Image source={Logo} style={styles.logo} />


            <HeaderText size={2} style={[styles.label, { paddingTop: 0 }]}>Welcome</HeaderText>
            <Text style={styles.text}>Please sign-in to your account below</Text>

            <Text ref={errorMessageRef} id='loginForm_errorMessage' style={styles.error}></Text>

            <View style={styles.labelContainer}>
                <HeaderText size={5} style={styles.label}>EMAIL OR USERNAME</HeaderText>
            </View>

            <input tabIndex={1} ref={userRef} placeholder=" Enter your email or username" style={styles.input} id='loginForm_user' name="Username" />

            <View style={styles.labelContainer}>
                    <HeaderText size={5} style={styles.label}>PASSWORD</HeaderText>
                    <HeaderLink href="/forgot" size={5} style={styles.forgot}>Forgot Password?</HeaderLink> 
            </View>
            <input tabIndex={2} ref={passwordRef} placeholder=" Password" style={styles.input} id='loginForm_password' type='password' name="Password" />

            <View style={[styles.labelContainer, { width: '78%' }]}>
                <input tabIndex={3} ref={rememberRef} type="checkbox" style={styles.checkbox} id="loginForm_remember" />
                <Text style={[styles.text, { marginTop: '.6em' }]}> Remember Me?</Text>
            </View>

            <Button style={styles.buttonContainer} label='Login' onClick={onSubmit} />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: '2em' }}>
                <Text style={styles.text}>New to our platform? </Text>
                <Link href="/signup" style={[styles.text, { color: '#f7a072' }]}>Create an Account</Link>
            </View>

        </View>
    );
}

async function submitForm(userRef, passwordRef, rememberRef, errorRef) {

    // pul username and password in form data for a POST request
    let payload = new URLSearchParams();
    payload.append('user', userRef.current.value);
    payload.append('password', passwordRef.current.value);
    payload.append('remember', rememberRef.current.value);

    // do the POST request
    try {
        let response = await fetch("/login.php", { method: 'POST', body: payload, credentials: 'same-origin' });

        if (response.ok) {
            // redirect
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
        console.log("error in in POST request to login (/login.php)");
        console.log(error);
    }
}

const styles = StyleSheet.create({
    login: {
        width: '50vh',
        minHeight: '30em',
        height: '60vh',
        backgroundColor: '#FFF',
        minWidth: '25em',
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
        color: '#777',

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