import * as globals from '../utils/globals.js'

import { Text, View, Image, Modal } from '../utils/globals.js';
import { useRef, useState, createContext, useContext, useEffect } from 'react';

import { getGroups, getGroupInfo } from "../utils/groups.js";

import { getFriends } from "../utils/friends.js";

import Button from '../components/Button.js'
import { ModalContext } from './ModalContext.js';
import { GlobalContext } from '../components/GlobalContext.js';

const Logo = require('../assets/images/logo/logo-name-64.png');
import DenySvg from '../assets/images/bx-x.svg';
import SVGIcon from '../components/SVGIcon.js';
import OfflineUserSearch from './OfflineUserSearch.js';

const ExpenseContext = createContext(0);

const PAGES = {
    CHOOSE_NAME: 1,
    SELECT_SPLIT: 2,
    SELECT_GROUP: 3,
    SELECT_MEMBERS: 4,
    SPLIT_EXPENSE: 5

}

/**
 * Example formData layout
 *  {
 *      "group_id": 1, // Optional
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
    const [pageNum, setPageNum] = useState(props.groupID || props.profile ? PAGES.SPLIT_EXPENSE : PAGES.CHOOSE_NAME);
    const [groupID, setGroupID] = useState(props.groupID ? props.groupID : null);
    const [formData, setFormData] = useState({});

    const errorMessageRef = useRef(null);

    const { pushModal, popModal } = useContext(ModalContext);

    function handleChildClick(e) {
        e.stopPropagation();
    }

    // TODO refactor this modal
    /*return (
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
                onRequestClose={() => popModal()}>

                <View style={{ ...globals.styles.modalBackground, ...props.style}} onClick={(props.exit != undefined ? props.exit : () => popModal())}>
                    <View style={styles.create} onClick={handleChildClick}>

                        <Image source={Logo} style={styles.logo} />

                        <Text style={{ ...globals.styles.label, ...globals.styles.h2, ...{ padding: 0 }}}>NEW EXPENSE</Text>

                        <Text ref={errorMessageRef} id='createExpense_errorMessage' style={globals.styles.error}></Text>

                        <Text>
                            Under Construction!
                        </Text>

                    </View>
                </View>
            </Modal>
        </ExpenseContext.Provider>

    );*/

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
                onRequestClose={() => popModal()}>

                <View style={{ ...globals.styles.modalBackground, ...props.style}} onClick={(props.exit != undefined ? props.exit : () => popModal())}>
                    <View style={styles.create} onClick={handleChildClick}>

                        <Image source={Logo} style={styles.logo} />

                        <Text style={{ ...globals.styles.label, ...globals.styles.h2, ...{ padding: 0 }}}>NEW EXPENSE</Text>

                        <Text ref={errorMessageRef} id='createExpense_errorMessage' style={globals.styles.error}></Text>

                        <ChooseName />
                        <SelectSplit />
                        <SelectGroup />
                        <SelectMembers />

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

    const { pushModal, popModal } = useContext(ModalContext);
    const {reRender} = useContext(GlobalContext);

    let {
        pageNum:    [pageNum    , setPageNum],
        formData:   [formData   , setFormData],
        errorRef:    errorRef
    } = useContext(ExpenseContext);

    const onNameChange = () => { setNameDisabled(checkName(nameRef, errorRef)); }
    const onTotalChange = () => { setTotalDisabled(checkTotal(totalRef, errorRef)); }

    const [nameDisabled, setNameDisabled] = useState(true);
    const [totalDisabled, setTotalDisabled] = useState(true);

    const nameRef = useRef(null);
    const totalRef = useRef(null);
    const dateRef = useRef(null);
    const descriptionRef = useRef(null);
    const receiptRef = useRef(null);
    const [image, setImage] = useState(null);

    const updateImageSource = (e) => {
        setImage(e.target.files[0]);
    }

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

        let transaction_id = await submitForm(formData, errorRef);
        if (transaction_id != -1) {
            await uploadReceipt(image, transaction_id, errorRef);
            popModal();
            reRender();
        }
    }

    return (
        <View style={{
            ...styles.pageContainer, ...{
                display: pageNum != PAGES.CHOOSE_NAME ? 'none' : 'inherit'
        }}} >
            <Text style={{ ...globals.styles.text, ...{ paddingTop: '1em' }}}>Enter transaction name and description to get started</Text>

            <View style={globals.styles.labelContainer}>
                <Text style={{ ...globals.styles.h5, ...globals.styles.label}}>EXPENSE NAME *</Text>
            </View>

            <input tabIndex={0} ref={nameRef} placeholder=" Enter name of new expense" style={globals.styles.input} id='createExpense_name' name="Expense Name" onInput={onNameChange} />

            <View style={globals.styles.labelContainer}>
                <Text style={{ ...globals.styles.h5, ...globals.styles.label }}>EXPENSE TOTAL *</Text>
            </View>

            <input tabIndex={0} ref={totalRef} placeholder=" Enter total cost of expense" style={globals.styles.input} id='createExpense_amount' name="Expense Amount" step={.01} type='number' placeholder={0} min={0} onInput={onTotalChange} />
            
            <View style={globals.styles.labelContainer}>
                <Text style={{ ...globals.styles.h5, ...globals.styles.label}}>EXPENSE DATE</Text>
            </View>

            <input tabIndex={0} ref={dateRef} type="date" style={globals.styles.input} id='createExpense_date' name="Expense date" />

            <View style={globals.styles.labelContainer}>
                <Text style={{ ...globals.styles.h5, ...globals.styles.label}}>DESCRIPTION</Text>
            </View>

            <textarea tabIndex={0} ref={descriptionRef} placeholder=" Enter description" style={globals.styles.textarea} id='createExpense_description' name="Expense Description" />

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row-reverse' }}>
                <Button id="newExpense_chooseName_next" disabled={nameDisabled || totalDisabled} style={{ ...globals.styles.formButton, ...{ margin: '1em 0', width: '33%' } }} onClick={() => setPageNum(pageNum + 1)} >
                    <label htmlFor="newExpense_chooseName_next" style={globals.styles.buttonLabel} >
                        Next
                    </label>
                </Button>
                

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
        <View style={{
            ...styles.pageContainer, ...{
            display: pageNum != PAGES.SELECT_SPLIT ? 'none' : 'inherit'
        }}}>
            <Text style={{ ...globals.styles.text, ...{ paddingTop: '1em' }}}>Do you want to split between a group or friends?</Text>

            <Button id="newExpense_splitGroup" style={{ ...globals.styles.formButton, ...{ margin: '1.5em 0 .5em 0' } }} onClick={() => setPageNum(PAGES.SELECT_GROUP)} >
                <label htmlFor="newExpense_splitGroup" style={globals.styles.buttonLabel }>
                    Group
                </label>

            </Button>

            <Button id="newExpense_splitFriends" style={{ ...globals.styles.formButton, ...{ margin: '.5em 0' }}} onClick={
                () => {
                    setPageNum(PAGES.SELECT_MEMBERS);
                    setGroupID(null);
                    }   
                }
            >
                <label htmlFor="newExpense_splitFriends" style={globals.styles.buttonLabel}>
                    Friends
                </label>
            </Button>

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row' }}>
                
                <Button id="newExpense_selectSplit_back" style={{ ...globals.styles.formButton, ...{ margin: '1em 0', width: '33%' } }} onClick={() => setPageNum(pageNum - 1)} >
                    <label htmlFor="newExpense_selectSplit_back" style={globals.styles.buttonLabel} >
                        Back
                    </label>
                </Button>

            </View>

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
        <View style={{
            ...styles.pageContainer, ...{
            display: pageNum != PAGES.SELECT_GROUP ? 'none' : 'inherit'
        }}}>
            <Text style={{ ...globals.styles.text, ...{ paddingTop: '1em' }}}>Which group is this transaction for?</Text>

            <View style={{ ...globals.styles.list, ...{ gridTemplateColumns: '100%' } }} >
                {groups}
            </View>

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row' }}>
                <Button id="newExpense_selectGroup_back" style={{ ...globals.styles.formButton, ...{ margin: '1em 0', width: '33%' } }} onClick={() => setPageNum(pageNum - 1)} >
                    <label htmlFor="newExpense_selectGroup_back" style={globals.styles.buttonLabel} >
                        Back
                    </label>
                </Button>
            </View>
        </View>
    );
}

