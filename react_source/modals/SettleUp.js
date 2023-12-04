import * as globals from '../utils/globals.js'

import { Text, View, Image, Modal } from '../utils/globals.js';
import { useRef, useState, createContext, useContext, useEffect } from 'react';

import { getDisplayStringForCandidate, getSettleUpCandidatesList } from "../utils/settleUp.js";

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
    const [candidates, setCandidates] = useState([]);
    const [candidateJSON, setJSON] = useState([{'user_id':null, 'username':"", 'amount':0}]);
    const [candidateIndex, setCandidateIndex] = useState(0);
    const [targetID, setTargetID] = useState(props.targetID);

    const errorMessageRef = useRef(null);

    function setErrorMsg(msg) {
        if (msg)
        {
            errorMessageRef.current.innerText = msg;
            errorMessageRef.current.classList.remove('hidden');
        }
        else
        {
            errorMessageRef.current.innerText = "";
        }
    }

    const { pushModal, popModal } = useContext(ModalContext);

    function handleChildClick(e) {
        e.stopPropagation();
    }

    //Provide the context including pageNum, groupId, and setErrorMsg
    return (
        <SettleUpContext.Provider
            value={{
                pageNum: [pageNum, setPageNum],
                candidates: [candidates, setCandidates],
                candidateJSON: [candidateJSON, setJSON],
                candidateIndex: [candidateIndex, setCandidateIndex],
                targetID: [targetID, setTargetID],
                errorRef: errorMessageRef,
                setErrorMsg: setErrorMsg
            }}>
            <Modal
                transparent={true}
                visible={true}
                onRequestClose={() => popModal()}>

                <View style={{...globals.styles.modalBackground, ...props.style}} onClick={(props.exit != undefined ? props.exit : () => popModal())}>
                    <View style={styles.create} onClick={handleChildClick}>

                        <Image source={Logo} style={styles.logo} />

                        <Text style={{...globals.styles.label, ...globals.styles.h2, ...{ padding: 0 }}}>SETTLE UP</Text>

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
        setErrorMsg:    setErrorMsg
    } = useContext(SettleUpContext);

    const { pushModal, popModal } = useContext(ModalContext);

    useEffect(() => {
        async function getSettleUpCandidates(targetID) {
            setCandidates(await buildCandidates(targetID, setCandidateJSON, setCandidateIndex, setPageNum, setErrorMsg));
        }
        if (pageNum == PAGES.SELECT_CANDIDATE) getSettleUpCandidates(targetID);
    }, [pageNum]);


    return (
        <View style={{...styles.pageContainer, ...{
            display: pageNum != PAGES.SELECT_CANDIDATE ? 'none' : 'inherit'
        }}}>
            <Text style={{...globals.styles.text, ...{ paddingTop: '1em' }}}>Who would you like to pay?</Text>

            <View style={{...globals.styles.list, ...{ gridTemplateColumns: '100%', width: '75%' }}} >
                {candidates}
            </View>

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row' }}>
                <Button  style={{...globals.styles.formButton, ...{ margin: 0, marginTop: '1em', marginBottom: '1em', width: '33%' }}} id='settleUpModal_cancel' onClick={() => popModal()}>
                    <label htmlFor="settleUpModal_cancel" style={globals.styles.buttonLabel }>
                        Cancel
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
function ConfirmSettleUp() {

    const { popModal } = useContext(ModalContext);
    const {reRender} = useContext(GlobalContext);

    let {
        pageNum: [pageNum, setPageNum],
        candidateJSON: [candidateJSON, setCandidateJSON],
        candidateIndex: [candidateIndex, setCandidateIndex],
        setErrorMsg: setErrorMsg
    } = useContext(SettleUpContext);

    // Update form data to include participants list move on to name setting
    async function onSubmit() {
        // setPageNum(pageNum + 1); // not sure why this was here? this is already the last page

        if (await submitForm(candidateJSON[candidateIndex], setErrorMsg)) {
            popModal();
            reRender();
        }

    }
    

    return (
        <View style={{...styles.pageContainer, ...{
            display: pageNum != PAGES.CONFIRM_SETTLE_UP ? 'none' : 'inherit',
            justifyContent: 'space-between'
        }}}>
            <View style={{justifyContent: 'start'}} >
                <Text style={{...globals.styles.text, ...{ paddingTop: '1em' }}}>Verify Transaction Details</Text>

                <Text style={{...globals.styles.label, ...globals.styles.h4, ...{ padding: 0, marginLeft: '1em'}}}>You Pay ${(candidateJSON[candidateIndex].amount / 100).toFixed(2)} to:</Text>

                <View style={{...globals.styles.list, ...{ gridTemplateColumns: '100%', width: '75%' }}} >
                    {buildSettleUpChainMembers(candidateJSON[candidateIndex].length, candidateJSON[candidateIndex].chain)}
                </View>

            </View>

            <View style={{ justifyContent: 'space-between', width: '75%', flexDirection: 'row' }}>
                <Button style={{...globals.styles.formButton, ...{ margin: 0, marginVertical: '1em', width: '33%' }}} id='confirmSettleUpModal_back' onClick={() => { setPageNum(PAGES.SELECT_CANDIDATE); setErrorMsg(''); }}>
                    <label htmlFor="confirmSettleUpModal_back" style={globals.styles.buttonLabel }>
                        Back
                    </label>
                </Button>
                <Button style={{...globals.styles.formButton, ...{ margin: 0, marginTop: '1em', marginBottom: '1em', width: '33%' }}} id='confirmSettleUpModal_confirm' onClick={onSubmit}>
                    <label htmlFor="confirmSettleUpModal_confirm" style={globals.styles.buttonLabel }>
                        Confirm
                    </label>
                </Button>
            </View>
        </View>
    );
}

/**
 * Builds DOM content to display the users in a settle-up chain
 * @param {Number} length number of users in the chain
 * @param {Array} chain array of {'user_id':<Number>, 'username':<String>} objects describing the list of creditors in the chain..
 *                      the first user in the chain should be one of the current user's immediate creditors
 * @returns a list of elements displaying members of the settle-up chain
 */
function buildSettleUpChainMembers(length, chain)
{
    let outputList = [];

    for (let i = length; i > 0; i--)
    {
        outputList.push(
            <View key={i} style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{...globals.styles.label, ...globals.styles.h4}}>{chain[i-1].username}</Text>
                {i > 1 ? <Text style={globals.styles.text}>on Behalf of</Text> : <></>}
            </View>
        );
        // <Button
        //     key={i}
        //     style={{...globals.styles.formButton, ...{ width: '100%' }}}
        //     id={'settleUpModal_option'+i}
        //     onClick={
        //         () => {
        //             setID(i);
        //             setPage(PAGES.CONFIRM_SETTLE_UP);
        //             setErrorMsg('');
        //         }}
        // >
        //     <label htmlFor={'settleUpModal_option'+i} style={globals.styles.buttonLabel }>
        //         {getDisplayStringForCandidate(candidates[i])}
        //     </label>
        // </Button>
    }

    return outputList;
}

