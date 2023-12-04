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
import VerifyAction from './VerifyAction.js';

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
   {
       "group_id": 1, // Optional
       "transaction_name": "Halal Shack",
       "transaction_date": "2023-09-29",
       "transaction_description": "Bought you fools some food",
       "amount": 2000,
       "transaction_participants": [ 
           {
               "user_id": 1,
               "spent": 1000, // $10
               "paid": 0
           },
           {
               "user_id":  2,
               "spent": 1000, // $10
               "paid": 2000 // $10
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
    const [memberList, setMemberList] = useState([]);
    const [formData, setFormData] = useState({});
    const [image, setImage] = useState(null);
    const [total, setTotal] = useState(0);
    // this will store the transactionID in case the transaction was created successfully, but the
    const transactionIDRef = useRef(0);

    const errorMessageRef = useRef(null);

    const { pushModal, popModal } = useContext(ModalContext);

    function handleChildClick(e) {
        e.stopPropagation();
    }

    const exit = () => {
        
         pushModal(<VerifyAction label={"Are you sure you want to discard this transaction?"} accept={() => popModal(2)} />);
       
    }
    //Provide the context including pageNum, groupId, errorRef, and formData
    return (
        <ExpenseContext.Provider
            value={{
                pageNum:    [pageNum, setPageNum],
                total:      [total, setTotal],
                groupID:    [groupID, setGroupID],
                formData:   [formData, setFormData],
                image:      [image, setImage],
                memberList: [memberList, setMemberList],
                errorRef: errorMessageRef,
                transactionIDRef: transactionIDRef
            }}>
            <Modal
                transparent={true}
                visible={true}
                onRequestClose={() => exit()}>

                <View style={{ ...globals.styles.modalBackground, ...props.style}} onClick={(props.exit != undefined ? props.exit : () => exit())}>
                    <View style={styles.create} onClick={handleChildClick}>

                        <Image source={Logo} style={styles.logo} />

                        <Text style={{ ...globals.styles.label, ...globals.styles.h2, ...{ padding: 0 }}}>NEW EXPENSE</Text>

                        <Text ref={errorMessageRef} id='createExpense_errorMessage' style={{...globals.styles.error, visibility: 'hidden'}}>not an error</Text>

                        <ChooseName />
                        <SelectSplit />
                        <SelectGroup />
                        <SelectMembers />
                        <SplitExpense />

                    </View>
                </View>
            </Modal>
        </ExpenseContext.Provider>

    );
}

/**
 * Allows user to choose name, total, date, and description for a the transaction, name is validated to be more than 4 chars, total is validated to > 0, date is set to today if not selected
 * @returns page for choosing name, date and description
 */
function ChooseName() {

    let {
        pageNum:    [pageNum, setPageNum],
        formData:   [formData, setFormData],
        total:      [total, setTotal],
        image:      [image, setImage],
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

    const updateImageSource = (e) => {
        setImage(e.target.files[0]);
    }

    //Sets appropriate values of form data before updating the global version 
    //and then pushing the value to the web request
    async function onSubmit() {
        setPageNum(pageNum + 1);
        let newTotal = parseInt(totalRef.current.value * 100);
        setTotal(newTotal);

        formData.transaction_name = nameRef.current.value;
        formData.transaction_description = descriptionRef.current.value;
        formData.amount = newTotal;
        
        if (dateRef.current.value === "") {
            //If date is empty set to todays date
            dateRef.current.valueAsDate = new Date();
        }
        formData.transaction_date = dateRef.current.value;

        setFormData(formData);

        
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
                <Text style={{ ...globals.styles.h5, ...globals.styles.label }}>EXPENSE TOTAL ($) *</Text>
            </View>

            <input tabIndex={0} ref={totalRef} style={globals.styles.input} id='createExpense_amount' name="Expense Amount" step={.01} type='number' placeholder={0} min={0} onInput={onTotalChange} />
            
            <View style={globals.styles.labelContainer}>
                <Text style={{ ...globals.styles.h5, ...globals.styles.label}}>EXPENSE DATE</Text>
            </View>

            <input tabIndex={0} ref={dateRef} type="date" style={globals.styles.input} id='createExpense_date' name="Expense date" />

            <View style={globals.styles.labelContainer}>
                <Text style={{ ...globals.styles.h5, ...globals.styles.label}}>DESCRIPTION</Text>
            </View>

            <textarea tabIndex={0} ref={descriptionRef} placeholder=" Enter description" style={globals.styles.textarea} id='createExpense_description' name="Expense Description" />

            <View style={globals.styles.labelContainer}>
                <Text style={{ ...globals.styles.h5, ...globals.styles.label }}>UPLOAD RECEIPT</Text>
            </View>

            <input ref={receiptRef} type="file" accept="image/*" onInput={updateImageSource} />

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row-reverse' }}>
                <Button id="newExpense_chooseName_next" disabled={nameDisabled || totalDisabled} style={{ ...globals.styles.formButton, ...{ margin: '1em 0', width: '33%' } }} onClick={() => onSubmit()} >
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
        pageNum:    [pageNum, setPageNum],
        groupID:    [groupID, setGroupID],
        memberList: [memberList, setMemberList],
        errorRef:   errorRef
    } = useContext(ExpenseContext);

    const { currUserID } = useContext(GlobalContext);
    const { pushModal, popModal } = useContext(ModalContext);

    const [submitDisabled, setSubmitDisabled] = useState(true);

    let [chosenMembers, setChosenMembers] = useState([]);
    let [possibleMembers, setPossibleMembers] = useState([]);

    const removeMember = (key) => {
        chosenMembers = chosenMembers.filter((member) => member.key != key);
        setChosenMembers(chosenMembers);
        setSubmitDisabled(checkMemberList());
    }

    const addMember = (details) => {
        chosenMembers.push(<MemberListItem key={details.user_id} name={details.username} id={details.user_id} removeMember={removeMember} />);
        setChosenMembers(chosenMembers.concat([]));
        setSubmitDisabled(checkMemberList());
    }

    // return true if the member list is invalid
    const checkMemberList = () => {
        if (chosenMembers.length < 2) {
            errorRef.current.innerText = "Transaction must have at least 2 participants";
            errorRef.current.style.visibility = 'visible';
            return true;
        }
        errorRef.current.style.visibility = 'hidden';
        return false;
    }

    useEffect(() => {
        setSubmitDisabled(true);
        async function getMembers() {
            let json = null;

            if (groupID != null) {
                // Get group member list
                json = await getGroupInfo(groupID);

                if (json !== null) {
                    setPossibleMembers(json['members']);
                    chosenMembers = await getGroupMembers(json, removeMember)
                    setChosenMembers(chosenMembers);
                }
            }
            else {
                //Get friends list
                json = await getFriends();

                if (json !== null) {

                    setPossibleMembers(json);
                    chosenMembers = [<MemberListItem key={-1} name='Me' id={-1} removeMember={removeMember} />];
                    setChosenMembers(chosenMembers);
                }
            }
        }
        if (pageNum == PAGES.SELECT_MEMBERS && chosenMembers.length == 0) getMembers();

    }, [pageNum]);

    const addMemberModal = () => {

        let excludedMembers = [];
        for (let i = 0; i < chosenMembers.length; i++) {
            excludedMembers.push(chosenMembers[i].props.name);
        }

        pushModal(<OfflineUserSearch
            users={possibleMembers}
            excludedUsers={excludedMembers}
            title="ADD MEMBER"
            label="Enter the username of the person you wish to add to this transaction"
            onSubmit={addMember}
            exit={() => popModal()}
            submitLabel="Add Member" /> )
    }

    const onSubmit = () => {
        setPageNum(pageNum + 1);

        memberList = [];

        for (let i = 0; i < chosenMembers.length; i++) {
            memberList.push({
                id: chosenMembers[i].props.id == -1 ? currUserID : chosenMembers[i].props.id,
                name: chosenMembers[i].props.name
            })
        }
        setMemberList(memberList.concat([]));

        
    }


    return (
        <View style={{
            ...styles.pageContainer, ...{
                display: pageNum != PAGES.SELECT_MEMBERS ? 'none' : 'inherit'
            }
        }}>
            <Text style={{ ...globals.styles.text, ...{ paddingTop: '1em' } }}>Which users are a part of this transaction?</Text>

            <View style={{ ...globals.styles.list, ...{ gridTemplateColumns: '80% 20%', width: '75%', minHeight: '20em', marginTop: '1em' } }} >
                {chosenMembers}
                <Button id="newExpense_addMember" style={{ gridColumn: '1 / span 2', height: '2em' }} onClick={addMemberModal}>
                    <label htmlFor="newExpense_addMember" style={{ ...globals.styles.h5, ...{ cursor: 'pointer', color: globals.COLOR_GRAY } }}>
                        + Add Member
                    </label>
                </Button>
            </View>


            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row-reverse' }}>
                <Button id="newExpense_selectMember_next" style={{ ...globals.styles.formButton, ...{ margin: '1em 0', width: '33%' } }} onClick={() => onSubmit()} disabled={submitDisabled} >
                    <label htmlFor="newExpense_selectMember_next" style={globals.styles.buttonLabel} >
                        Next
                    </label>
                </Button>
                <Button id="newExpense_selectMember_back" style={{ ...globals.styles.formButton, ...{ margin: '1em 0', width: '33%' } }} onClick={() => {
                    setPageNum(pageNum - 2);
                    setChosenMembers([]);
                    }
                } >
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
 */
function SplitExpense() {

    let {
        pageNum:    [pageNum, setPageNum],
        groupID:    [groupID, setGroupID],
        formData:   [formData, setFormData],
        total:      [total, setTotal],
        image:      [image, setImage],
        memberList: [memberList, setMemberList],
        errorRef:    errorRef,
        transactionIDRef: transactionIDRef
    } = useContext(ExpenseContext);

    let { popModal } = useContext(ModalContext);
    let { reRender } = useContext(GlobalContext);
    
    //  splitList is the list of the SplitListItems elements with each participant name and the 2 inputs for how much they spent
    //  inputRefs is the list of the refs for inputs for each splitList entry accessed as follows inputRefs[i].paid & inputRefs[i].spent

    const [splitList, setSplitList] = useState([]);
    const [inputRefs, setInputRefs] = useState([]);

    const [isPercent, setIsPercent] = useState(false);

    const [submitDisabled, setSubmitDisabled] = useState(true);

    // this ref stores the callback that will get passed to SplitListItems
    // needs to be a ref because onSplitAmountChange will change each time the state changes
    const onAmountChangeCallbackRef = useRef(null);

    // create function that checks the split is valid when things are changed
    const onSplitAmountChange = () => { setSubmitDisabled(checkSplit(total, inputRefs, isPercent, errorRef)); };
    onAmountChangeCallbackRef.current = onSplitAmountChange;

    // re-check totals when switching between split by % and split by $
    useEffect(() => {
        if (pageNum == PAGES.SPLIT_EXPENSE) onSplitAmountChange();
    }, [pageNum, isPercent]);

    // Build the list of members from the membersList context
    // Pass a setInputRefs variable so that the unknown number of inputs can be accessed
    useEffect(() => {
        setIsPercent(false);
        setSubmitDisabled(true);
        function getMembers() {
            setSplitList(buildSplitList(memberList, setInputRefs, onAmountChangeCallbackRef));
        }

        if (pageNum == PAGES.SPLIT_EXPENSE) getMembers();

    }, [pageNum]);

    // Update form data to include participants list move on to name setting
    const onSubmit = async () => {
        formData.group_id = groupID;
        formData.transaction_participants = [];

        // if for some reason onSubmit was not disabled, check that split is good before submitting
        if (checkSplit(total, inputRefs, isPercent, errorRef))
        {
            setSubmitDisabled(true);
            return;
        }
        
        if (isPercent) {
            let totalPaid = total;
            let totalSpent = total;
            for (let i = 0; i < splitList.length; i++) {

                //Dont add users with 0 values
                if ((inputRefs[i].paid.current.value == "" || inputRefs[i].paid.current.value == "0")
                    && (inputRefs[i].spent.current.value == "" || inputRefs[i].spent.current.value == "0")) continue;

                //Calculate amount based on percent 
                let paidAmount =    inputRefs[i].paid.current.value != "" ?
                                    parseInt(parseFloat(inputRefs[i].paid.current.value).toFixed(2) / 100 * total) :
                                    0;
                let spentAmount =    inputRefs[i].spent.current.value != "" ?
                                        parseInt(parseFloat(inputRefs[i].spent.current.value).toFixed(2) / 100 * total) :
                                        0;
                formData.transaction_participants.push({
                    user_id: splitList[i].props.id,
                    paid: paidAmount,
                    spent: spentAmount
                })

                //Subtract calculated amount from total
                totalPaid -= paidAmount;
                totalSpent -= spentAmount;
            }

            //Add remainder to last contributing person on list - unlucky!
            formData.transaction_participants[formData.transaction_participants.length - 1].paid += totalPaid;
            formData.transaction_participants[formData.transaction_participants.length - 1].spent += totalSpent;

        } else {
            for (let i = 0; i < splitList.length; i++) {

                //Dont add users with 0 values
                if ((inputRefs[i].paid.current.value == "" || inputRefs[i].paid.current.value == "0")
                    && (inputRefs[i].spent.current.value == "" || inputRefs[i].spent.current.value == "0")) continue;

                formData.transaction_participants.push({
                    user_id: splitList[i].props.id,
                    paid: inputRefs[i].paid.current.value != "" ? parseInt(parseFloat(inputRefs[i].paid.current.value).toFixed(2) * 100) : 0,
                    spent: inputRefs[i].spent.current.value != "" ? parseInt(parseFloat(inputRefs[i].spent.current.value).toFixed(2) * 100) : 0
                })
            }
        }

        if (formData.transaction_participants.length < 2)
        {
            errorRef.current.innerText = "Transaction must have at least 2 participants";
            errorRef.current.style.visibility = 'visible';
            setSubmitDisabled(true);
            return;
        }

        setFormData(formData);

        // check if transaction ID was already created, meaning the transaction was created properly but the receipt upload failed
        if (!transactionIDRef.current > 0) {
            transactionIDRef.current = await submitForm(formData, errorRef);
        }
        if (transactionIDRef.current > 0) {
            if (image != null) {
                if (!uploadReceipt(image, transactionIDRef.current, errorRef)) {
                    return;
                };
            }
            popModal();
            reRender();
        }

    }

    const splitEvenly = (paid) => {
       //Evenly split the expense among either the paid or spent section
        let amount = isPercent ? 10000 : total; // 10000 == 100% because it gets divided by 100
        for (let i = 0; i < inputRefs.length; i++) {
            if (i == inputRefs.length - 1) {
                //Add remainder to last user
                if (paid) {
                    inputRefs[i].paid.current.value = ((amount / inputRefs.length + (amount % inputRefs.length)) / 100).toFixed(2);
                } else {
                    inputRefs[i].spent.current.value = ((amount / inputRefs.length + (amount % inputRefs.length)) / 100).toFixed(2);
                }
            } else {
                //set value to total/numUsers 
                if (paid) {
                    inputRefs[i].paid.current.value = ((amount / inputRefs.length) / 100).toFixed(2);
                } else {
                    inputRefs[i].spent.current.value = ((amount / inputRefs.length) / 100).toFixed(2);
                }
            } 
        }
        onSplitAmountChange();
    }

    const changePercent = () => {
        setIsPercent(!isPercent);
        for (let i = 0; i < inputRefs.length; i++) {
            //Switch displayed symbol next to inputs
            inputRefs[i].symbol.current.innerText = isPercent ? "$" : "%"; 
            // TODO also change the paid and spent amounts to their equivalent in the other system
        }
    }

    return (
        <View style={{
            ...styles.pageContainer, ...{
            display: pageNum != PAGES.SPLIT_EXPENSE ? 'none' : 'inherit'
        }}}>
            <Text style={{ ...globals.styles.text, ...{ paddingTop: '1em' }}}>How much did each person contribute?</Text>
           

            <View style={{ ...globals.styles.list, ...{ gridTemplateColumns: '40% 5% 25% 30%', width: '85%', minHeight: '20em' } }} >

                <Text style={{ ...globals.styles.listHeader, ...{ textAlign: 'center', padding: 0, margin: '.5em 0 0', gridColumn: '1 / span 4' } }}>Total: ${(total / 100).toFixed(2)}</Text>
                <Button id="newExpense_splitExpense_switch" style={{ ...globals.styles.formButton, ...{ gridColumn: '1 / span 4', height: '1.25em', width: '10em', margin: '.5em 0', justifySelf: 'center' } }} onClick={() => changePercent()} >
                    <label htmlFor="newExpense_splitExpense_switch" style={{ ...globals.styles.buttonLabel, ...{fontSize: '1em'}}} >
                        {isPercent ? "Split by $" : "Split by %"}
                    </label>
                </Button>

                <Text style={{ ...globals.styles.smallListHeader, ...{ padding: 0, fontSize: '1em', fontWeight: '600', gridColumn: '1 / span 2' } }}>USERNAME</Text>
                <Text style={{ ...globals.styles.smallListHeader, ...{ padding: 0, color: globals.COLOR_BLUE, fontSize: '1em', fontWeight: '600', textAlign: 'center' } }}>PAID</Text>
                <Text style={{ ...globals.styles.smallListHeader, ...{ padding: 0, color: globals.COLOR_ORANGE, fontSize: '1em', fontWeight: '600', textAlign: 'center' } }}>SPENT</Text>

                <View />
                <View />
                <Button id="newExpense_splitExpense_splitPaid" style={{ ...globals.styles.formButton, ...{ height: '1em', margin: '.25em 0', justifySelf: 'center' } }} onClick={() => splitEvenly(true)} >
                    <label htmlFor="newExpense_splitExpense_splitPaid" style={{ ...globals.styles.buttonLabel, ...{ fontSize: '.85em' } }} >
                        SPLIT
                    </label>
                </Button>
                <Button id="newExpense_splitExpense_splitSpent" style={{ ...globals.styles.formButton, ...{ height: '1em', margin: '.25em .25em', justifySelf: 'center' } }} onClick={() => splitEvenly(false)} >
                    <label htmlFor="newExpense_splitExpense_splitSpent" style={{ ...globals.styles.buttonLabel, ...{ fontSize: '.85em' } }} >
                        SPLIT
                    </label>
                </Button>

                {splitList}
            </View>
            

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row' }}>
                <Button id="newExpense_splitExpense_back" style={{ ...globals.styles.formButton, ...{ margin: '1em 0', width: '33%' } }} onClick={() => setPageNum(pageNum - 1)} >
                    <label htmlFor="newExpense_splitExpense_back" style={globals.styles.buttonLabel} >
                        Back
                    </label>
                </Button>
                <Button id="newExpense_splitExpense_next" style={{ ...globals.styles.formButton, ...{ margin: '1em 0', width: '33%' } }} onClick={onSubmit} disabled={submitDisabled}>
                    <label htmlFor="newExpense_splitExpense_next" style={globals.styles.buttonLabel} >
                        Submit
                    </label>
                </Button>
                
            </View>
        </View>
    );
}

// The item that holds the input and user name for each person to be split with
// Generates a ref for each version and appends it to the refList
function SplitListItem(props) {

    const inputRefPaid = useRef(null);
    const inputRefSpent = useRef(null);
    const inputRefSymbol = useRef(null);

    useEffect(() => {
        inputRefPaid.current.value = 0;
        inputRefSpent.current.value = 0;
        inputRefSymbol.current.innerText = "$";
        //Create json object containing refs to important values
        props.inputList.push({ symbol: inputRefSymbol, paid: inputRefPaid, spent: inputRefSpent});

    });

    const onAmountChange = () => {
        // callback ref will get updated with the parameters of the latest state
        if (props.onAmountChangeCallbackRef.current != null)
        {
            props.onAmountChangeCallbackRef.current();
        }
    }

    return (

        <>
            <Text style={{ ...globals.styles.listText, ...{ margin: 'auto 0' } }}>{props.name}</Text>
            <Text ref={inputRefSymbol} style={{ ...globals.styles.listText, ...{ margin: 'auto 0', textAlign: 'flex-end' } }}>$</Text>
            <View style={{ flexDirection: 'row', width: 'auto', justifyContent: 'center' }}>

                <View style={{ width: '5em' }}>
                    <input ref={inputRefPaid} style={{ ...globals.styles.input, ...{ width: '100%' }}} step={.01} type='number' placeholder={0} min={0} onInput={onAmountChange}></input>

                </View>
            </View>
            <View style={{ flexDirection: 'row', width: 'auto', justifyContent: 'center' }}>

                <View style={{ width: '5em' }}>
                    <input ref={inputRefSpent} style={{ ...globals.styles.input, ...{ width: '100%' } }} step={.01} type='number' placeholder={0} min={0} onInput={onAmountChange}></input>

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
 * Builds a list of MemberListItems
 * @param {JSON} json JSON object containing group information, particularly a members array
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
 * Builds a list of SplitListItems
 * @param {JSON[]} members JSON array containing members
 * @param {Function} setInputRefs Function pointer to change inputRefs in SplitExpense
 * @returns a list of SplitListItems
 */
function buildSplitList(members, setInputRefs, onAmountChangeCallbackRef) {

    let outputList = [];
    let inputRefs = [];
    //console.log(members);
    for (let i = 0; i < members.length; i++) {

        outputList.push(<SplitListItem key={members[i].id} name={members[i].name} id={members[i].id} inputList={inputRefs} onAmountChangeCallbackRef={onAmountChangeCallbackRef}/>);
    }
    setInputRefs(inputRefs);
    return outputList;

}

/**
* Checks value of all paid/spent amounts
* @param { int } total total (dollar) amount to be split
* @param { Array } inputRefs list of { symbol: inputRefSymbol, paid: inputRefPaid, spent: inputRefSpent} ref container objects
* @param { boolean } isPercent true if splitting by percent, false if splitting by amount
* @param { React.MutableRefObject } errorRef reference to error text field to print error text to
* @returns { boolean }                       validity of expense total; true when split is invalid
*/
function checkSplit(total, inputRefs, isPercent, errorRef) {

    // Check to make sure values add to total or 100%
    let totalPaid = 0;
    let totalSpent = 0;
    let numParticipants = 0;
    for (let i = 0; i < inputRefs.length; i++) {
        totalPaid += parseInt(inputRefs[i].paid.current.value * 100);
        totalSpent += parseInt(inputRefs[i].spent.current.value * 100);
        numParticipants += ((inputRefs[i].paid.current.value == '' || inputRefs[i].paid.current.value == 0) &&
                            (inputRefs[i].spent.current.value == '' || inputRefs[i].spent.current.value == 0)) ? 0 : 1;
    }

    if (parseInt(totalPaid) != (isPercent ? 10000 : total)) {
        errorRef.current.innerText = "All paid values must add up to " + (isPercent ? "100%" : ("$" + (parseFloat(total)/100.0).toFixed(2)));
        errorRef.current.style.visibility = 'visible';
        return true;
    }
    if (parseInt(totalSpent) != (isPercent ? 10000 : total)) {
        errorRef.current.innerText = "All spent values must add up to " + (isPercent ? "100%" : ("$" + (parseFloat(total)/100.0).toFixed(2)));
        errorRef.current.style.visibility = 'visible';
        return true;
    }
    if (numParticipants < 2) {
        errorRef.current.innerText = "Transaction must have at least 2 participants";
        errorRef.current.style.visibility = 'visible';
        return true;
    }
    errorRef.current.style.visibility = 'hidden';
    return false;
}

/**
* Checks value of expense name field and prevents user from submitting if too short
* @param { React.MutableRefObject } nameRef reference to expense name field
* @param { React.MutableRefObject } errorRef reference to error text field to print error text to
* @returns { boolean }                       validity of expense name
*/
function checkName(nameRef, errorRef) {

    if (nameRef.current.value.length >= 4) {
        // errorRef.current.innerText = "";
        errorRef.current.style.visibility = 'hidden';
        nameRef.current.removeAttribute("aria-invalid");
        nameRef.current.removeAttribute("aria-errormessage");
        return false;

    } else {
        errorRef.current.innerText = "Expense name must be at least 4 characters";
        errorRef.current.style.visibility = 'visible';
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
        // errorRef.current.innerText = "";
        errorRef.current.style.visibility = 'hidden';
        totalRef.current.removeAttribute("aria-invalid");
        totalRef.current.removeAttribute("aria-errormessage");
        return false;

    } else {
        errorRef.current.innerText = "Expense total must be greater than $0";
        errorRef.current.style.visibility = 'visible';
        totalRef.current.setAttribute("aria-invalid", true);
        totalRef.current.setAttribute("aria-errormessage", errorRef.current.id);
        return true;
    }
}

/**
 * Sends a post request to transactions.php in order to create a new transaction
 * @param {Object} formData object containing all the details for the new transaction
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
            errorRef.current.style.visibility = 'visible';
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
            let responseJSON = await response.json();
            //This errorRef doesn't get updated since the window closes anyways
            errorRef.current.innerText = responseJSON.message;
            errorRef.current.style.visibility = 'visible';
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