

import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { Link } from "expo-router";

import Button from './Button.js'
import { HeaderLink, HeaderText } from './TextComponents.js'

const Logo = require('../assets/images/LogoLong.png');

export default function Login() {

    // make a quick GET request to login.php to check if the user's cookies are already authenticated
    // assemble endpoint for authentication
    let url = window.location.origin + '/login.php';
    fetch(url, { credentials: 'same-origin' }).then((response) => {
        if (response.status == 200) {
            // redirect
            window.location.href = window.location.origin + '/summary';
        }
    });

    return (

        <View style={styles.login}>


            <Image source={Logo} style={styles.logo} />


            <HeaderText size={2} style={[styles.label, { paddingTop: 0 }]}>Welcome</HeaderText>
            <Text style={styles.text}>Please sign-in to your account below</Text>

            <Text id='loginForm_errorMessage' style={styles.error}></Text>

            <View style={styles.labelContainer}>
                <HeaderText size={5} style={styles.label}>EMAIL OR USERNAME</HeaderText>
            </View>

            <input placeholder=" Enter your email or username" style={styles.input} id='loginForm_user' name="Username" />

            <View style={styles.labelContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '50%' }}>
                    <HeaderText size={5} style={styles.label}>PASSWORD</HeaderText>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '50%' }}>
                    <HeaderLink href="/forgot" size={5} style={styles.forgot}>Forgot Password?</HeaderLink>
                </View>
            </View>
            <input placeholder=" Password" style={styles.input} id='loginForm_password' type='password' name="Password" />

            <View style={[styles.labelContainer, { width: '78%' }]}>
                <input type="checkbox" style={styles.checkbox} id="loginForm_remember" />
                <Text style={[styles.text, { marginTop: '.6em' }]}> Remember Me?</Text>
            </View>

            <Button style={styles.buttonContainer} label='Login' onClick={Submit} />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: '2em' }}>
                <Text style={styles.text}>New to our platform? </Text>
                <Link href="/signup" style={[styles.text, { color: '#f7a072' }]}>Create an Account</Link>
            </View>

        </View>
    );
}

async function Submit() {


    let userTextbox = document.getElementById('loginForm_user');
    let passwordTextbox = document.getElementById('loginForm_password');

    // pul username and password in form data for a POST request
    let payload = new URLSearchParams();
    payload.append('user', userTextbox.value);
    payload.append('password', passwordTextbox.value);

    // assemble endpoint for authentication
    let url = window.location.origin + '/login.php';

    // do the POST request
    try {
        let response = await fetch(url, { method: 'POST', body: payload, credentials: 'same-origin' });

        if (response.status == 200) {
            // redirect
            window.location.href = window.location.origin + '/summary';
        }
        else {
            // failed, display error message returned by server
            let errorDiv = document.getElementById('loginForm_errorMessage');
            let responseJSON = await response.json();
            errorDiv.innerText = responseJSON['message'];
            errorDiv.classList.remove('hidden');
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
        justifyContent: 'flex-start',
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