/**
 * Builds a list of candidates that a user may pay and converts them to button
 * @param {Function} setID function to set candidate variable
 * @param {Function} setPage function to set pageNum variable
 * @returns a list of Button elements
 */
async function buildCandidates(targetID, setJSON, setID, setPage, setErrorMsg) {
    let outputList = [];

    const candidates = await getSettleUpCandidatesList(targetID, setErrorMsg);

    // getSettleUpCandidatesList will return null if something went wrong
    if (!candidates){
        return outputList;
    }
    
    setJSON(candidates);

    for (let i = 0; i < candidates.length; i++) {
        outputList.push(<Button
            key={i}
            style={{...globals.styles.formButton, ...{ width: '100%' }}}
            id={'settleUpModal_option'+i}
            onClick={
                () => {
                    setID(i);
                    setPage(PAGES.CONFIRM_SETTLE_UP);
                    setErrorMsg('');
                }}
        >
            <label htmlFor={'settleUpModal_option'+i} style={globals.styles.buttonLabel }>
                {getDisplayStringForCandidate(candidates[i])}
            </label>
        </Button>);
    }

    return outputList;
}



/**
 * Sends a post request to transactions.php in order to create a new transaction
 * @param {Object} candidate object describing the selected settle-up option
 * @returns {Boolean} whether or not a new transaction was created
 */
async function submitForm(candidate, setErrorMsg) {

    try {
        let response = await fetch("/settle_up.php", {
            method: 'POST',
            body: JSON.stringify(candidate),
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (await response.ok) {
            return true;
        }
        else {
            let responseJSON = await response.json();
            setErrorMsg(responseJSON.message);
            return false;
        }
    }
    catch (error) {
        console.log("error in POST request to /settle_up.php");
        console.log(error);
    }
   return false;
}

const styles = {
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
        flexDirection: 'column',
        justifyContent: 'start',
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
};