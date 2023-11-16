import * as globals from '../utils/globals.js'

import { StyleSheet, Text, View, Image, Modal } from 'react-native';
import { router } from "expo-router";
import { useRef, useState, createContext, useContext, useEffect } from 'react';

import { getSettleUpCandidatesList } from "../utils/settleUp.js";

import Button from '../components/Button.js'
import { ModalContext } from './ModalContext.js';
import { GlobalContext } from '../components/GlobalContext.js';

const Logo = require('../assets/images/logo/logo-name-64.png');

const SettleUpContext = createContext(0);

const PAGES = {
    SELECT_CANDIDATE: 1,
    CONFIRM_SETTLE_UP: 2,
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
export default function SettleUp(props) {

    //Variables to pass down to all children as a context so that they know and can edit the data of others
    const [pageNum, setPageNum] = useState(PAGES.SELECT_CANDIDATE);
    const [formData, setFormData] = useState({});
    const [candidates, setCandidates] = useState([]);
    const [candidateJSON, setJSON] = useState([{'user_id':null, 'username':"", 'amount':0}]);
    const [candidateIndex, setCandidateIndex] = useState(0);
    const [targetID, setTargetID] = useState(props.targetID);

    const errorMessageRef = useRef(null);

    const setModal = useContext(ModalContext);

    function handleChildClick(e) {
        e.stopPropagation();
    }

    //Provide the context including pageNum, groupId, errorRef, and formData
    return (
        <SettleUpContext.Provider
            value={{
                pageNum: [pageNum, setPageNum],
                candidates: [candidates, setCandidates],
                candidateJSON: [candidateJSON, setJSON],
                candidateIndex: [candidateIndex, setCandidateIndex],
                targetID: [targetID, setTargetID],
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

                        <Text style={[globals.styles.label, globals.styles.h2, { padding: 0 }]}>SETTLE UP</Text>

                        <Text ref={errorMessageRef} id='settleUp_errorMessage' style={globals.styles.error}></Text>
                        
                        <SelectCandidate />
                        <ConfirmSettleUp />

                    </View>
                </View>
            </Modal>
        </SettleUpContext.Provider>

    );
}



/**
 * 
 * @returns a page in which the user selects the group for which they would like to split between
 */
function SelectCandidate() {

    const {
        pageNum:        [pageNum    , setPageNum],
        candidates:     [candidates , setCandidates],
        candidateJSON:  [candidateJSON, setCandidateJSON],
        candidateIndex:    [candidateIndex, setCandidateIndex],
        targetID:       [targetID   , setTargetID],
        formData:       [formData   , setFormData]
    } = useContext(SettleUpContext);

    const setModal = useContext(ModalContext);

    useEffect(() => {
        async function getSettleUpCandidates(targetID) {
            setCandidates(await buildCandidates(targetID, setCandidateJSON, setCandidateIndex, setPageNum));
        }
        if (pageNum == PAGES.SELECT_CANDIDATE) getSettleUpCandidates(targetID);
    }, [pageNum]);


    return (
        <View style={[styles.pageContainer, {
            display: pageNum != PAGES.SELECT_CANDIDATE ? 'none' : 'inherit'
        }]}>
            <Text style={[globals.styles.text, { paddingTop: '1em' }]}>Who would you like to pay?</Text>

            <View style={[globals.styles.list, { alignItems: 'center', justifyContent: 'center', width: '75%' }]} >
                {candidates}
            </View>

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row' }}>
                <Button  style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Cancel' onClick={() => setModal(null)} />
            </View>
        </View>
    );
}

/**
 * 
 * @returns a page in which the user can select the amount each person owes/paid
 */
function ConfirmSettleUp() {

    const setModal = useContext(ModalContext);
    const {reRender} = useContext(GlobalContext);

    let {
        pageNum: [pageNum, setPageNum],
        candidateJSON: [candidateJSON, setCandidateJSON],
        candidateIndex: [candidateIndex, setCandidateIndex],
        formData: [formData, setFormData],
        errorRef: errorRef,
    } = useContext(SettleUpContext);

    // Update form data to include participants list move on to name setting
    async function onSubmit() {
        setPageNum(pageNum + 1);
        
        formData.user_id = candidateJSON[candidateIndex].user_id;
        formData.amount = candidateJSON[candidateIndex].amount;

        setFormData(formData);

        if (await submitForm(formData, errorRef)) {
            setModal(null);
            reRender();
        }

    }
    

    return (
        <View style={[styles.pageContainer, {
            display: pageNum != PAGES.CONFIRM_SETTLE_UP ? 'none' : 'inherit'
        }]}>
            <Text style={[globals.styles.text, { paddingTop: '1em' }]}>Verify Transaction Details</Text>
                
            <View style={{width: '75%', justifyContent: 'space-between', flexDirection: 'row' }}>
                <Text style={[globals.styles.label, globals.styles.h4, { padding: 0 }]}>You Owe {candidateJSON[candidateIndex].username} </Text>
                <Text style={[globals.styles.label, globals.styles.h4, { padding: 0 }]}>${(candidateJSON[candidateIndex].amount / 100).toFixed(2)}</Text>
            </View>
           

      
            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row' }}>
                <Button style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Back' onClick={() => setPageNum(PAGES.SELECT_CANDIDATE)} />
                <Button style={[globals.styles.formButton, { margin: 0, marginVertical: '1em', width: '33%' }]} label='Confirm' onClick={onSubmit} />
            </View>
        </View>
    );
}


/**
 * Builds a list of candidates that a user may pay and converts them to button
 * @param {Function} setID function to set candidate variable
 * @param {Function} setPage function to set pageNum variable
 * @returns a list of Button elements
 */
async function buildCandidates(targetID, setJSON, setID, setPage) {
    let outputList = [];

    const candidates = await getSettleUpCandidatesList(targetID);

    if (!candidates){
        return outputList;
    }
    
    setJSON(candidates);

    for (let i = 0; i < candidates.length; i++) {
        outputList.push(<Button style={[globals.styles.formButton, { width: '100%', margin: 0, marginVertical: '.5em' }]} label={candidates[i].username} onClick={
            () => { 
                setID(i);
                setPage(PAGES.CONFIRM_SETTLE_UP);
                }} />);
    }

    return outputList;
}



/**
 * Sends a post request to transactions.php in order to create a new transaction
 * @param {Object} formData object contianing all the details for the new transaction
 * @returns {Boolean} whether or not a new transaction was created
 */
async function submitForm(formData, errorRef) {

    try {
        let response = await fetch("/settle_up.php", {
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
        console.log("error in POST request to settle_up (/settle_up.php)");
        console.log(error);
    }
   return false;
}

const styles = StyleSheet.create({
    create: {
        minHeight: '25em',
        height: 'auto',
        maxHeight: '80vh',
        backgroundColor: globals.COLOR_WHITE,
        width: '25em',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1
    },
    pageContainer: {
        flex: 1,
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
    }
});