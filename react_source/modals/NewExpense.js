import * as globals from '../utils/globals.js'

import { StyleSheet, Text, View, Image, Modal } from 'react-native';
import { router } from "expo-router";
import { useRef, useState, createContext, useContext, useEffect } from 'react';

import { getGroups, getGroupInfo } from "../utils/groups.js";


import Button from '../components/Button.js'
import { ModalContext } from './ModalContext.js';

const Logo = require('../assets/images/logo/logo-name-64.png');

const ExpenseContext = createContext(0);

const PAGES = {
    CHOOSE_NAME: 4,
    SELECT_SPLIT: 1,
    SELECT_GROUP: 2,
    SPLIT_EXPENSE: 3

}

export default function NewExpense(props) {

    const onSubmit = () => { submitForm(errorMessageRef); }

    const [pageNum, setPageNum] = useState(1);
    const [groupID, setGroupID] = useState(null);
    const [formData, setFormData] = useState({});

    const errorMessageRef = useRef(null);

    const setModal = useContext(ModalContext);

    function handleChildClick(e) {
        e.stopPropagation();
    }

    return (
        <ExpenseContext.Provider
            value={{
                pageNum: [pageNum, setPageNum],
                groupID: [groupID, setGroupID],
                errorRef: errorMessageRef,
                formData: [formData, setFormData]
            }}>
            <Modal
                transparent={true}
                visible={true}
                onRequestClose={() => setModal(null)}>

                <View style={[globals.styles.modalBackground, props.style]} onClick={(props.exit != undefined ? props.exit : () => setModal(null))}>
                    <View style={styles.create} onClick={handleChildClick}>

                        <Image source={Logo} style={styles.logo} onClick={onSubmit} />

                        <Text style={[globals.styles.label, globals.styles.h2, { padding: 0 }]}>NEW EXPENSE</Text>

                        <Text ref={errorMessageRef} id='createExpense_errorMessage' style={globals.styles.error}></Text>

                        <ChooseName />
                        <SelectSplit />
                        <SelectGroup />
                        <SplitExpense />

                    </View>
                </View>
            </Modal>
        </ExpenseContext.Provider>
        

    );
}

function ChooseName() {

    const setModal = useContext(ModalContext);

    const {
        pageNum:    [pageNum    , setPageNum],
        formData: [formData, setFormData],
        error: errorRef
    } = useContext(ExpenseContext);

    const onNameChange = () => { setNameDisabled(checkName(nameRef, errorRef)); }

    const [nameDisabled, setNameDisabled] = useState(false);

    const nameRef = useRef(null);
    const dateRef = useRef(null);
    const descriptionRef = useRef(null);

    const onSubmit = () => {
        let temp = formData;
        temp.transaction_name = nameRef.current.value;
        temp.transaction_description = descriptionRef.current.value;
        
        if (dateRef.current.value === "") {
            dateRef.current.valueAsDate = new Date();
        }
        temp.transaction_date = dateRef.current.value;

        setFormData(temp);

        if (submitForm(temp)) {
            setModal(null);
        }
    }

    return (
        <View style={[
                styles.pageContianer, {
                display: pageNum != PAGES.CHOOSE_NAME ? 'none' : 'inherit'
        }]} >
            <Text style={[globals.styles.text, { paddingTop: '1em' }]}>Enter transaction name and description to get started</Text>

            <View style={globals.styles.labelContainer}>
                <Text style={[globals.styles.h5, globals.styles.label]}>EXPENSE NAME *</Text>
            </View>

            <input tabIndex={1} ref={nameRef} placeholder=" Enter name of new expense" style={globals.styles.input} id='createExpense_name' name="Expense Name" onInput={onNameChange} />

            <View style={globals.styles.labelContainer}>
                <Text style={[globals.styles.h5, globals.styles.label]}>EXPENSE DATE *</Text>
            </View>

            <input tabIndex={2} ref={dateRef} type="date" style={globals.styles.input} id='createExpense_date' name="Expense date" />

            <View style={globals.styles.labelContainer}>
                <Text style={[globals.styles.h5, globals.styles.label]}>DESCRIPTION</Text>
            </View>

            <textarea tabIndex={3} ref={descriptionRef} placeholder=" Enter description" style={globals.styles.textarea} id='createExpense_description' name="Expense Description" />

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row-reverse' }}>
                <Button disabled={nameDisabled} style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Next' onClick={onSubmit} />
                <Button style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Back' onClick={() => setPageNum(pageNum - 1)} />
            </View>
        </View>
    );
}

function SelectSplit() {

    const {
        pageNum:    [pageNum    , setPageNum],
        groupID:    [groupID    , setGroupID],
    } = useContext(ExpenseContext);

    return (
        <View style={[styles.pageContianer, {
            display: pageNum != PAGES.SELECT_SPLIT ? 'none' : 'inherit'
        }]}>
            <Text style={[globals.styles.text, { paddingTop: '1em' }]}>Do you want to split between a group or friends?</Text>

            <Button style={[globals.styles.formButton, { margin: 0, marginBottom: '.5em', marginTop: '1.5em' }]} label='Group' onClick={() => setPageNum(PAGES.SELECT_GROUP)} />

            <Button style={[globals.styles.formButton, { margin: 0, marginVertical: '.5em' }]} label='Friends' onClick={
                () => {
                    setPageNum(PAGES.SPLIT_EXPENSE);
                    setGroupID(null);
                    }   
                } />

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row' }}>
                <Button style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Back' onClick={() => setPageNum(pageNum - 1)} />
            </View>
        </View>
    );
}