function SelectMembers() {
    let {
        pageNum: [pageNum, setPageNum],
        groupID: [groupID, setGroupID],
        formData: [formData, setFormData]
    } = useContext(ExpenseContext);

    const { currUserID } = useContext(GlobalContext);
    const { pushModal, popModal } = useContext(ModalContext);



    let [memberList, setMemberList] = useState([]);
    let [possibleMembers, setPossibleMembers]       = useState([]);

    const removeMember = (key) => {
        memberList = memberList.filter((member) => member.key != key);
        setMemberList(memberList);
    }

    const addMember = (details) => {
        memberList.push(<MemberListItem key={details.user_id} name={details.username} id={details.user_id} removeMember={removeMember} />);
        setMemberList(memberList.concat([]));
    }


    useEffect(() => {
        async function getMembers() {
            let json = null;

            if (groupID != null) {
                // Get group member list
                json = await getGroupInfo(groupID);

                if (json !== null) {
                    setPossibleMembers(json['members']);
                    memberList = await getGroupMembers(json, removeMember)
                    setMemberList(memberList);
                }
            }
            else {
                //Get friends list
                json = await getFriends();

                if (json !== null) {

                    setPossibleMembers(json);
                    memberList = [<MemberListItem key={-1} name='Me' id={-1} removeMember={removeMember} />];
                    setMemberList(memberList);
                }
            }
        }
        if (pageNum == PAGES.SELECT_MEMBERS) getMembers();

    }, [pageNum]);

    const addMemberModal = () => {

        let excludedMembers = [];
        for (let i = 0; i < memberList.length; i++) {
            excludedMembers.push(memberList[i].props.name);
        }
        console.log(excludedMembers);

        pushModal(<OfflineUserSearch
            users={possibleMembers}
            excludedUsers={excludedMembers}
            title="ADD MEMBER"
            label="Enter the username of the person you wish to add to this transaction"
            onSubmit={addMember}
            exit={() => popModal()}
            submitLabel="Add Member" /> )
    }


    return (
        <View style={{
            ...styles.pageContainer, ...{
                display: pageNum != PAGES.SELECT_MEMBERS ? 'none' : 'inherit'
            }
        }}>
            <Text style={{ ...globals.styles.text, ...{ paddingTop: '1em' } }}>Which users are a part of this transaction?</Text>

            <View style={{ ...globals.styles.list, ...{ gridTemplateColumns: '80% 20%', width: '75%', minHeight: '20em' } }} >
                {memberList}
                <Button id="newExpense_addMember" style={{ gridColumn: '1 / span 2', height: '2em' }} onClick={addMemberModal}>
                    <label htmlFor="newExpense_addMember" style={{ ...globals.styles.h5, ...{ cursor: 'pointer', color: globals.COLOR_GRAY } }}>
                        + Add Member
                    </label>
                </Button>
            </View>


            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row-reverse' }}>
                <Button id="newExpense_selectMember_next" style={{ ...globals.styles.formButton, ...{ margin: '1em 0', width: '33%' } }} onClick={() => setPageNum(pageNum + 1)} >
                    <label htmlFor="newExpense_selectMember_next" style={globals.styles.buttonLabel} >
                        Next
                    </label>
                </Button>
                <Button id="newExpense_selectMember_back" style={{ ...globals.styles.formButton, ...{ margin: '1em 0', width: '33%' } }} onClick={() => setPageNum(pageNum - 2)} >
                    <label htmlFor="newExpense_selectMember_back" style={globals.styles.buttonLabel} >
                        Back
                    </label>
                </Button>
            </View>
        </View>
    );
}


