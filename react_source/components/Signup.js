/*
 *  Signup:
 *  
 *      Displays a form allowing email, username, and a password as input
 *      Submit button makes a request to /signup.php containing email, password, and username
 *      On signup, the user receives a session cookie and is redirected to /summary
 *  
 */

import * as globals from '../utils/globals.js'

import { Text, View, Image } from '../utils/globals.js';
import { useState, useRef, useContext, useEffect } from 'react';
import { Link } from "react-router-dom/dist/index.js";
import { useNavigate } from 'react-router-dom';

import { checkEmail, checkPassword, checkUsername, styles } from '../utils/validateUserInfo.js';

import Button from './Button.js'

import { GlobalContext } from '../components/GlobalContext.js';

import Logo from '../assets/images/logo/logo-name-64.png';

import ShowSvg from '../assets/images/bx-show.svg';
import HideSvg from '../assets/images/bx-hide.svg';
import SVGIcon from './SVGIcon.js';

export default function Signup() {
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
    const onSubmit          = () => { submitForm            (userRef, emailRef, passwordRef, errorMessageRef, loginAttemptsState, setLoginAttemptsState); }

    const errorMessageRef           = useRef(null);
    const emailErrorMessageRef      = useRef(null);
    const emailRef                  = useRef(null);
    const userErrorMessageRef       = useRef(null);
    const userRef                   = useRef(null);
    const passwordErrorMessageRef   = useRef(null);
    const passwordRef               = useRef(null);
    const passwordVerifyRef = useRef(null);

    const submitOnEnter = (event) => {
        if (event.key === "Enter" && !emailDisabled && !passwordDisabled && !usernameDisabled) {
            onSubmit();
        }
    }

    useEffect(() => {

        emailRef.current.addEventListener("keypress", submitOnEnter);
        userRef.current.addEventListener("keypress", submitOnEnter);
        passwordRef.current.addEventListener("keypress", submitOnEnter);
        passwordVerifyRef.current.addEventListener("keypress", submitOnEnter);

        return () => {
            if (emailRef.current) emailRef.current.removeEventListener("keypress", submitOnEnter);
            if (userRef.current) userRef.current.removeEventListener("keypress", submitOnEnter);
            if (passwordRef.current) passwordRef.current.removeEventListener("keypress", submitOnEnter);
            if (passwordVerifyRef.current) passwordVerifyRef.current.removeEventListener("keypress", submitOnEnter);
        }

    })

    return (

        <View style={styles.signup}>

            <Image source={Logo} style={styles.logo} />

            <Text style={{ ...globals.styles.label, ...globals.styles.h2, ...{ padding: 0 }}}>Create your Account</Text>
            <Text style={{ ...globals.styles.text, ...{ paddingTop: '1em'}}}>Create an account to get started with Social Spending</Text>

            <Text ref={errorMessageRef} id='signupForm_errorMessage' style={{ ...globals.styles.error, ...{ paddingTop: 0 }}}></Text>

            <View style={globals.styles.labelContainer}>
                <label htmlFor="signupForm_email" style={{ ...globals.styles.h5, ...globals.styles.label}}>EMAIL</label>
                <Text ref={emailErrorMessageRef} id='email_errorMessage' style={globals.styles.error}></Text>
            </View>
            <input autoFocus tabIndex={0} ref={emailRef} type='email' placeholder=" Enter your email address" style={globals.styles.input} id='signupForm_email' name="Email" onInput={onEmailChange} />

            <View style={globals.styles.labelContainer}>
                <label htmlFor="signupForm_user" style={{ ...globals.styles.h5, ...globals.styles.label}}>USERNAME</label>
                <Text ref={userErrorMessageRef} id='username_errorMessage' style={globals.styles.error}></Text>
            </View>
            <input tabIndex={0} ref={userRef} placeholder=" Enter your desired username" style={globals.styles.input} id='signupForm_user' name="Username" onInput={onUsernameChange} />

            <View style={{ ...globals.styles.labelContainer, ...{ justifyContent: 'flex-start' }}}>

                <label htmlFor="signupForm_password" style={{ ...globals.styles.h5, ...globals.styles.label}}>PASSWORD</label>
                <Button aria-label={(showPassword ? "Hide" : "Show") + " Password"} style={globals.styles.showPassword} onClick={() => setShowPassword(!showPassword)}>
                    <SVGIcon src={showPassword ? HideSvg : ShowSvg} style={{ fill: globals.COLOR_GRAY, height: '1.25em' }}/>
                </Button>
            </View>
            <input tabIndex={0} ref={passwordRef} placeholder=" Password" style={globals.styles.input} id='signupForm_password' type={showPassword ? "text" : "password"} autoComplete="current-password" name="Password" onInput={onPasswordChange} />

            <View style={globals.styles.labelContainer}>
                <label htmlFor="signupForm_verifyPassword" style={{ ...globals.styles.h5, ...globals.styles.label}}>VERIFY PASSWORD</label>
                <Text ref={passwordErrorMessageRef} id='password_errorMessage' style={globals.styles.error}></Text>
            </View>
            <input tabIndex={0} ref={passwordVerifyRef} placeholder=" Verify Password" style={globals.styles.input} id='signupForm_verifyPassword' type={showPassword ? "text" : "password"} autoComplete='current-password' name="Password" onInput={onPasswordChange} />

            <Button id="signupForm_submit" tabIndex={0} disabled={emailDisabled || passwordDisabled || usernameDisabled} style={globals.styles.formButton} onClick={onSubmit} >
                <label htmlFor="signupForm_submit" style={globals.styles.buttonLabel}>
                    Create Account
                </label>
            </Button>

            <View style={{ flexDirection: 'row', paddingTop: '2em' }}>
                <Text style={{ ...globals.styles.text, ...{ paddingRight: '.5em' }}}>Already have an account? </Text>
                <Link to="/login" style={{ ...globals.styles.text, ...{ color: globals.COLOR_ORANGE }}}>Login</Link>
            </View>

        </View>
    );
}

/**
 * @param {React.MutableRefObject} userRef          reference to username field
 * @param {React.MutableRefObject} emailRef         reference to email field
 * @param {React.MutableRefObject} passwordRef      reference to password field
 * @param {React.MutableRefObject} errorRef         reference to error text field to print error text to
 */
async function submitForm(userRef, emailRef, passwordRef, errorRef, loginAttempts, setLoginAttempts) {

    // pul username and password in form data for a POST request
    let payload = new URLSearchParams();
    payload.append('user', userRef.current.value);
    payload.append('email', emailRef.current.value);
    payload.append('password', passwordRef.current.value);

    // do the POST request
    try {
        let response = await fetch("/signup.php", { method: 'POST', body: payload, credentials: 'same-origin' });

        if (response.ok) {
            // force GlobalContext to re-try getting user info
            setLoginAttempts(loginAttempts + 1);
            // success, redirect user
            const navigate = useNavigate();
            navigate('/summary', { replace: true });

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