function SelectGroup() {

    const {
        pageNum:    [pageNum    , setPageNum],
        groupID:    [groupID    , setGroupID],
        formData:   [formData   , setFormData]
    } = useContext(ExpenseContext);

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        async function getItems() {

            setGroups(await buildGroups(setGroupID, setPageNum));
        }
        if (pageNum == PAGES.SELECT_GROUP) getItems();

    }, [pageNum]);

    return (
        <View style={[styles.pageContianer, {
            display: pageNum != PAGES.SELECT_GROUP ? 'none' : 'inherit'
        }]}>
            <Text style={[globals.styles.text, { paddingTop: '1em' }]}>Which group is this transaction for?</Text>

            {groups}

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row' }}>
                <Button  style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Back' onClick={() => setPageNum(pageNum - 1)} />
            </View>
        </View>
    );
}

function SplitExpense() {

    const {
        pageNum: [pageNum, setPageNum],
        groupID: [groupID, setGroupID],
        formData: [formData, setFormData]
    } = useContext(ExpenseContext);

    const [splitList, setSplitList] = useState([]);
    const [refList, setRefList] = useState([]);

    useEffect(() => {
        async function getSplitList() {

            let json = null;

            if (groupID != null) {

                json = await getGroupInfo(groupID);
                if (json !== null) {
                    setSplitList(await getGroupMembers(json, setRefList));
                }
            }
            else {
                json = await getFriendsInfo();
                if (json !== null) {

                    setSplitList(await getFriends(json, setRefList));
                }
            }
        }
        if (pageNum == PAGES.SPLIT_EXPENSE) getSplitList();

    }, [pageNum]);

    const onSubmit = () => {
        setPageNum(pageNum + 1);

        let temp = formData;

        temp.transaction_participants = [];

        for (let i = 0; i < splitList.length; i++) {
            if (refList[i].current.value == "" || refList[i].current.value == "0") continue;
            temp.transaction_participants.push({
                uid: splitList[i].props.id,
                amount: parseInt(parseFloat(refList[i].current.value).toFixed(2) * 100)
            })
        }
        setFormData(temp);

    }

    return (
        <View style={[styles.pageContianer, {
            display: pageNum != PAGES.SPLIT_EXPENSE ? 'none' : 'inherit'
        }]}>
            <Text style={[globals.styles.text, { paddingTop: '1em' }]}>How much did each person contribute?</Text>

            {splitList}

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row' }}>
                <Button style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Back' onClick={() => setPageNum(pageNum - 1)} />
                <Button style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Next' onClick={onSubmit} />
            </View>
        </View>
    );
}

function SplitListItem(props) {

    const inputRef = useRef(null);
    props.refList.push(inputRef);

    return (
        
        <View style={[styles.listItem, {width: '75%'}]} >

            <Text style={[globals.styles.listText, { marginVertical: 'auto' }]}>{props.name}</Text>
            <View style={{ width: '5em' }}>
                <input ref={inputRef} style={globals.styles.input} step={.01} type='number' placeholder={0}></input>
                
            </View>
           
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
                setPage(PAGES.SPLIT_EXPENSE);
                }} />);
    }

    return outputList;
}

function getGroupMembers(json, setRefList) {

    let refList = [];

    let outputList = [];

    for (let i = 0; i < json['members'].length; i++) {

        outputList.push(<SplitListItem refList={refList} key={i} border={i > 0} name={json['members'][i].username} id={json['members'][i].user_id} />);
    }

    setRefList(refList);
    return outputList;

}

async function getFriendsInfo() {

    // do the POST request
    try {
        let response = await fetch("/friendships.php", { method: 'GET', credentials: 'same-origin' });

        if (response.ok) {
            let json = await response.json();
            if (json != null)
                return json

        }
        else {
            console.log(response.json()['message']);
            return null;
        }
    }
    catch (error) {
        console.log("error in GET request to friendships (/friendships.php)");
        console.log(error);
    }

    return null;
}

function getFriends(json, setRefList) {

    let refList = [];

    let outputList = [];

    for (let i = 0; i < json.length; i++) {

        outputList.push(<SplitListItem refList={refList} key={i} border={i > 0} name={json[i].username} id={json[i].user_id} />);
    }

    setRefList(refList);
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

async function submitForm(formData) {

    console.log(JSON.stringify(formData));
    try {
        let response = await fetch("/transactions.php", {
            method: 'POST',
            body: JSON.stringify(formData),
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            return;

        }
        else {
            console.log(response.json()['message']);
            return null;
        }
    }
    catch (error) {
        console.log("error in POST request to transactions (/transactions.php)");
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
    listItem: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'

    },
    logo: {
        height: '3em',
        width: '9em',
        minWidth: '2em',
        borderRadius: 1,
        marginTop: '1em'
    }

});