/**
 * 
 * @returns a page in which the user can select the amount each person owes/paid
 *
function SplitExpense() {

    let {
        pageNum: [pageNum, setPageNum],
        groupID: [groupID, setGroupID],
        formData: [formData, setFormData]
    } = useContext(ExpenseContext);

    const { currUserID } = useContext(GlobalContext);

    // I didn't write this code, but...
    //  refList is an ordered list of ref's to the input fields containing the amount paid/borrowed (?)
    //  splitList is the list of the SplitListItems elements with each participant and how much they paid/borrowed (?)
    //  paidList is (?)
    const [splitList, setSplitList] = useState([]);
    const [refList, setRefList] = useState([]);
    const [paidList, setPaidList] = useState([]);

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
                    setSplitList(await getGroupMembers(json, currUserID, setPaidList, setRefList));
                }
            }
            else {
                //Get friends list
                json = await getFriends();

                if (json !== null) {
                    setSplitList(await getFriendsList(json, currUserID, setPaidList, setRefList));
                }
            }
        }
        if (pageNum == PAGES.SPLIT_EXPENSE) getSplitList();

    }, [pageNum]);

    // Update form data to include participants list move on to name setting
    const onSubmit = () => {
        setPageNum(pageNum + 1);
        
        formData.group_id = groupID;
        formData.transaction_participants = [];

        for (let i = 0; i < splitList.length; i++) {

            //Dont add users with 0 values
            if (refList[i].current.value == "" || refList[i].current.value == "0") continue;

            formData.transaction_participants.push({
                user_id: splitList[i].props.id,
                amount: parseInt(parseFloat(refList[i].current.value).toFixed(2) * (paidList[i].current ? -100 : 100))
            })
        }
        setFormData(formData);

    }
    const splitPaid = (paid) => {
        let total = 0;
        let count = 0;
        for (let i = 0; i < refList.length; i++) {
            if (paidList[i].current == paid) {
                total += refList[i].current.value == "" ? 0 : parseInt(parseFloat(refList[i].current.value).toFixed(2) * 100);
                count++;
            }
            
        }
        for (let i = 0; i < refList.length; i++) {
            if (paidList[i].current == paid) refList[i].current.value = (total / count / 100).toFixed(2);

        }
    }
    

    return (
        <View style={{
            ...styles.pageContainer, ...{
            display: pageNum != PAGES.SPLIT_EXPENSE ? 'none' : 'inherit'
        }}}>
            <Text style={{ ...globals.styles.text, ...{ paddingTop: '1em' }}}>How much did each person contribute?</Text>

            <View style={{width: '75%', justifyContent: 'space-between', flexDirection: 'row' }}>
                <Button
                    id="newExpense_splitExpense_splitPaid"
                    style={{ width: 'auto', height: 'auto', marginTop: '.25em' }}
                    onClick={() => splitPaid(true)} >

                    <label htmlFor="newExpense_splitExpense_splitPaid" style={{ padding: '.25em', cursor: 'pointer', fontSize: '.75em', fontWeight: '500', color: globals.COLOR_BLUE }}>
                        Split Paid Evenly
                    </label>
                </Button>
                <Button
                    id="newExpense_splitExpense_splitBorrowed"
                    style={{ width: 'auto', height: 'auto', marginTop: '.25em' }}
                    onClick={() => splitPaid(false)} > 

                    <label htmlFor="newExpense_splitExpense_splitBorrowed" style={{ padding: '.25em',  cursor: 'pointer', fontSize: '.75em', fontWeight: '500', color: globals.COLOR_ORANGE }}>
                        Split Borrowed Evenly
                    </label>
                </Button>
            </View>
           

            <View style={{ ...globals.styles.list, ...{ gridTemplateColumns: '60% 40%', width: '75%' } }} >
                {splitList}
            </View>
            

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row' }}>
                <Button id="newExpense_splitExpense_back" style={{ ...globals.styles.formButton, ...{ margin: '1em 0', width: '33%' } }} onClick={() => setPageNum(PAGES.SELECT_SPLIT)} >
                    <label htmlFor="newExpense_splitExpense_back" style={globals.styles.buttonLabel} >
                        Back
                    </label>
                </Button>
                <Button id="newExpense_splitExpense_next" style={{ ...globals.styles.formButton, ...{ margin: '1em 0', width: '33%' } }} onClick={onSubmit} >
                    <label htmlFor="newExpense_splitExpense_next" style={globals.styles.buttonLabel} >
                        Next
                    </label>
                </Button>
                
            </View>
        </View>
    );
}*/

