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

import { Text, View, Modal } from '../utils/globals.js';
import { useState, useEffect, useContext } from 'react';
import { ModalContext } from "./ModalContext.js";
import Loading from "../components/Loading.js";
import { Link } from "react-router-dom/dist/index.js";


export default function TransactionInfo(props) {

    let [transactionInfo, setTransactionInfo] = useState(null);
    const setModal = useContext(ModalContext);

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

    function handleChildClick(e) {
        e.stopPropagation();
    }
    
    if (transactionInfo === null) {
        //Transaction info hasnt loaded - show loading
        return (
            <Modal
            transparent={true}
            visible={true}
            onRequestClose={() => setModal(null)}>

                <View style={{ ...globals.styles.modalBackground, ...props.style}} onClick={(props.exit != undefined ? props.exit : () => setModal(null))}>
                    <View style={styles.info} onClick={handleChildClick}>
                        <Loading />
                    </View>
                </View>
            </Modal>

        );

    } else if (transactionInfo === undefined || transactionInfo['message'] != undefined) {
        //Transaction has returned an error or contact to server is unable to be made
        let text = transactionInfo === undefined ? "Error While Contacting Server" : transactionInfo['message'];

        return (
           <Modal
                transparent={true}
                visible={true}
                onRequestClose={() => setModal(null)}>

                <View style={{ ...globals.styles.modalBackground, ...props.style}} onClick={(props.exit != undefined ? props.exit : () => setModal(null))}>
                    <View style={styles.info} onClick={handleChildClick}>
                    <Text style={globals.styles.error}> {text} </Text>
                    </View>
                </View>
            </Modal>
        );
    } else {
        //Transaction info has been returned, render it
        let pendingItalic = transactionInfo['is_approved'] == 0 ? { fontStyle: 'italic' } : {};

        return (
           <Modal
                transparent={true}
                visible={true}
                onRequestClose={() => setModal(null)}>

                <View style={{ ...globals.styles.modalBackground, ...props.style}} onClick={(props.exit != undefined ? props.exit : () => setModal(null))}>
                    <View style={styles.info} onClick={handleChildClick}>

                        <View style={styles.detailsContainer}>
                            <Text style={{ ...globals.styles.h2, ...styles.name, ...pendingItalic}}>{transactionInfo['transaction_name']}</Text>
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

                        <View style={{ ...globals.styles.list, ...{ width: '80%' }}}>
                            {getParticipants(transactionInfo['transaction_participants'])}
                        </View>
                    </View>
                </View>
            </Modal>

        );
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
        outputList.push(<ListItem
            key={i}
            border={i > 0}
            name={participantList[i]['username']}
            id={participantList[i]['user_id']}
            owed={participantList[i]['amount']}
            hasApproved={participantList[i]['has_approved']}
        />);
        outputList.push(<ListItem
            key={i}
            border={i > 0}
            name={participantList[i]['username']}
            id={participantList[i]['user_id']}
            owed={participantList[i]['amount']}
            hasApproved={participantList[i]['has_approved']}
        />);
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

        <Link to={'/profile/' + id}>
            <View style={border ? globals.styles.listItemSeperator : globals.styles.listItem} >

                <Text style={{ ...globals.styles.listText, ...pendingItalic}}>{name}</Text>
                <View style={{ width: 'auto', paddingRight: '.5em', marginTop: '-.5em', marginBottom: '-.5em', minWidth: '5em', alignItems: 'center' }}>
                    <Text style={{ ...globals.styles.listText, ...{ fontSize: '.66em' }, ...color}}>{text}</Text>
                    <Text style={{ ...globals.styles.listText, ...color}}>${Math.abs(owed / 100).toFixed(2)}</Text>
                </View>

            </View>
        </Link>

    );
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