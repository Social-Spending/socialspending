/**
 *  TransactionInfo:
 *  
 *      Displays the name, id, date, description, and a participants list for a given transaction
 *      Participants list shows names, and how much each person paid/owes - links back to their profile
 *      
 *      props:
 *          id: ID of transaction to pull from database and display
 *          json: json data that has already been returned from the database in another call - when set overwrites id and prevents from making a database request
 * 
 *      TODO:
 *          Implement approved/pending/denied 
 */

import * as globals from "../utils/globals.js";

import { Text, View, Modal, Image } from '../utils/globals.js';
import { useState, useEffect, useContext, createContext } from 'react';
import { ModalContext } from "./ModalContext.js";
import Button from '../components/Button.js'
import Loading from "../components/Loading.js";
import { Link } from "react-router-dom/dist/index.js";
import { GlobalContext } from "../components/GlobalContext.js";
import { approveRejectTransaction } from "../utils/transactions.js";
import VerifyAction from "./VerifyAction.js";

const TransactionInfoContext = createContext(0);

const PAGES = {
    TRANSACTION_INFO: 1,
    RECEIPT: 2
};


export default function ViewTransaction(props) {
    const [transactionInfo, setTransactionInfo] = useState(null);
    const [pageNum, setPageNum] = useState(PAGES.TRANSACTION_INFO);

    const { pushModal, popModal } = useContext(ModalContext);

    function handleChildClick(e) {
        e.stopPropagation();
    }

    useEffect(() => {

        if (!props.json) {
            // React advises to declare the async function directly inside useEffect
            // On load asynchronously request groups and construct the list
            async function getInfo() {

                setTransactionInfo(await getTransaction(props.id));
            }
            getInfo();
        } else {
            setTransactionInfo(props.json);
        }
    }, []);

    return (
        <TransactionInfoContext.Provider
            value={{
                transactionInfo: [transactionInfo, setTransactionInfo],
                pageNum: [pageNum, setPageNum]
            }}>
            <Modal
                transparent={true}
                visible={true}
                onRequestClose={() => popModal()}>

                <View style={{ ...globals.styles.modalBackground, ...props.style}} onClick={(props.exit != undefined ? props.exit : () => popModal())}>
                    <View style={styles.info} onClick={handleChildClick}>
                        <TransactionInfo/>
                        <ViewReceipt/>
                    </View>
                </View>
            </Modal>
        </TransactionInfoContext.Provider>
    );
}

