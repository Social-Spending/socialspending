import * as globals from '../utils/globals.js';

import { addFriend } from '../utils/friends.js';

import { StyleSheet, Text, View, Image, Modal, TextInput } from 'react-native';
import { router } from "expo-router";
import { useRef, useState, useContext } from 'react';


import Button from '../components/Button.js'
import { ModalContext } from './ModalContext.js';

const Logo = require('../assets/images/logo/logo-name-64.png');

export default function NewFriend(props) {

    const onSubmit = () => { submitForm(userRef, errorMessageRef); }

    //const [nameDisabled, setNameDisabled] = useState(false);

    const setModal = useContext(ModalContext);
    const errorMessageRef = useRef(null);
    const userRef = useRef(null);

    function handleChildClick(e) {
        e.stopPropagation();
    }


    return (
        <Modal
            transparent={true}
            visible={true}
            onRequestClose={() => setModal(null)}>

            <View style={[globals.styles.modalBackground, props.style]} onClick={(props.exit != undefined ? props.exit : () => setModal(null))}>
                <View style={styles.create} onClick={handleChildClick}>

                    <Image source={Logo} style={styles.logo} />

                    <Text style={[globals.styles.label, globals.styles.h2, { padding: 0 }]}>ADD FRIEND</Text>
                    <Text style={[globals.styles.text, { paddingTop: '1em' }]}>Enter the username or email to send a friend request</Text>

                    <Text ref={errorMessageRef} id='addFriend_errorMessage' style={globals.styles.error}></Text>

                    <View style={globals.styles.labelContainer}>
                        <Text style={[globals.styles.h5, globals.styles.label]}>USERNAME OR EMAIL</Text>
                    </View>

                    <TextInput tabIndex={1} ref={userRef} placeholder=" Enter username or email" style={globals.styles.input} id='addFriend_name' name="userToAdd" onChangeText={() => onNameChange(userRef)} />

                    <Button disabled={false} style={globals.styles.formButton} label='Add Friend' onClick={onSubmit} />

                </View>
            </View>
        </Modal>
    );
}

// Search for users given the username or email
function onNameChange(userRef) {
    // TODO search for users and populate drown-down
}

async function submitForm(userRef, errorRef) {
    let responseMessage = await addFriend(userRef.current.value);
    if (responseMessage !== null)
    {
        if (responseMessage == 'Success')
        {
            router.replace("/friends");
        }
        else
        {
            errorRef.current.innerText = responseMessage;
            errorRef.current.classList.remove('hidden');
        }
    }
}

const styles = StyleSheet.create({
    create: {
        zIndex: 1,
        height: '20em',
        backgroundColor: globals.COLOR_WHITE,
        width: '26em',
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
