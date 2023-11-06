import * as globals from '../utils/globals.js'

import { StyleSheet, Text, View, Image, Modal } from 'react-native';
import { router } from "expo-router";
import { useRef, useState, createContext, useContext, useEffect } from 'react';

import { getGroups, getGroupInfo } from "../utils/groups.js";

import { getFriends } from "../utils/friends.js";

import Button from '../components/Button.js'
import { ModalContext } from './ModalContext.js';
import { GlobalContext } from '../components/GlobalContext.js';

const Logo = require('../assets/images/logo/logo-name-64.png');

const ExpenseContext = createContext(0);

const PAGES = {
    CHOOSE_NAME: 4,
    SELECT_SPLIT: 1,
    SELECT_GROUP: 2,
    SPLIT_EXPENSE: 3

}

/**
 * Example formData layout
 *  {
        "transaction_name":"Halal Shack",
        "transaction_date":"2023-09-29",
        "transaction_description":"Bought you fools some food",
        "transaction_participants":[ 
            {
                "user_id":1,
                "amount":20
            },
            {
                "user_id": 2,
                "amount":10
            } 
        ]
    }
 */

/**
 * Base modal that handles all the subpages for creating a new expense
 * Can be passed a groupID prop to skip the first two pages (not yet though)
 * @param {any} props
 * @returns
 */
export default function NewExpense(props) {

    //Variables to pass down to all children as a context so that they know and can edit the data of others
    const [pageNum, setPageNum] = useState(1);
    const [groupID, setGroupID] = useState(null);
    const [formData, setFormData] = useState({});

    const errorMessageRef = useRef(null);

    const setModal = useContext(ModalContext);

    function handleChildClick(e) {
        e.stopPropagation();
    }

    //Provide the context including pageNum, groupId, errorRef, and formData
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

                        <Image source={Logo} style={styles.logo} />

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

/**
 * Allows user to choose name, date, and description for a the transaction, name is validated to be more than 4 chars, date is set to today if not selected
 * @returns page for choosing name, date and description
 */
function ChooseName() {

    const setModal = useContext(ModalContext);

    let {
        pageNum:    [pageNum    , setPageNum],
        formData:   [formData   , setFormData],
        errorRef:    errorRef
    } = useContext(ExpenseContext);

    const onNameChange = () => { setNameDisabled(checkName(nameRef, errorRef)); }

    const [nameDisabled, setNameDisabled] = useState(false);

    const nameRef = useRef(null);
    const dateRef = useRef(null);
    const descriptionRef = useRef(null);

    //Sets appropriate values of form data before updating the global version 
    //and then pushing the value to the web request
    async function onSubmit() {
        formData.transaction_name = nameRef.current.value;
        formData.transaction_description = descriptionRef.current.value;
        
        if (dateRef.current.value === "") {
            //If date is empty set to todays date
            dateRef.current.valueAsDate = new Date();
        }
        formData.transaction_date = dateRef.current.value;

        setFormData(formData);

        if (await submitForm(formData, errorRef)) {
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
                <Text style={[globals.styles.h5, globals.styles.label]}>EXPENSE DATE</Text>
            </View>

            <input tabIndex={2} ref={dateRef} type="date" style={globals.styles.input} id='createExpense_date' name="Expense date" />

            <View style={globals.styles.labelContainer}>
                <Text style={[globals.styles.h5, globals.styles.label]}>DESCRIPTION</Text>
            </View>

            <textarea tabIndex={3} ref={descriptionRef} placeholder=" Enter description" style={globals.styles.textarea} id='createExpense_description' name="Expense Description" />

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row-reverse' }}>
                <Button disabled={nameDisabled} style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Submit' onClick={onSubmit} />
                <Button style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Back' onClick={() => setPageNum(pageNum - 1)} />
            </View>
        </View>
    );
}

/**
 * 
 * @returns a page for selecting the method in which a user would like to split either groups or friends
 */
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
                }
            />

        </View>
    );
}

/**
 * 
 * @returns a page in which the user selects the group for which they would like to split between
 */
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

/**
 * 
 * @returns a page in which the user can select the amount each person owes/paid
 */
