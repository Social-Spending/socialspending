import * as globals from '../utils/globals.js';

import { addFriend } from '../utils/friends.js';

import { StyleSheet, Text, View, Image, Modal, TextInput } from 'react-native';
import { router } from "expo-router";
import { useRef, useState, useContext } from 'react';


import Button from '../components/Button.js'
import { ModalContext } from './ModalContext.js';
import { GlobalContext } from '../components/GlobalContext.js';

const Logo = require('../assets/images/logo/logo-name-64.png');


/**
 *  modal intended to be wrapped, used in different ways to search for a user
 *      ie. to search for a user to add as a friend or to invite to a group
 *      @param {string} title        title of the modal to be displayed
 *      @param {string} label        question presented to the user
 *      @param {string} submitLabel        text to put on the 'submit' button
 *      @param {StyleSheet} style    Styles to use
 *      @param {} exit               ?
 *      @param {number} onSubmit     function handle for what to do with the username/email when user presses submit
 *                                   onSubmit takes args (user, setErrorMsg, setModal, reRender)...
 *                                   where  'user' is a string of the username/email entered
 *                                          'setErrorMsg' is a function handle that takes 1 argument of a string error message to present on this modal
 *                                          'setModal' is a function handle from ModalContext that takes 1 argument of a DOM model to set as the current modal
 *                                          'reRender' is a function handle from GlobalContext that, when called, re-renders the screen
 *      @return {React.JSX.Element}  DOM element
 */
export default function UserSearch(props) {
    // context vars/functions
    const {reRender} = useContext(GlobalContext);
    const setModal = useContext(ModalContext);

    // refs to DOM content
    const errorMessageRef = useRef(null);
    const userRef = useRef(null);

    // functions
    function handleChildClick(e) {
        e.stopPropagation();
    }

    function setErrorMsg(msg) {
        errorMessageRef.current.innerText = msg;
        errorMessageRef.current.classList.remove('hidden');
    }

    function onSubmit() {
        props.onSubmit(userRef.current.value, setErrorMsg, setModal, reRender);
    }

    // DOM content to return
    return (
        <Modal
            transparent={true}
            visible={true}
            onRequestClose={() => setModal(null)}>

            <View style={[globals.styles.modalBackground, props.style]} onClick={(props.exit != undefined ? props.exit : () => setModal(null))}>
                <View style={styles.create} onClick={handleChildClick}>

                    <Image source={Logo} style={styles.logo} />

                    <Text style={[globals.styles.label, globals.styles.h2, { padding: 0 }]}>{props.title}</Text>
                    <Text style={[globals.styles.text, { paddingTop: '1em' }]}>{props.label}</Text>

                    <Text ref={errorMessageRef} id='userSearch_errorMessage' style={globals.styles.error}></Text>

                    <View style={globals.styles.labelContainer}>
                        <Text style={[globals.styles.h5, globals.styles.label]}>USERNAME OR EMAIL</Text>
                    </View>

                    <TextInput tabIndex={1} ref={userRef} placeholder=" Enter username or email" style={globals.styles.input} id='userSearch_name' name="user" onChangeText={() => onNameChange(userRef)} />

                    <Button disabled={false} style={globals.styles.formButton} label={props.submitLabel} onClick={onSubmit} />

                </View>
            </View>
        </Modal>
    );
}

// Search for users given the username or email
function onNameChange(userRef) {
    // TODO search for users and populate drown-down
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
