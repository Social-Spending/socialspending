/*
 *  Functions:
 *      submitForm: Creates a post request to /groups.php containing values of group name field.
 *          @param: groupRef    - reference to group name field
 *          @param: errorRef    - reference to error text field to print error text to
 *          
*/
import * as globals from '../utils/globals.js'

import { StyleSheet, Text, View, Image, Modal, TextInput } from 'react-native';
import { router } from "expo-router";
import { useRef, useState, useContext } from 'react';


import Button from '../components/Button.js'
import { ModalContext } from './ModalContext.js';

const Logo = require('../assets/images/logo/logo-name-64.png');

import Accept from '../assets/images/bx-check.svg';
import Reject from '../assets/images/bx-x.svg';

export default function UploadIcon(props) {

    const onSubmit = () => { submitForm(image, props.groupID, props.userID, errorMessageRef); }

    const [image, setImage] = useState(null);

    const setModal = useContext(ModalContext);
    const errorMessageRef = useRef(null);
    const imageRef = useRef(null);

    function handleChildClick(e) {
        e.stopPropagation();
    }

    const updateImageSource = (e) => {
        setImage(e.target.files[0]);
    }

    return (
        <Modal
            transparent={true}
            visible={true}
            onRequestClose={() => setModal(null)}>

            <View style={[globals.styles.modalBackground, props.style]} onClick={(props.exit != undefined ? props.exit : () => setModal(null))}>
                <View style={styles.create} onClick={handleChildClick}>

                    <Image source={Logo} style={styles.logo} />

                    <Text style={[globals.styles.label, globals.styles.h2, { padding: 0 }]}>UPLOAD ICON</Text>

                    <Image style={styles.display} source={image == null ? null : URL.createObjectURL(image)}/>

                    <Text ref={errorMessageRef} id='createGroup_errorMessage' style={globals.styles.error}></Text>

                    <input ref={imageRef} type="file" accept="image/*" onInput={updateImageSource} />

                    <View style={{ flexDirection: 'row', justifyContent: 'center', width:'75%' }}>
                        <Button disabled={image == null} style={[styles.button, { backgroundColor: globals.COLOR_BLUE }]} svg={Accept} iconStyle={styles.icon} label='UPLOAD' onClick={onSubmit} />
                        <Button style={[styles.button, { backgroundColor: globals.COLOR_ORANGE }]} svg={Reject} iconStyle={styles.icon} label='CANCEL' onClick={() => setModal(null)} />
                    </View>

                </View>
            </View>
        </Modal>

    );
}

async function submitForm(image, groupID, userID, errorRef) {

    // append image
    var formData = new FormData();
    formData.append('icon', image);

    if (groupID) {
        //Uploading group icon so send group id
        formData.append('group_id', groupID);

        // do the POST request
        try {
            let response = await fetch("/group_icon_upload.php", {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
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
            console.log("error in POST request to group_icon_upload (/group_icon_upload.php)");
            console.log(error);
        }
    } else if (userID) {
        //Uploading user icon so send user id
        formData.append('user_id', groupID);

        // do the POST request
        try {
            let response = await fetch("/user_icon_upload.php", {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            });

            if (await response.ok) {
                // redirect
                router.replace("/profile");
            }
            else {
                // failed, display error message returned by server
                let responseJSON = await response.json();
                errorRef.current.innerText = responseJSON['message'];
                errorRef.current.classList.remove('hidden');
            }
        }
        catch (error) {
            console.log("error in POST request to user_icon_upload (/user_icon_upload.php)");
            console.log(error);
        }
    }
    
}

const styles = StyleSheet.create({
    create: {
        zIndex: 1,
        height: '30em',
        backgroundColor: globals.COLOR_WHITE,
        width: '27em',
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
    icon: {
        fill: globals.COLOR_WHITE,
        width: '1.25em'
    },
    button: {
        width: '45%',
        height: '2em',
        fontSize: '1.25em',
        borderRadius: '.5em',
        margin: '.5em',
        marginBottom: '1em'
    },
    display: {
        marginVertical: '1em',
        width: '10em',
        height: '10em',
        borderRadius: '50%',
        borderWidth: 4,
        borderColor: globals.COLOR_LIGHT_GRAY
    }

});