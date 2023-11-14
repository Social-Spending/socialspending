/*
 *  Functions:
 *      submitForm: Creates a post request to /groups.php containing values of group name field.
 *          @param: groupRef    - reference to group name field
 *          @param: errorRef    - reference to error text field to print error text to
 *          
*/
import * as globals from '../utils/globals.js'

import { Text, View, Image, Modal } from '../utils/globals.js';
import { useRef, useState, useContext } from 'react';


import Button from '../components/Button.js'
import { ModalContext } from './ModalContext.js';
import { useNavigate } from 'react-router-dom/dist/index.js';

import Logo from '../assets/images/logo/logo-name-64.png';

let navigate = 0;

export default function NewGroup(props) {

    const onSubmit = () => { submitForm(groupRef, errorMessageRef); navigate(0); }
    const onNameChange = () => { setNameDisabled(checkName(groupRef, errorMessageRef)); }

    const [nameDisabled, setNameDisabled] = useState(true);
    
    const setModal = useContext(ModalContext);
    const errorMessageRef = useRef(null);
    const groupRef = useRef(null);

    navigate = useNavigate();

    function handleChildClick(e) {
        e.stopPropagation();
    }


    return (
        <Modal
            transparent={true}
            visible={true}
            onRequestClose={() => setModal(null)}>

            <View style={{ ...globals.styles.modalBackground, ...props.style}} onClick={(props.exit != undefined ? props.exit : () => setModal(null))}>
                <View style={styles.create} onClick={handleChildClick}>

                    <Image source={Logo} style={styles.logo} />

                    <Text style={{ ...globals.styles.label, ...globals.styles.h2, ...{ padding: 0 }}}>CREATE GROUP</Text>
                    <Text style={{ ...globals.styles.text, ...{ paddingTop: '1em' }}}>Enter a new group name to get started</Text>

                    <Text ref={errorMessageRef} id='createGroup_errorMessage' style={globals.styles.error}></Text>

                    <View style={globals.styles.labelContainer}>
                        <label htmlFor="createGroup_name" style={{ ...globals.styles.h5, ...globals.styles.label}}>GROUP NAME</label>
                    </View>

                    <input autoFocus tabIndex={0} ref={groupRef} placeholder=" Enter name of new group" style={globals.styles.input} id='createGroup_name' name="Group Name" onInput={onNameChange} />

                    <Button id="createGroup_submit" tabIndex={0} disabled={nameDisabled} style={globals.styles.formButton} onClick={onSubmit}>
                        <label htmlFor="createGroup_submit" style={globals.styles.buttonLabel }>
                            Create New Group
                        </label>
                    </Button>

                </View>
            </View>
        </Modal>
        
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

        groupRef.current.removeAttribute("aria-invalid");
        groupRef.current.removeAttribute("aria-errormessage");
        return false;

    } else {
        errorRef.current.innerText = "Group name must be at least 4 characters";

        groupRef.current.setAttribute("aria-invalid", true);
        groupRef.current.setAttribute("aria-errormessage", errorRef.current.id);
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
            navigate("/groups", {replace: true});

        }
        else {
            // failed, display error message returned by server
            let responseJSON = await response.json();
            errorRef.current.innerText = responseJSON['message'];
            errorRef.current.classList.remove('hidden');
            groupRef.current.setAttribute("aria-invalid", true);
            groupRef.current.setAttribute("aria-errormessage", errorRef.current.id);
        }
    }
    catch (error) {
        console.log("error in POST request to groups (/groups.php)");
        console.log(error);
    }
}

const styles = {
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

};