// The item that holds the input and user name for each person to be split with
// Generates a ref for each version and appends it to the refList
function SplitListItem(props) {

    const inputRef = useRef(null);
    const paid = useRef(true);
    const [reRender, setReRender] = useState(0);

    useEffect(() => {
        props.refList.push(inputRef);
        props.paidList.push(paid);


    }, []);

    function updateButton() {
        paid.current = !paid.current;
        setReRender(reRender + 1);
    }
    
    return (

        <>
            <Text style={{ ...globals.styles.listText, ...{ margin: 'auto 0' } }}>{props.name}</Text>
            <View style={{ flexDirection: 'row', width: 'auto', justifySelf: 'flex-end' }}>
                <Button id={"newExpense_splitExpense" + props.name + "_paid"}
                    style={{ width: 'auto', marginTop: '.25em' }}
                    onClick={updateButton} >
                    <label htmlFor={"newExpense_splitExpense" + props.name + "_paid"} style={{ padding: '.25em', cursor: 'pointer', fontWeight: '500', color: paid.current ? globals.COLOR_BLUE : globals.COLOR_ORANGE }}>
                        {paid.current ? "Paid" : "Borrowed"}
                    </label>

                </Button>

                <View style={{ width: '5em' }}>
                    <input ref={inputRef} style={{ ...globals.styles.input, ...{ width: '90%' }}} step={.01} type='number' placeholder={0} min={0}></input>

                </View>
            </View>
        </> 
        
    );
}

