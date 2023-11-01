import * as globals from '../utils/globals.js'

import { StyleSheet, Text, View, Image } from 'react-native';
import { router } from "expo-router";
import { useRef, useState } from 'react';


import Button from '../components/Button.js'

const Logo = require('../assets/images/logo/logo-name-64.png');

export default function NewGroup(props) {

    const onSubmit = () => { submitForm(nameRef, errorMessageRef); }
    const onNameChange = () => { setNameDisabled(checkName(nameRef, errorMessageRef)); }

    const [nameDisabled, setNameDisabled] = useState(true);

    const errorMessageRef = useRef(null);
    const nameRef = useRef(null);
    const descriptionRef = useRef(null);

    function handleChildClick(e) {
        e.stopPropagation();
    }


    return (

        <View style={[globals.styles.modalBackground, props.style]} onClick={props.exit}>
            <View style={styles.create} onClick={handleChildClick}>

                <Image source={Logo} style={styles.logo} />

                <Text style={[globals.styles.label, globals.styles.h2, { padding: 0 }]}>NEW EXPENSE</Text>
                <Text style={[globals.styles.text, { paddingTop: '1em' }]}>Enter transaction name and description to get started</Text>

                <Text ref={errorMessageRef} id='createExpense_errorMessage' style={globals.styles.error}></Text>

                <View style={globals.styles.labelContainer}>
                    <Text style={[globals.styles.h5, globals.styles.label]}>EXPENSE NAME *</Text>
                </View>

                <input tabIndex={1} ref={nameRef} placeholder=" Enter name of new expense" style={globals.styles.input} id='createExpense_name' name="Expense Name" onInput={onNameChange} />

                <View style={globals.styles.labelContainer}>
                    <Text style={[globals.styles.h5, globals.styles.label]}>DESCRIPTION</Text>
                </View>

                <textarea tabIndex={2} ref={descriptionRef} placeholder=" Enter description" style={globals.styles.textarea} id='createExpense_description' name="Expense Description" onInput={onNameChange} />

                <View style={{justifyContent: 'space-between', alignItems: 'flex-end', width: '75%'} }>
                    <Button disabled={nameDisabled} style={[globals.styles.formButton, {margin: 0, marginTop: '1em', marginBottom: '1em', width: '33%' }]} label='Next' onClick={onSubmit} />
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
    create: {
        width: '45vh',
        minHeight: '30em',
        height: 'auto',
        maxHeight: '60vh',
        backgroundColor: globals.COLOR_WHITE,
        minWidth: '25em',
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
        marginTop: '1em'
    }

});