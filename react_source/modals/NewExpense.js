import * as globals from '../utils/globals.js'

import { StyleSheet, Text, View, Image, Modal } from 'react-native';
import { router } from "expo-router";
import { useRef, useState, useContext, useEffect } from 'react';

import { getGroups, getGroupInfo } from "../utils/groups.js";


import Button from '../components/Button.js'
import { ModalContext } from './ModalContext.js';

const Logo = require('../assets/images/logo/logo-name-64.png');

export default function NewGroup(props) {

    const onSubmit = () => { submitForm(nameRef, errorMessageRef); }

    const [pageNum, setPageNum] = useState(1);
    const [groupID, setGroupID] = useState(null);

    const errorMessageRef = useRef(null);

    const setModal = useContext(ModalContext);

    function handleChildClick(e) {
        e.stopPropagation();
    }

    return (
        <Modal
            transparent={true}
            visible={true}
            onRequestClose={() => setModal(null)}>

            <View style={[globals.styles.modalBackground, props.style]} >
                <View style={styles.create} onClick={(props.exit != undefined ? props.exit : () => setModal(null))}>

                    <Image source={Logo} style={styles.logo} onClick={handleChildClick} />

                    <Text style={[globals.styles.label, globals.styles.h2, { padding: 0 }]}>NEW EXPENSE</Text>

                    <Text ref={errorMessageRef} id='createExpense_errorMessage' style={globals.styles.error}></Text>

                    <ChooseName hidden={pageNum != 1} setPage={setPageNum} />
                    <SelectSplit hidden={pageNum != 2} setPage={setPageNum} />
                    <SelectGroup hidden={pageNum != 3} setPage={setPageNum} setID={setGroupID} />
                    <SplitExpense hidden={pageNum != 4} setPage={setPageNum} id={groupID} />
                
                </View>
            </View>
        </Modal>

    );
}

function ChooseName(props) {

    const onNameChange = () => { setNameDisabled(checkName(nameRef, errorMessageRef)); }

    const [nameDisabled, setNameDisabled] = useState(false);

    const nameRef = useRef(null);
    const descriptionRef = useRef(null);

    return (
        <View style={[
            styles.pageContianer, {
            display: props.hidden ? 'none' : 'inherit'
        }]} >
            <Text style={[globals.styles.text, { paddingTop: '1em' }]}>Enter transaction name and description to get started</Text>

            <View style={globals.styles.labelContainer}>
                <Text style={[globals.styles.h5, globals.styles.label]}>EXPENSE NAME *</Text>
            </View>

            <input tabIndex={1} ref={nameRef} placeholder=" Enter name of new expense" style={globals.styles.input} id='createExpense_name' name="Expense Name" />

            <View style={globals.styles.labelContainer}>
                <Text style={[globals.styles.h5, globals.styles.label]}>DESCRIPTION</Text>
            </View>

            <textarea tabIndex={2} ref={descriptionRef} placeholder=" Enter description" style={globals.styles.textarea} id='createExpense_description' name="Expense Description" />

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row-reverse' }}>
                <Button disabled={nameDisabled} style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Next' onClick={() => props.setPage(2)} />
            </View>
        </View>
    );
}

function SelectSplit(props) {

    

    return (
        <View style={[styles.pageContianer, {
            display: props.hidden ? 'none' : 'inherit'
        }]}>
            <Text style={[globals.styles.text, { paddingTop: '1em' }]}>Do you want to split between a group or friends?</Text>

            <Button style={[globals.styles.formButton, { margin: 0, marginBottom: '.5em', marginTop: '1.5em' }]} label='Group' onClick={() => props.setPage(3)} />

            <Button style={[globals.styles.formButton, { margin: 0, marginVertical: '.5em' }]} label='Friends' onClick={() => props.setPage(4)} />

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row' }}>
                <Button style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Back' onClick={() => props.setPage(1)} />
            </View>
        </View>
    );
}

function SelectGroup(props) {

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {

            setGroups(await buildGroups(props.setID, props.setPage));
        }
        if (!props.hidden) getItems();

    }, [props.hidden]);

    return (
        <View style={[styles.pageContianer, {
            display: props.hidden ? 'none' : 'inherit'
        }]}>
            <Text style={[globals.styles.text, { paddingTop: '1em' }]}>Which group is this transaction for?</Text>

            {groups}

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row' }}>
                <Button  style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Back' onClick={() => props.setPage(2)} />
            </View>
        </View>
    );
}

function SplitExpense(props) {

    const [splitList, setSplitList] = useState([]);

    useEffect(() => {
        async function getSplitList() {
            let json = null;

            if (props.id != null) {

                json = await getGroupInfo(props.id);
                if (json !== null) {

                    setSplitList(await getGroupMembers(json));
                }
            }
            else {
                json = await getFriendsInfo();
                if (json !== null) {

                    setSplitList(await getFriends(json));
                }
            }
        }
        if (!props.hidden) getSplitList();


    }, [props.hidden]);

    return (
        <View style={[styles.pageContianer, {
            display: props.hidden ? 'none' : 'inherit'
        }]}>
            <Text style={[globals.styles.text, { paddingTop: '1em' }]}>Which group is this transaction for?</Text>

            {splitList}

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row' }}>
                <Button style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Back' onClick={() => props.setPage(2)} />
                <Button style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Submit' onClick={() => props.setPage(2)} />
            </View>
        </View>
    );
}

function SplitListItem(props) {
    return (
        
        <View style={props.border ? globals.styles.listItemSeperator : globals.styles.listItem} >

            <Text style={globals.styles.listText}>{props.name}</Text>
            
        </View>
        
    );
}

async function buildGroups(setID, setPage) {
    let outputList = [];

    const groups = await getGroups();

    for (let i = 0; i < groups.length; i++) {
        outputList.push(<Button style={[globals.styles.formButton, { margin: 0, marginVertical: '.5em' }]} label={groups[i].group_name} onClick={
            () => { 
                setID(groups[i].group_id);
                setPage(4);
                }
            } />);
    }

    return outputList;
}

function getGroupMembers(json) {


    let outputList = [];

    for (let i = 0; i < json['members'].length; i++) {

        outputList.push(<SplitListItem key={i} border={i > 0} name={json['members'][i].username} id={json['members'][i].user_id} />);
    }

    return outputList;

}

function getFriends(json) {


    let outputList = [];

    for (let i = 0; i < json.length; i++) {

        outputList.push(<SplitListItem key={i} border={i > 0} name={json[i].username} id={json[i].user_id} />);
    }

    return outputList;

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
    pageContianer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: '3em',
        width: '9em',
        minWidth: '2em',
        borderRadius: 1,
        marginTop: '1em'
    }

});