function MemberListItem(props) {
    //User is required to be a part of the transaction so dont give them the option to remove
    if (props.id == -1) {
        return (

            <>
                <Text style={{ ...globals.styles.listText, ...{ margin: 'auto 0', gridColumn: '1 / span 2' } }}>{props.name}</Text>
            </>

        );
    } else {
        return (

            <>
                <Text style={{ ...globals.styles.listText, ...{ margin: 'auto 0' } }}>{props.name}</Text>
                <Button aria-label="Remove expense member" style={{ ...styles.removeButton }} onClick={() => props.removeMember(props.id)} >
                    <SVGIcon src={DenySvg} style={{ fill: globals.COLOR_ORANGE, width: '2em' }} />
                </Button>

            </>
        );
    }  
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
        outputList.push(
            <Button id={"newExpense_selectGroup_" + groups[i].group_name} style={{ ...globals.styles.formButton, ...{ justifySelf: 'center', margin: '.5em 0' } }} key={i} onClick={
            () => { 
                setID(groups[i].group_id);
                setPage(PAGES.SELECT_MEMBERS);
                }} >
                <label htmlFor={"newExpense_selectGroup_" + groups[i].group_name} style={globals.styles.buttonLabel}>
                    {groups[i].group_name}
                </label>
            </Button>

        );
    }

    return outputList;
}

/**
 * Builds a list of MemberListItems and a refList from a group json
 * @param {JSON} json JSON object contianing group information, particularly a members array
 * @param {Function} setRefList function to set the refList variable of SelectMembers
 * @returns a list of MemberListItems
 */
function getGroupMembers(json, removeMember) {

    let outputList = [];

    outputList.push(<MemberListItem key={-1} name='Me' id={-1} removeMember={removeMember} />);

    for (let i = 0; i < json['members'].length; i++) {

        outputList.push(<MemberListItem key={json['members'][i].user_id} name={json['members'][i].username} id={json['members'][i].user_id} removeMember={removeMember} />);
    }
    return outputList;

}