function TransactionInfo() {
    const {
        transactionInfo: [transactionInfo, setTransactionInfo],
        pageNum: [pageNum, setPageNum]
    } = useContext(TransactionInfoContext);

    if (transactionInfo === null) {
        //Transaction info hasnt loaded - show loading
        return (
            <View style={{
                    ...styles.detailsContainer, ...{
                    display: pageNum != PAGES.TRANSACTION_INFO ? 'none' : 'inherit'
            }}} >
                    <Loading />
            </View>
        );

    } else if (transactionInfo === undefined || transactionInfo['message'] != undefined) {
        //Transaction has returned an error or contact to server is unable to be made
        let text = transactionInfo === undefined ? "Error While Contacting Server" : transactionInfo['message'];

        return (
            <View style={{
                    ...styles.detailsContainer, ...{
                    display: pageNum != PAGES.TRANSACTION_INFO ? 'none' : 'inherit'
            }}} >
                <Text style={globals.styles.error}> {text} </Text>
            </View>
        );
    } else {
        //Transaction info has been returned, render it
        let pendingItalic = transactionInfo['is_approved'] == 0 ? { fontStyle: 'italic' } : {};

        return (
            <View style={{
                    ...styles.info, ...{
                    display: pageNum != PAGES.TRANSACTION_INFO ? 'none' : 'inherit'
            }}} >
                <View style={styles.detailsContainer}>
                    <Text style={{...globals.styles.h2, ...styles.name, ...pendingItalic}}>{transactionInfo['transaction_name']}</Text>
                </View>

                <View style={{ ...styles.detailsContainer, ...{ paddingBottom: '2.5em' }}}>
                    <Text style={styles.details}>Transaction #{transactionInfo['transaction_id']}</Text>
                    <Text style={styles.details}>{transactionInfo['transaction_date']}</Text>
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={{ ...globals.styles.h4, ...styles.details}}>Description:</Text>
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={styles.description}>{transactionInfo['transaction_description']}</Text>
                </View>

                <View style={{ alignSelf: 'center', height: '1px', width: '80%', backgroundColor: globals.COLOR_GRAY }} />

                <View style={styles.detailsContainer}>
                    <Text style={{ ...globals.styles.h4, ...styles.participants}}>Participants:</Text>
                </View>

                <View style={{...globals.styles.list, ...{ width: '80%' }, ...(transactionInfo['transaction_participants'].length < 5 ? { scrollbarWidth: 'none' } : {})}}>
                    {getParticipants(transactionInfo['transaction_participants'])}
                </View>
                <View style={{ justifyContent: 'center', width: '75%', flexDirection: 'row' }}>
                    {transactionInfo['receipt_path'] != null ?
                        <Button style={{...globals.styles.formButton, ...{ margin: 0, marginVertical: '1em', width: '50%' }}} id='transactionInfo_viewReceipt' onClick={() => setPageNum(PAGES.RECEIPT)}>
                            <label htmlFor="transactionInfo_viewReceipt" style={globals.styles.buttonLabel}>
                                View Receipt
                            </label>
                        </Button> :
                        <br/>}
                </View>
                <ApprovalButtons id={transactionInfo['transaction_id']} participants={transactionInfo['transaction_participants']} />
            </View>
        );
    }
}

function ViewReceipt() {
    const {
        transactionInfo: [transactionInfo, setTransactionInfo],
        pageNum: [pageNum, setPageNum]
    } = useContext(TransactionInfoContext);

    if (transactionInfo === null) {
        //Transaction info hasnt loaded - show loading
        return (
            <View style={{display: pageNum != PAGES.RECEIPT ? 'none' : 'inherit'}}>
                    <Loading />
            </View>

        );

        } else {
            return (
                <View style={{display: pageNum != PAGES.RECEIPT ? 'none' : 'inherit'}}>
                    <View style={{padding: '.75em'}}>
                        <Image source={transactionInfo["receipt_path"] != null ? decodeURI(transactionInfo["receipt_path"]) : ""} style={{width: '225px', height: '400px', justifyContent: 'center', alignItems: 'center'}}/>
                    </View>

                    <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                        <Button style={{...globals.styles.formButton, ...{marginTop: '0em', marginBottom: '.75em', width: '100%'}}} id='transactionViewReceipt_close' onClick={() => setPageNum(PAGES.TRANSACTION_INFO)}>
                            <label htmlFor="transactionViewReceipt_close" style={globals.styles.buttonLabel}>
                                Go Back
                            </label>
                        </Button>
                    </View>
                </View>
        );
    }
}

/**
 *  Assembles DOM elements for a single list entry
 *      @param {number} id           user_id of participant
 *      @param {string} name         username of participant
 *      @param {number} owed         how much the participant paid/owes
 *      @return {React.JSX.Element}  DOM element  
 */
function ListItem({ id, name, owed, border, hasApproved }) {

    let text = owed >= 0 ? "Borrowed" : "Paid";
    let color = owed >= 0 ? { color: globals.COLOR_ORANGE } : { color: globals.COLOR_BLUE };
    color = owed == 0 ? { color: globals.COLOR_GRAY } : color;

    let pendingItalic = hasApproved == 0 ? { fontStyle: 'italic' } : {};

    return (
        <>
            <Link to={'/profile/' + id} style={{ ...globals.styles.listItemRow, ...globals.styles.listText, ...pendingItalic }}>
               {name}
            </Link>
            <Link to={'/profile/' + id} style={{
                ...globals.styles.listItemColumn,
                ...{ alignItems: 'flex-end' }
            }}>
                
                <Text style={{ ...globals.styles.listText, ...{ fontSize: '.66em' }, ...color }}>{text}</Text>
                <Text style={{ ...globals.styles.listText, ...color }}>${Math.abs(owed / 100).toFixed(2)}</Text>                
            </Link>
        </>
        

    );
}

