import * as globals from '../utils/globals.js'

import { Text, View, Image, Modal } from '../utils/globals.js';
import { useRef, useState, useContext } from 'react';


import Button from '../components/Button.js'
import { ModalContext } from './ModalContext.js';

import Logo from '../assets/images/logo/logo-name-64.png';

import Accept from '../assets/images/bx-check.svg';
import Reject from '../assets/images/bx-x.svg';
import { GlobalContext } from '../components/GlobalContext.js';

/**
 *  Modal to upload an icon to user or group
 *      @param {boolean} groupNUser  boolean indicating if uploading a group or user icon
 *                                   if true, upload group icon
 *                                   if false, upload user icon
 *      @param {number} groupID      group_id for which the icon will be updated
 *                                   only required if groupNUser==true
 *      @param {StyleSheet} style    styles to be presented on the outer View
 *      @param {function} exit       ?
 *      @return {React.JSX.Element}  DOM element
 */
export default function UploadIcon(props) {

    const [image, setImage] = useState(null);

    const setModal = useContext(ModalContext);
    // if uploading a group icon, reloading the page will suffice
    if (props.groupNUser) {
        var {reRender} = useContext(GlobalContext);
    }
    // if uploading a user icon, we need to increment loginAttempt to get new user info in GlobalContext
    else {
        var {loginAttempts: [loginAttempts, setLoginAttempts]} = useContext(GlobalContext);
        var reRender = () => {
            setLoginAttempts(loginAttempts + 1);
        }
    }

    const errorMessageRef = useRef(null);
    const imageRef = useRef(null);

    function handleChildClick(e) {
        e.stopPropagation();
    }

    function setErrorMsg(msg) {
        errorMessageRef.current.innerText = msg;
        errorMessageRef.current.classList.remove('hidden');
    }

    const updateImageSource = (e) => {
        setImage(e.target.files[0]);
    }

    const onSubmit = () => { submitForm(image, props.groupID, setErrorMsg, reRender, setModal); }

    return (
        <Modal
            transparent={true}
            visible={true}
            onRequestClose={() => setModal(null)}>

            <View style={{ ...globals.styles.modalBackground, ...props.style}} onClick={(props.exit != undefined ? props.exit : () => setModal(null))}>
                <View style={styles.create} onClick={handleChildClick}>

                    <Image source={Logo} style={styles.logo} />

                    <Text style={{ ...globals.styles.label, ...globals.styles.h2, ...{ padding: 0 }}}>UPLOAD ICON</Text>

                    <Image style={styles.display} source={image == null ? null : URL.createObjectURL(image)}/>

                    <Text ref={errorMessageRef} id='createGroup_errorMessage' style={globals.styles.error}></Text>

                    <input ref={imageRef} type="file" accept="image/*" onInput={updateImageSource} />

                    <View style={{ flexDirection: 'row', justifyContent: 'center', width:'75%' }}>
                        <Button disabled={image == null} style={{ ...styles.button, ...{ backgroundColor: globals.COLOR_BLUE }}} svg={Accept} iconStyle={styles.icon} label='UPLOAD' onClick={onSubmit} />
                        <Button style={{ ...styles.button, ...{ backgroundColor: globals.COLOR_ORANGE }}} svg={Reject} iconStyle={styles.icon} label='CANCEL' onClick={() => setModal(null)} />
                    </View>

                </View>
            </View>
        </Modal>

    );
}

// groupID will be undefined when groupNUser==false
async function submitForm(image, groupID, setErrorMsg, reRender, setModal) {

    // append image
    var formData = new FormData();
    formData.append('icon', image);

    // fill in endpoint and form data depending on whether the user is uploading a group icon or user icon
    let endpoint = '';
    if (groupID) {
        //Uploading group icon so send group id
        formData.append('group_id', groupID);
        endpoint = '/group_icon_upload.php';
    }
    else {
        //Uploading user icon
        endpoint = '/user_icon_upload.php';
    }

    // do the POST request
    try {
        let response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        });

        if (await response.ok) {
            // close modal and re-render page
            setModal(null);
            reRender();
        }
        else {
            // failed, display error message returned by server
            let responseJSON = await response.json();
            setErrorMsg(responseJSON['message']);
        }
    }
    catch (error) {
        console.log("error in POST request to "+endpoint);
        console.log(error);
    }
}


const styles = {
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
        margin: '1em',
        width: '10em',
        height: '10em',
        borderRadius: '50%',
        borderStyle: 'solid',
        borderWidth: '4px',
        borderColor: globals.COLOR_LIGHT_GRAY
    }

};