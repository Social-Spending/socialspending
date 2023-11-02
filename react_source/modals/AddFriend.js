
import * as globals from '../utils/globals.js'

import { StyleSheet, Text, View, Image, Modal, TextInput } from 'react-native';
import { router } from "expo-router";
import { useRef, useState, useContext } from 'react';


import Button from '../components/Button.js'
import { ModalContext } from './ModalContext.js';

const Logo = require('../assets/images/logo/logo-name-64.png');

export default function AddFriend(props) {

    
    const onSubmit = () => { submitForm(nameRef, errorMessageRef); }
    const onNameChange = () => { setNameDisabled(checkName(nameRef, errorMessageRef)); }

    const [nameDisabled, setNameDisabled] = useState(false);
    const [friendName, setFriendName] = useState("");

    const setModal = useContext(ModalContext);
    const errorMessageRef = useRef(null);
    const nameRef = useRef(null);

    function handleChildClick(e) {
        e.stopPropagation();
    }


    const sendFriendRequest = () => {
        /*TODO Add logic to send friend requests
         * For now, just console.log that any non-empty name friend request was successfully sent
         * Maybe update modal with a feedback message that says "Friend request successfully sent to {name}"? Idk, to be figured out later
         * */
        if (friendNameExists(friendName)) {
            console.log("Friend request sent");
        } else {
            console.log("User not found");
        }
        setModalVisible(false);
    };

    const friendNameExists = (name) => {
        /* TODO
         * Add logic to check if the friend exists
         * For now, assume any non-empty name is valid
         * */
        return name.trim() !== "";
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={() => setModal(null)}>

            

            <View style={globals.styles.modalBackground} onClick={(props.exit != undefined ? props.exit : () => setModal(null))}>
                <View style={styles.addFriend} onClick={handleChildClick}>

                    <Image source={Logo} style={styles.logo} />

                    <Text style={[globals.styles.label, globals.styles.h2, { padding: 0 }]}>ADD FRIEND</Text>
                    <Text style={[globals.styles.text, { paddingTop: '1em' }]}>Enter your friend's username to get started</Text>

                    <Text ref={errorMessageRef} id='addFriend_errorMessage' style={globals.styles.error}></Text>

                    <View style={globals.styles.labelContainer}>
                        <Text style={[globals.styles.h5, globals.styles.label]}>FRIEND NAME</Text>
                    </View>
                    <TextInput
                        ref={nameRef}
                        style={globals.styles.input}
                        placeholder=" Enter friend's name"
                        onChangeText={(text) => setFriendName(text)}
                    />
                    <Button disabled={nameDisabled} style={globals.styles.formButton} label='Add Friend' onClick={sendFriendRequest} />
                </View>
            </View>
        </Modal>

    );
}

/**
* Checks value of group name field and prevents user from submitting if too short
* @param { React.MutableRefObject } nameRef  reference to username field
* @param { React.MutableRefObject } errorRef reference to error text field to print error text to
* @returns { boolean }                       validity of group name
*/
function checkName(nameRef, errorRef) {

    if (nameRef.current.value.length >= 4) {
        errorRef.current.innerText = "";
        return false;

    } else {
        errorRef.current.innerText = "Username name must be at least 4 characters";
        return true;
    }
}

async function submitForm(nameRef, errorRef) {

    // poperation and group name in POST request
    let payload = `{
                        "operation": "create",
                        "group_name": "` + nameRef.current.value + `"
                    }`;

    // do the POST request
    try {
        let response = await fetch("/friends.php", {
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
        console.log("error in POST request to friends (/friends.php)");
        console.log(error);
    }
}

const styles = StyleSheet.create({
    addFriend: {
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
        marginBottom: '1em',
        borderRadius: 1,
    }

});