function ApprovalButtons({ id, participants }) {
    const { currUserID, reRender} = useContext(GlobalContext);
    const { pushModal, popModal } = useContext(ModalContext);

    let approved = true;

    for (let i = 0; i < participants.length; i++) {
        if (currUserID == participants[i]['user_id']) {
            approved = participants[i]['has_approved'];

            break;
        }
    }

    function approve(e, approved) {
        pushModal(<VerifyAction label={"Are you sure you want to " + (approved ? "approve " : "reject ") + "this transaction?"} accept={async () => {
            await approveRejectTransaction(id, approved);
            popModal(2);
            reRender();
        }} />);
    }

    if (!approved) {
        return (
            <View style={{width: '80%', paddingBottom: '.75em', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Button id="transactionInfo_approve" style={{ ...globals.styles.formButton, ...{ width: '45%', backgroundColor: globals.COLOR_BLUE } }} onClick={(e) => approve(e, true)}>
                    <label htmlFor="transactionInfo_approve" style={globals.styles.buttonLabel }>
                        Approve
                    </label>
                </Button>
                <Button id="transactionInfo_reject" style={{ ...globals.styles.formButton, ...{ width: '45%' } }} onClick={(e) => approve(e, false)} >
                    <label htmlFor="transactionInfo_reject" style={globals.styles.buttonLabel}>
                        Reject
                    </label>
                </Button>
            </View>
        );
    } else {
        return(<></>);
    }
}

/**
 *  Creates an array contianing the DOM elements for each participant
 *  @param {JSON} participantList JSON Array containing a list of JSON Objects for participants
 *  @return {React.JSX.Element[]} Array of DOM elements to be rendered
 */
function getParticipants(participantList) {

    let outputList = [];

    for (let i = 0; i < participantList.length; i++) {

        outputList.push(<ListItem
            key={i}
            border={i > 0}
            name={participantList[i]['username']}
            id={participantList[i]['user_id']}
            owed={participantList[i]['amount']}
            hasApproved={participantList[i]['has_approved']}
        />);
        
    }

    return outputList;

}



/**
 * Gets transaction data from the server using transaction.php endpoint
 *      @param {number} transactionId   id of transaction to fetch
 *      @return {JSON}                  JSON object containing data for transaction or an error message
 */
async function getTransaction(transactionId) {

    try {
        let url = "/transactions.php?transaction_id=" + transactionId;

        let response = await fetch(url, { credentials: 'same-origin' });

        return await response.json();
    }
    catch (error) {
        console.log("error in in GET request to transactions (/transactions.php)");
        console.log(error);
    }
}

const styles = {
    info: {
        width: '25em',
        minHeight: '30em',
        height: 'auto',
        maxHeight: '80vh',
        backgroundColor: globals.COLOR_WHITE,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%'
    },
    details: {
        padding: 0,
        color: globals.COLOR_GRAY,

    },
    description: {
        paddingLeft: 0,
        paddingTop: '0.25em',
        paddingBottom: '1em',
        color: globals.COLOR_GRAY,

    },
    name: {
        paddingLeft: 0,
        paddingTop: '1em',
        paddingBottom: '0em',
        color: globals.COLOR_GRAY,

    },
    participants: {
        paddingLeft: 0,
        paddingTop: '1em',
        paddingBottom: '.5em',
        color: globals.COLOR_GRAY,

    }


};