/**
 * Builds a list of SplitListItems and a refList from a friends json
 * @param {JSON} json JSON object contianing friends array
 * @param {Function} setRefList function to set the refList variable of SplitExpense
 * @returns a list of SplitListItems
 */
function getFriendsList(json, removeMember) {

    let outputList = [];

    outputList.push(<MemberListItem key={-1} name='Me' id={-1} removeMember={removeMember} />);

    for (let i = 0; i < json.length; i++) {

        outputList.push(<MemberListItem key={json[i].user_id} name={json[i].username} id={json[i].user_id} removeMember={removeMember} />);
    }
    return outputList;

}


/**
* Checks value of expense name field and prevents user from submitting if too short
* @param { React.MutableRefObject } nameRef reference to expense name field
* @param { React.MutableRefObject } errorRef reference to error text field to print error text to
* @returns { boolean }                       validity of expense name
*/
function checkName(nameRef, errorRef) {

    if (nameRef.current.value.length >= 4) {
        errorRef.current.innerText = "";
        nameRef.current.removeAttribute("aria-invalid");
        nameRef.current.removeAttribute("aria-errormessage");
        return false;

    } else {
        errorRef.current.innerText = "Expense name must be at least 4 characters";
        nameRef.current.setAttribute("aria-invalid", true);
        nameRef.current.setAttribute("aria-errormessage", errorRef.current.id);
        return true;
    }
}


/**
* Checks value of expense total field and prevents user from submitting if no total is supplied
* @param { React.MutableRefObject } totalRef reference to expesne total field
* @param { React.MutableRefObject } errorRef reference to error text field to print error text to
* @returns { boolean }                       validity of expense total
*/
function checkTotal(totalRef, errorRef) {

    if (totalRef.current.value > 0) {
        errorRef.current.innerText = "";
        totalRef.current.removeAttribute("aria-invalid");
        totalRef.current.removeAttribute("aria-errormessage");
        return false;

    } else {
        errorRef.current.innerText = "Expense total must be greater than 0.00";
        totalRef.current.setAttribute("aria-invalid", true);
        totalRef.current.setAttribute("aria-errormessage", errorRef.current.id);
        return true;
    }
}

/**
 * Sends a post request to transactions.php in order to create a new transaction
 * @param {Object} formData object contianing all the details for the new transaction
 * @returns {int} transaction ID of the created transaction, -1 if failed
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

        let responseJSON = await await response.json();

        if (await response.ok) {
            return responseJSON.transaction_id;

        }
        else {
            errorRef.current.innerText = responseJSON.message;
            return -1;
        }
    }
    catch (error) {
        console.log("error in POST request to transactions (/transactions.php)");
        console.log(error);
    }

    return -1;
}

async function uploadReceipt(image, transaction_id, errorRef) {
    let imageData = new FormData();
    imageData.append("receipt", image);
    imageData.append("transaction_id", transaction_id);

    try {
        let response = await fetch("/receipt_upload.php", {
            method: 'POST',
            body: imageData,
            credentials: 'same-origin',
        });

        if (await response.ok) {
            return true;

        }
        else {
            let responseJSON = await await response.json();
            //This errorRef doesn't get updated since the wnidow closes anyways
            errorRef.current.innerText = responseJSON.message;
            return false;
        }
    }
    catch (error) {
        console.log("Error in POST request to receipt upload (/receipt_upload.php)");
        console.log(error);
    }

    return false;
}

const styles = {
    create: {
        minHeight: '30em',
        height: 'auto',
        maxHeight: '80vh',
        backgroundColor: globals.COLOR_WHITE,
        width: '30em',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1
    },
    pageContainer: {
        height: 'auto', 
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',

        overflowY: 'none',
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
    },
    removeButton: {
        width: '2em',
        height: '2em',
        fontSize: '1em',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        justifySelf: 'flex-end'
    },

};