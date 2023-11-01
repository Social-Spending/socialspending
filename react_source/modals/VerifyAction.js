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

const Logo = require('../assets/images/logo/logo-name-64.png');


import Accept from '../assets/images/bx-check.svg';
import Reject from '../assets/images/bx-x.svg';
import { ModalContext } from './ModalContext.js';

export default function VerifyAction(props) {
    const setModal = useContext(ModalContext);

    function handleChildClick(e) {
        e.stopPropagation();
    }

    return (

        <View style={[globals.styles.modalBackground, props.style]} onClick={(props.exit != undefined ? props.exit : () => setModal(null))}>
            <View style={styles.verify} onClick={handleChildClick}>

                <Image source={Logo} style={styles.logo} />

                
                <Text style={[globals.styles.text, globals.styles.h2, { paddingTop: 0 }]}>{props.label}</Text>
                
                <View style={{flexDirection: 'row', justifyContent: 'center'} }>
                    <Button style={[styles.button, { backgroundColor: globals.COLOR_BLUE }]} svg={Accept} iconStyle={styles.icon} label='CONTINUE' onClick={props.accept} />
                    <Button style={[styles.button, { backgroundColor: globals.COLOR_ORANGE }]} svg={Reject} iconStyle={styles.icon} label='CANCEL' onClick={(props.reject != undefined ? props.reject : () => setModal(null))} />
                </View>
                

            </View>
        </View>
        
    );
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