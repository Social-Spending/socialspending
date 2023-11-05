// Most of this file is copied from ../components/Signup.js
import * as globals from '../utils/globals.js'

import { StyleSheet, Text, View, Image, Modal, TextInput } from 'react-native';
import { Link, router } from "expo-router";
import { useRef, useState, useContext } from 'react';


import Button from '../components/Button.js'
import { ModalContext } from './ModalContext.js';
import { GlobalContext } from '../components/GlobalContext.js';
import { styles, checkPassword, checkUsername, checkEmail } from '../components/Signup.js';

const Logo = require('../assets/images/logo/logo-name-64.png');

import ShowSvg from '../assets/images/bx-show.svg';
import HideSvg from '../assets/images/bx-hide.svg';

export default function EditProfile(props) {
    const setModal = useContext(ModalContext);
    // when a signup is completed, increment loginAttempts to trigger a re-render of GlobalContext
    const {loginAttempts} = useContext(GlobalContext);
    const [loginAttemptsState, setLoginAttemptsState] = loginAttempts;

    const [emailDisabled    , setEmailDisabled]      = useState(true);
    const [passwordDisabled , setPasswordDisabled]   = useState(true);
    const [usernameDisabled , setUsernameDisabled]   = useState(true);
    const [showPassword     , setShowPassword]       = useState(false);

    // Refs must be used in the same component they were declared in call any of these functions from a component executes them in said
    // components where the refs are null. This fixes that by rerouting the function to run in this component

    const onEmailChange     = () => { setEmailDisabled      (checkEmail(emailRef, emailErrorMessageRef)); }
    const onPasswordChange  = () => { setPasswordDisabled   (checkPassword(passwordRef, passwordVerifyRef, passwordErrorMessageRef)); }
    const onUsernameChange  = () => { setUsernameDisabled   (checkUsername(userRef, userErrorMessageRef)); }
    const onSubmit          = () => { submitForm            (userRef, emailRef, passwordRef, errorMessageRef, loginAttemptsState, setLoginAttemptsState, setModal); }

    const errorMessageRef           = useRef(null);
    const emailErrorMessageRef      = useRef(null);
    const emailRef                  = useRef(null);
    const userErrorMessageRef       = useRef(null);
    const userRef                   = useRef(null);
    const passwordErrorMessageRef   = useRef(null);
    const passwordRef               = useRef(null);
    const passwordVerifyRef         = useRef(null);

    function handleChildClick(e) {
        e.stopPropagation();
    }

    return (
        <Modal
            transparent={true}
            visible={true}
            onRequestClose={() => setModal(null)}>

            <View style={[globals.styles.modalBackground, props.style]} onClick={(props.exit != undefined ? props.exit : () => setModal(null))}>
                <View style={[styles.signup, { boxShadow: 0 }] } onClick={handleChildClick}>

                    <Image source={Logo} style={styles.logo} />

                    <Text style={[globals.styles.label, globals.styles.h2, { padding: 0 }]}>Edit your Account</Text>
                    <Text style={[globals.styles.text, { paddingTop: '1em'}]}>Edit your profile details</Text>

                    <Text ref={errorMessageRef} id='signupForm_errorMessage' style={[globals.styles.error, { paddingTop: 0 }]}></Text>

                    <View style={globals.styles.labelContainer}>
                        <Text style={[globals.styles.h5, globals.styles.label]}>EMAIL</Text>
                        <Text ref={emailErrorMessageRef} id='email_errorMessage' style={globals.styles.error}></Text>
                    </View>
                    <TextInput tabIndex={1} ref={emailRef} type='email' placeholder=" Enter your email address" style={globals.styles.input} id='signupForm_email' name="Email" onChangeText={onEmailChange} />

                    <View style={globals.styles.labelContainer}>
                        <Text style={[globals.styles.h5, globals.styles.label]}>USERNAME</Text>
                        <Text ref={userErrorMessageRef} id='username_errorMessage' style={globals.styles.error}></Text>
                    </View>
                    <TextInput tabIndex={2} ref={userRef} placeholder=" Enter your desired username" style={globals.styles.input} id='signupForm_user' name="Username" onChangeText={onUsernameChange} />

                    <View style={[globals.styles.labelContainer, { justifyContent: 'flex-start' }]}>

                        <Text style={[globals.styles.h5, globals.styles.label]}>PASSWORD</Text>
                        <Button style={globals.styles.showPassword} svg={showPassword ? HideSvg : ShowSvg} iconStyle={{ fill: globals.COLOR_GRAY, height: '1em' }} onClick={() => setShowPassword(!showPassword)}></Button>
                    </View>
                    <TextInput tabIndex={3} ref={passwordRef} placeholder=" Password" style={globals.styles.input} id='signupForm_password' secureTextEntry={!showPassword} autoComplete="current-password" name="Password" onChangeText={onPasswordChange} />

                    <View style={globals.styles.labelContainer}>
                        <Text style={[globals.styles.h5, globals.styles.label]}>VERIFY PASSWORD</Text>
                        <Text ref={passwordErrorMessageRef} id='password_errorMessage' style={globals.styles.error}></Text>
                    </View>
                    <TextInput tabIndex={4} ref={passwordVerifyRef} placeholder=" Verify Password" style={globals.styles.input} id='signupForm_verifyPassword' secureTextEntry={!showPassword} autoComplete='current-password' name="Password" onChangeText={onPasswordChange} />

                    <Button disabled={emailDisabled || passwordDisabled || usernameDisabled} style={globals.styles.formButton} label='Submit' onClick={onSubmit} />

                </View>
            </View>
        </Modal>

    );
}

async function submitForm(userRef, emailRef, passwordRef, errorRef, loginAttempts, setLoginAttempts, setModal) {

    // pul username and password in form data for a POST request
    let payload = new URLSearchParams();
    payload.append('username', userRef.current.value);
    payload.append('email', emailRef.current.value);
    payload.append('password', passwordRef.current.value);

    // do the POST request
    try {
        let response = await fetch('/user_profile.php', { method: 'POST', body: payload, credentials: 'same-origin' });

        if (response.ok) {
            // force GlobalContext to re-try getting user info
            setLoginAttempts(loginAttempts + 1);
            // success, exit out of modal
            setModal(null);
        }
        else {
            // failed, display error message returned by server
            let responseJSON = await response.json();
            errorRef.current.innerText = responseJSON['message'];
            errorRef.current.classList.remove('hidden');
        }
    }
    catch (error) {
        console.log("error in in POST request to user_profile (/user_profile.php)");
        console.log(error);
    }
}
