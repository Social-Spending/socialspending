/*
 *  Functions:
 *      submitForm: Creates a post request to /login.php containing values of username, and password fields.
 *          @param: userRef     - reference to username field
 *          @param: passwordRef - reference to password field
 *          @param: errorRef    - reference to error text field to print error text to
 *          
*/

import * as globals from '../utils/globals.js'

import { View, Text, Image } from '../utils/globals.js'

import { useRef, useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom/dist/index.js';

import ForgotPassword from '../modals/ForgotPasswordModal.js';

import ShowSvg from '../assets/images/bx-show.svg';
import HideSvg from '../assets/images/bx-hide.svg';

import Button from './Button.js'

import { ModalContext } from "../modals/ModalContext.js";
import { GlobalContext } from '../components/GlobalContext.js';

import Logo from '../assets/images/logo/logo-name-64.png';
import SVGIcon from './SVGIcon.js';
import Tooltip from './Tooltip.js';

export default function Login(props) {
    // when a login is completed, increment loginAttempts to trigger a re-render of GlobalContext
    const {loginAttempts} = useContext(GlobalContext);
    const [loginAttemptsState, setLoginAttemptsState] = loginAttempts;

    let { pushModal, popModal } = useContext(ModalContext);

    const onSubmit = () => {
        submitForm(userRef, passwordRef, rememberRef, errorMessageRef, loginAttemptsState, setLoginAttemptsState);
    }

    const [showPassword, setShowPassword] = useState(false);


    const errorMessageRef   = useRef(null);
    const userRef           = useRef(null);
    const passwordRef       = useRef(null);
    const rememberRef       = useRef(null);

    const addForgotPasswordModal = (e) => {
        e.preventDefault();
        pushModal(<ForgotPassword />);
    }

    const submitOnEnter = (event) => {
        if (event.key === "Enter") {
            onSubmit();
        }
        
    }

    useEffect(() => {
        passwordRef.current.addEventListener("keypress", submitOnEnter); 
        userRef.current.addEventListener("keypress", submitOnEnter); 
        return () => {
            if (passwordRef.current) passwordRef.current.removeEventListener("keypress", submitOnEnter);
            if (userRef.current) userRef.current.removeEventListener("keypress", submitOnEnter);  
        }
    })

    return (

        <View style={styles.login}>


            <Image source={Logo} style={styles.logo} />


            <Text style={{ ...globals.styles.label, ...globals.styles.h2, ...{ padding: 0 } }}>Welcome</Text>
            <Text style={{ ...globals.styles.text, ...{ paddingTop: '1em'}}}>Please sign-in to your account below</Text>

            <Text ref={errorMessageRef} id='loginForm_errorMessage' style={globals.styles.error}></Text>

            <View style={globals.styles.labelContainer}>
                <label htmlFor='loginForm_username' style={{ ...globals.styles.h5, ...globals.styles.label}}>EMAIL OR USERNAME</label>
            </View>

            <input autoFocus tabIndex={0} ref={userRef} placeholder=" Enter your email or username" style={globals.styles.input} id='loginForm_username' name="Username" />

            <View style={globals.styles.labelContainer}>

                <View style={{flexDirection: 'row'} }>
                    <label htmlFor='loginForm_password' style={{ ...globals.styles.h5, ...globals.styles.label}}>PASSWORD</label>
                    <Button aria-label={(showPassword ? "Hide" : "Show") + " Password"} id="loginForm_showPassword" style={globals.styles.showPassword} onClick={() => setShowPassword(!showPassword)}>
                        <SVGIcon src={showPassword ? HideSvg : ShowSvg} style={{ fill: globals.COLOR_GRAY, height: '1.25em' }} />
                        <Tooltip>
                            Test
                        </Tooltip>
                    </Button>
                </View>
                

                <Link tabIndex={-1} style={{ ...globals.styles.h5, ...styles.forgot}} onClick={addForgotPasswordModal}>Forgot Password?</Link> 

            </View>
                


            
            <input tabIndex={0} ref={passwordRef} placeholder=" Password" style={globals.styles.input} id='loginForm_password' type={showPassword ? "text" : "password"} autoComplete='current-password' name="Password"/>

            <View style={{ ...globals.styles.labelContainer, ...{ justifyContent: 'flex-start', paddingTop: 0, width: '78%' }}}>
                <input tabIndex={0} ref={rememberRef} type="checkbox" style={styles.checkbox} id="loginForm_remember" />
                <label htmlFor='loginForm_remember' style={{ ...globals.styles.text, ...{ marginTop: '.6em' }}}> Remember Me?</label>
            </View>

            <Button id="loginForm_submit" tabIndex={0} style={globals.styles.formButton} onClick={onSubmit} >
                <label htmlFor="loginForm_submit" style={globals.styles.buttonLabel}>
                    Login
                </label>
            </Button>


            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: '2em' }}>
                <Text style={{...globals.styles.text, ...{paddingRight: '.5em' }}}>New to our platform?</Text>
                <Link to="/signup" style={{ ...globals.styles.text, ...{ color: globals.COLOR_ORANGE }}}>Create an Account</Link>
            </View>

        </View>
    );
}

async function submitForm(userRef, passwordRef, rememberRef, errorRef, loginAttempts, setLoginAttempts) {

    // pul username and password in form data for a POST request
    let payload = new URLSearchParams();
    payload.append('user', userRef.current.value);
    payload.append('password', passwordRef.current.value);
    payload.append('remember', rememberRef.current.checked);

    // do the POST request
    try {
        let response = await fetch("/login.php", { method: 'POST', body: payload, credentials: 'same-origin' });

        if (response.ok) {
            // force GlobalContext to re-try getting user info
            setLoginAttempts(loginAttempts + 1);
            // redirect
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

const styles = {
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
        height: '3em',
        width: '9em',
        minWidth: '2em',
        borderRadius: 1,
    },
    forgot: {
        padding: 0,
        color: globals.COLOR_ORANGE
    },
    checkbox: {
        marginTop: '.75em',
        color: globals.COLOR_GRAY,
    }

};