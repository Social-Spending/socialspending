import * as globals from '../utils/globals.js'
import Button from './Button.js';

import { Text, View, Image } from '../utils/globals.js';
import { useRef, useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../components/GlobalContext.js';
import { styles, checkPassword, checkUsername, checkEmail } from '../utils/validateUserInfo.js';
import { getUserInfo } from '../utils/friends.js'
import { useSearchParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom/dist/index.js';

import Logo from '../assets/images/logo/logo-name-64.png';
import ShowSvg from '../assets/images/bx-show.svg';
import HideSvg from '../assets/images/bx-hide.svg';
import SVGIcon from '../components/SVGIcon.js';

let navigate = 0;
export default function ForgotPassword(props) {

    const {loginAttempts} = useContext(GlobalContext);
    const [loginAttemptsState, setLoginAttemptsState] = loginAttempts;
    const [searchParams, setSearchParams] = useSearchParams();

    const [emailDisabled    , setEmailDisabled]      = useState(true);
    const [passwordDisabled , setPasswordDisabled]   = useState(true);
    const [usernameDisabled , setUsernameDisabled]   = useState(true);
    const [showPassword     , setShowPassword]       = useState(false);

    // Refs must be used in the same component they were declared in call any of these functions from a component executes them in said
    // components where the refs are null. This fixes that by rerouting the function to run in this component

    //Only perform the verification tests if the field isn't empy
    //If the field is empty, clear the error message and disable the field
    const onEmailChange     = () => { setEmailDisabled      (emailRef.current.value == "" ? () => {emailErrorMessageRef.current.innerText = ""; return true;} : checkEmail(emailRef, emailErrorMessageRef)); }
    const onPasswordChange  = () => { setPasswordDisabled   (passwordRef.current.value == "" ? () => {passwordErrorMessageRef.current.innerText = ""; return true;} : checkPassword(passwordRef, passwordVerifyRef, passwordErrorMessageRef)); }
    const onUsernameChange  = () => { setUsernameDisabled   (userRef.current.value == "" ? () => {userErrorMessageRef.current.innerText = ""; return true;} : checkUsername(userRef, userErrorMessageRef)); }
    const onSubmit          = () => { submitForm            (userRef, emailRef, passwordRef, navigate); }

    const errorMessageRef           = useRef(null);
    const emailErrorMessageRef      = useRef(null);
    const emailRef                  = useRef(null);
    const userErrorMessageRef       = useRef(null);
    const userRef                   = useRef(null);
    const passwordErrorMessageRef   = useRef(null);
    const passwordRef               = useRef(null);
    const passwordVerifyRef         = useRef(null);

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);

    const navigate = useNavigate();

    function handleChildClick(e) {
        e.stopPropagation();
    }   

    useEffect(() => {

        async function getItems() {
            let json = null;

            json = await getUserInfo(props.id);

            if (json != null) {
                setUsername(json.username);
                setEmail(json.email);
            }
            
        }
        

        async function pushAccessCode() {

            try {
                let access_code = searchParams.get("access_code");
                let response = await fetch('/forgot_password.php?access_code='+access_code, { method: 'POST', credentials: 'same-origin' });

                if (!response.ok) {
                    navigate("/login");
                }
                        
                getItems();
                
            }
            catch (error) {
                console.log("error in POST request to user_profile (/user_profile.php)");
                console.log(error);
            }
        }
            pushAccessCode();
            
    });
   
	return (
        <View style={{ ...styles.signup, ...{ boxShadow: 0 }}} onClick={handleChildClick}>

            <Image source={Logo} style={styles.logo} />

            <Text style={{ ...globals.styles.label, ...globals.styles.h2, ...{ padding: 0 }}}>Edit your Account</Text>
            <Text style={{ ...globals.styles.text, ...{ paddingTop: '1em'}}}>Edit your profile details</Text>

            <Text ref={errorMessageRef} id='signupForm_errorMessage' style={{ ...globals.styles.error, ...{ paddingTop: 0 }}}></Text>

            <View style={globals.styles.labelContainer}>
                <label htmlFor="signupForm_email" style={{ ...globals.styles.h5, ...globals.styles.label}}>EMAIL</label>
                <Text ref={emailErrorMessageRef} id='email_errorMessage' style={globals.styles.error}></Text>
            </View>
            <input autoFocus tabIndex={0} ref={emailRef} type='email' placeholder=" Enter your email address" style={globals.styles.input} id='signupForm_email' name="Email" defaultValue={email} onInput={onEmailChange} />

            <View style={globals.styles.labelContainer}>
                <label htmlFor="signupForm_user" style={{ ...globals.styles.h5, ...globals.styles.label}}>USERNAME</label>
                <Text ref={userErrorMessageRef} id='username_errorMessage' style={globals.styles.error}></Text>
            </View>
            <input tabIndex={0} ref={userRef} placeholder=" Enter your desired username" style={globals.styles.input} id='signupForm_user' name="Username" defaultValue={username} onInput={onUsernameChange} />

            <View style={{ ...globals.styles.labelContainer, ...{ justifyContent: 'flex-start' }}}>

                <label htmlFor="signupForm_password" style={{ ...globals.styles.h5, ...globals.styles.label}}>NEW PASSWORD</label>
                <Button aria-label={(showPassword ? "Hide" : "Show") + " Password"} style={globals.styles.showPassword} onClick={() => setShowPassword(!showPassword)}>
                    <SVGIcon src={showPassword ? HideSvg : ShowSvg} style={{ fill: globals.COLOR_GRAY, height: '1.25em' }} />
                </Button>
            </View>
            <input tabIndex={0} ref={passwordRef} placeholder=" Password" style={globals.styles.input} id='signupForm_password' type={showPassword ? "text" : "password"} autoComplete="current-password" name="Password" onInput={onPasswordChange} />

            <View style={globals.styles.labelContainer}>
                        <label htmlFor="signupForm_verifyPassword" style={{ ...globals.styles.h5, ...globals.styles.label}}>VERIFY NEW PASSWORD</label>
                <Text ref={passwordErrorMessageRef} id='password_errorMessage' style={globals.styles.error}></Text>
            </View>
            <input tabIndex={0} ref={passwordVerifyRef} placeholder=" Verify Password" style={globals.styles.input} id='signupForm_verifyPassword' type={showPassword ? "text" : "password"} autoComplete='current-password' name="Password" onInput={onPasswordChange} />

            <Button id="signupForm_submit" tabIndex={0} disabled={emailDisabled && passwordDisabled && usernameDisabled} style={globals.styles.formButton} onClick={onSubmit} >
                <label htmlFor="signupForm_submit" style={globals.styles.buttonLabel}>
                    Submit
                </label>
            </Button>

        </View>
	);
}


async function submitForm(userRef, emailRef, passwordRef, navigate) {

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
            navigate('/summary', { replace: true });
        }
        
    }
    catch (error) {
        console.log("error in POST request to user_profile (/user_profile.php)");
        console.log(error);
    }
}

