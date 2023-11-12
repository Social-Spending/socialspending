import * as globals from '../utils/globals.js'

import { Text, View, Image, Modal } from '../utils/globals.js';

import { useRef, useState, useContext } from 'react';


import Button from '../components/Button.js'

import Logo from '../assets/images/logo/logo-name-64.png';


import Accept from '../assets/images/bx-check.svg';
import Reject from '../assets/images/bx-x.svg';
import { ModalContext } from './ModalContext.js';

export default function VerifyAction(props) {
    const setModal = useContext(ModalContext);

    function handleChildClick(e) {
        e.stopPropagation();
    }

    return (
        <Modal
            transparent={true}
            visible={true}
            onRequestClose={() => setModal(null)}>

            <View style={{ ...globals.styles.modalBackground, ...props.style}} onClick={(props.exit != undefined ? props.exit : () => setModal(null))}>
                <View style={styles.verify} onClick={handleChildClick}>

                    <Image source={Logo} style={styles.logo} />
 
                    <Text style={{ ...globals.styles.text, ...globals.styles.h2, ...{ paddingTop: 0, textAlign: 'center' }}}>{props.label}</Text>
                
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: 'auto', maxWidth: '100%'} }>
                        <Button autoFocus tabIndex={0} style={{ ...styles.button, ...{ backgroundColor: globals.COLOR_BLUE }}} svg={Accept} iconStyle={styles.icon} label='CONTINUE' onClick={props.accept} />
                        <Button tabIndex={0} style={{ ...styles.button, ...{ backgroundColor: globals.COLOR_ORANGE }}} svg={Reject} iconStyle={styles.icon} label='CANCEL' onClick={(props.reject != undefined ? props.reject : () => setModal(null))} />
                    </View>
                

                </View>
            </View>
        </Modal>
        
    );
}

const styles = {
    verify: {
        zIndex: 1,
        width: '40em',
        maxWidth: '80vw',
        height: 'auto',
        backgroundColor: globals.COLOR_WHITE,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
   
    logo: {
        marginTop : '1em',
        height: '3em',
        width: '9em',
        minWidth: '2em',
        borderRadius: 1,
    },
    button: {
        width: '14em',
        height: '2em',
        fontSize: '1.25em',
        borderRadius: '.5em',
        margin: '.5em',
        marginBottom: '1em'
    },
    icon: {
        fill: globals.COLOR_WHITE,
        width: '1.5em'
    }

};