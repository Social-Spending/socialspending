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
import { useRef, useState, useContext } from 'react';


import Button from '../components/Button.js'
import { ModalContext } from './ModalContext.js';

const Logo = require('../assets/images/logo/logo-name-64.png');

export default function NewGroup(props) {

    const onSubmit = () => { submitForm(groupRef, errorMessageRef); }
    const onNameChange = () => { setNameDisabled(checkName(groupRef, errorMessageRef)); }

    const [nameDisabled, setNameDisabled] = useState(true);
    
    const setModal = useContext(ModalContext);
    const errorMessageRef = useRef(null);
    const groupRef = useRef(null);

    function handleChildClick(e) {
        e.stopPropagation();
    }


    return (

        <View style={[globals.styles.modalBackground, props.style]} onClick={(props.exit != undefined ? props.exit : () => setModal(null))}>
            <View style={styles.create} onClick={handleChildClick}>

                <Image source={Logo} style={styles.logo} />

                <Text style={[globals.styles.label, globals.styles.h2, { padding: 0 }]}>CREATE GROUP</Text>
                <Text style={[globals.styles.text, { paddingTop: '1em' }]}>Enter a new group name to get started</Text>

                <Text ref={errorMessageRef} id='loginForm_errorMessage' style={globals.styles.error}></Text>

                <View style={globals.styles.labelContainer}>
                    <Text style={[globals.styles.h5, globals.styles.label]}>GROUP NAME</Text>
                </View>

                <input tabIndex={1} ref={groupRef} placeholder=" Enter name of new group" style={globals.styles.input} id='createGroup_name' name="Group Name" onInput={onNameChange} />

                <Button disabled={nameDisabled}  style={globals.styles.formButton} label='Create New Group' onClick={onSubmit} />

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
    create: {
        zIndex: 1,
        width: '30vh',
        minHeight: '20em',
        height: '40vh',
        backgroundColor: globals.COLOR_WHITE,
        minWidth: '26em',
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
    }

});