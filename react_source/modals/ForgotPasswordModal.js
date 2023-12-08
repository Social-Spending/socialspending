import * as globals from '../utils/globals.js'

import { useNavigate } from 'react-router-dom/dist/index.js';
import { ModalContext } from './ModalContext.js';
import { useRef, useState, useContext } from 'react';
import { View, Text, Image, Modal } from '../utils/globals.js'
import { styles, checkEmail } from '../utils/validateUserInfo.js';

import Button from '../components/Button.js'
import Logo from '../assets/images/logo/logo-name-64.png';

let navigate = 0;
export default function ForgotPasswordModal(props) {

    navigate = useNavigate();

    const [emailDisabled, setEmailDisabled]      = useState(true);
    const { popModal } = useContext(ModalContext);

    const emailErrorMessageRef   = useRef(null);
    const emailRef               = useRef(null);

    const onEmailChange     = () => { setEmailDisabled      (checkEmail(emailRef, emailErrorMessageRef)); }
    
    const onSubmit = () => {
        submitForm(emailRef, emailErrorMessageRef, popModal, navigate);
    }

    function handleChildClick(e) {
        e.stopPropagation();
    }

    return (
        <Modal
            transparent={true}
            visible={true}
            onRequestClose={() => popModal()}>

            <View style={{ ...globals.styles.modalBackground, ...props.style}} onClick={(props.exit != undefined ? props.exit : () => popModal())}>
                <View style={{ ...styles.signup, ...{ boxShadow: 0 }}} onClick={handleChildClick}>

                    <Image source={Logo} style={styles.logo} />

                    <Text style={{ ...globals.styles.label, ...globals.styles.h2, ...{ padding: 0 }}}>Forgot Password?</Text>
                    <Text style={{ ...globals.styles.text, ...{ paddingTop: '1em'}}}>Enter your email below</Text>

                    <View style={globals.styles.labelContainer}>
                        <label htmlFor="signupForm_email" style={{ ...globals.styles.h5, ...globals.styles.label}}>EMAIL</label>
                        <Text ref={emailErrorMessageRef} id='email_errorMessage' style={globals.styles.error}></Text>
                    </View>
                    <input autoFocus tabIndex={0} ref={emailRef} type='email' placeholder=" Enter your email address" style={globals.styles.input} id='signupForm_email' name="Email"  onInput={onEmailChange} />


                    <Button id="signupForm_submit" tabIndex={0} disabled={emailDisabled} style={globals.styles.formButton} onClick={onSubmit} >
                        <label htmlFor="signupForm_submit" style={globals.styles.buttonLabel}>
                            Submit
                        </label>
                    </Button>

                </View>
            </View>
        </Modal>
    );
}


async function submitForm(email, setErrorMsg, popModal, navigate)
{
    popModal();
    let response = await fetch("/forgot_password.php?email=" + email.current.value, { method: 'GET', credentials: 'same-origin' });

    if (response !== null)
    {
        if (response.ok)
        {
            navigate("/login", { replace: true });
            navigate(0);
        }
        else
        {
            setErrorMsg(response);
        }
    }
    
}