/*
 *  Functions:
 *      submitForm: Creates a post request to /login.php containing values of username, and password fields.
 *          @param: userRef     - reference to username field
 *          @param: passwordRef - reference to password field
 *          @param: errorRef    - reference to error text field to print error text to
 *          
*/

import * as globals from '../utils/globals.js'

import { StyleSheet, Text, View, Image } from 'react-native';
import { router } from "expo-router";
import { useRef, useState } from 'react';


import Button from './Button.js'

const Logo = require('../assets/images/logo/logo-name-64.png');


import Accept from '../assets/images/bx-check.svg';
import Reject from '../assets/images/bx-x.svg';

export default function VerifyAction(props) {

    const onSubmit = () => { submitForm(groupRef, errorMessageRef); }
    const onNameChange = () => { setNameDisabled(checkName(groupRef, errorMessageRef)); }

    const [nameDisabled, setNameDisabled] = useState(true);

    const errorMessageRef = useRef(null);
    const groupRef = useRef(null);

    function handleChildClick(e) {
        e.stopPropagation();
    }


    return (

        <View style={[globals.styles.modalBackground, props.style]} onClick={props.exit}>
            <View style={styles.verify} onClick={handleChildClick}>

                <Image source={Logo} style={styles.logo} />

                
                <Text style={[globals.styles.text, globals.styles.h2, { paddingTop: 0 }]}>{props.label}</Text>

                <Text ref={errorMessageRef} id='loginForm_errorMessage' style={globals.styles.error}></Text>
                
                <View style={{flexDirection: 'row', justifyContent: 'center'} }>
                    <Button style={[styles.button, { backgroundColor: globals.COLOR_BLUE }]} svg={Accept} iconStyle={styles.icon} label='CONTINUE' onClick={props.accept} />
                    <Button style={[styles.button, { backgroundColor: globals.COLOR_ORANGE }]} svg={Reject} iconStyle={styles.icon} label='CANCEL' onClick={props.reject} />
                </View>
                

            </View>
        </View>
        
    );
}

/**
* Checks value of group name field and prevents user from submitting if too short
* @param { React.MutableRefObject } groupRef reference to group name field
* @param { React.MutableRefObject } errorRef reference to error text field to print error text to
* @returns { boolean }                       validity of group name
*/
function checkName(groupRef, errorRef) {

    if (groupRef.current.value.length >= 4) {
        errorRef.current.innerText = "";
        return false;

    } else {
        errorRef.current.innerText = "Group name must be at least 4 characters";
        return true;
    }
}

async function submitForm(groupRef, errorRef) {

    // poperation and group name in POST request
    let payload = `{
                        "operation": "create",
                        "group_name": "` + groupRef.current.value + `"
                    }`;
    
    // do the POST request
    try {
        let response = await fetch("/groups.php", {
            method: 'POST',
            body: payload,
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (await response.ok) {
            // redirect
            router.replace("/groups");
        }
        else {
            // failed, display error message returned by server
            let responseJSON = await response.json();
            errorRef.current.innerText = responseJSON['message'];
            errorRef.current.classList.remove('hidden');
        }
    }
    catch (error) {
        console.log("error in POST request to groups (/groups.php)");
        console.log(error);
    }
}

const styles = StyleSheet.create({
    verify: {
        zIndex: 1,
        width: '40em',
        height: '15em',
        backgroundColor: globals.COLOR_WHITE,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1
    },
   
    logo: {
        height: '3em',
        width: '9em',
        minWidth: '2em',
        borderRadius: 1,
    },
    button: {
        width: '100%',
        height: '2em',
        fontSize: '1.25em',
        borderRadius: '.5em',
        margin: '.5em'
    },
    icon: {
        fill: globals.COLOR_WHITE,
        width: '1.25em'
    }

});