function SplitExpense() {

    let {
        pageNum: [pageNum, setPageNum],
        groupID: [groupID, setGroupID],
        formData: [formData, setFormData]
    } = useContext(ExpenseContext);

    const { currUserID } = useContext(GlobalContext);

    const [splitList, setSplitList] = useState([]);
    const [refList, setRefList] = useState([]);

    // If users selected a group, groupID will be set and so we get the member list for that group
    // Otherwise get the users friends
    // Pass a setRefList variable so that the unknown number of inputs can be accessed 
    useEffect(() => {
        async function getSplitList() {
            let json = null;

            if (groupID != null) {
                // Get group member list
                json = await getGroupInfo(groupID);

                if (json !== null) {
                    setSplitList(await getGroupMembers(json, currUserID, setRefList));
                }
            }
            else {
                //Get friends list
                json = await getFriends();

                if (json !== null) {
                    setSplitList(await getFriendsList(json, currUserID, setRefList));
                }
            }
        }
        if (pageNum == PAGES.SPLIT_EXPENSE) getSplitList();

    }, [pageNum]);

    // Update form data to include participants list move on to name setting
    const onSubmit = () => {
        setPageNum(pageNum + 1);

        formData.transaction_participants = [];

        for (let i = 0; i < splitList.length; i++) {
            //Dont add users with 0 values
            if (refList[i].current.value == "" || refList[i].current.value == "0") continue;

            formData.transaction_participants.push({
                user_id: splitList[i].props.id,
                amount: parseInt(parseFloat(refList[i].current.value).toFixed(2) * 100)
            })
        }
        setFormData(formData);

    }

    return (
        <View style={[styles.pageContianer, {
            display: pageNum != PAGES.SPLIT_EXPENSE ? 'none' : 'inherit'
        }]}>
            <Text style={[globals.styles.text, { paddingTop: '1em' }]}>How much did each person contribute?</Text>

            {splitList}

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row' }}>
                <Button style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Back' onClick={() => setPageNum(pageNum - 2)} />
                <Button style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Next' onClick={onSubmit} />
            </View>
        </View>
    );
}

// The item that holds the input and user name for each person to be split with
// Generates a ref for each version and appends it to the refList
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

/**
 * Builds a list of groups that the user is part of and converts them to button
 * @param {Function} setID function to set groupID variable
 * @param {Function} setPage function to set pageNum variable
 * @returns a list of Button elements
 */
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

/**
 * Builds a list of SplitListItems and a refList from a group json
 * @param {JSON} json JSON object contianing gorup information, particularly a members array
 * @param {Function} setRefList function to set the refList variable of SplitExpense
 * @returns a list of SplitListItems
 */
function getGroupMembers(json, currUserID, setRefList) {

    let refList = [];

    let outputList = [];

    outputList.push(<SplitListItem refList={refList} key={-1} name='You' id={currUserID} />);

    for (let i = 0; i < json['members'].length; i++) {

        outputList.push(<SplitListItem refList={refList} key={i} name={json['members'][i].username} id={json['members'][i].user_id} />);
    }

    setRefList(refList);
    return outputList;

}

/**
 * Builds a list of SplitListItems and a refList from a friends json
 * @param {JSON} json JSON object contianing friends array
 * @param {Function} setRefList function to set the refList variable of SplitExpense
 * @returns a list of SplitListItems
 */
function getFriendsList(json, currUserID, setRefList) {

    let refList = [];

    let outputList = [];

    outputList.push(<SplitListItem refList={refList} key={-1} name='You' id={currUserID} />);

    for (let i = 0; i < json.length; i++) {

        outputList.push(<SplitListItem refList={refList} key={i} name={json[i].username} id={json[i].user_id} />);
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

/**
 * Sends a post request to transactions.php in order to create a new transaction
 * @param {Object} formData object contianing all the details for the new transaction
 * @returns {Boolean} whether or not a new transaction was created
 */
async function submitForm(formData, errorRef) {

    try {
        let response = await fetch("/transactions.php", {
            method: 'POST',
            body: JSON.stringify(formData),
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (await response.ok) {
            return true;

        }
        else {
            let responseJSON = await await response.json();
            errorRef.current.innerText = responseJSON.message;
            return false;
        }
    }
    catch (error) {
        console.log("error in POST request to transactions (/transactions.php)");
        console.log(error);
    }
   return false;
}

const styles = StyleSheet.create({
    create: {
        minHeight: '30em',
        height: 'auto',
        maxHeight: '80vh',
        backgroundColor: globals.COLOR_WHITE,
        width: '25em',
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