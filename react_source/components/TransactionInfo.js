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

import { StyleSheet, Text, View, Image } from 'react-native';
import { Link } from "expo-router";
import { useState, useEffect } from 'react';

const LoadingGif = require('../assets/images/loading/loading-blue-block-64.gif');


export default function TransactionInfo({ id, json }) {

    let [transactionInfo, setTransactionInfo] = useState(null);

    useEffect(() => {

        if (!json) {
            // React advises to declare the async function directly inside useEffect
            // On load asynchronously request groups and construct the list
            async function getInfo() {

                setTransactionInfo(await getTransaction(id));
            }
            getInfo();
        } else {
            setTransactionInfo(json);
        }
        

    });
    
    if (transactionInfo === null) {
        //Transaction info hasnt loaded - show loading
        return (
            <View style={styles.info}>
                <Image source={LoadingGif} style={styles.loading} />
            </View>

        );

    } else if (transactionInfo === undefined || transactionInfo['message'] != undefined) {
        //Transaction has returned an error or contact to server is unable to be made
        let text = transactionInfo === undefined ? "Error While Contacting Server" : transactionInfo['message'];

        return (
            <View style={styles.info}>
                <Text style={globals.styles.error}> {text} </Text>
            </View>
        );
    } else {
        //Transaction info has been returned, render it
        return (
            <View style={styles.info}>

                <View style={styles.detailsContainer}>
                    <Text style={[globals.styles.h2, styles.name]}>{transactionInfo['transaction_name']}</Text>
                </View>

                <View style={[styles.detailsContainer, { paddingBottom: '2.5em' }]}>
                    <Text style={styles.details}>Transaction #{transactionInfo['transaction_id']}</Text>
                    <Text style={styles.details}>{transactionInfo['transaction_date']}</Text>
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={[globals.styles.h4, styles.details]}>Description:</Text>
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={styles.description}>{transactionInfo['transaction_description']}</Text>
                </View>

                <View style={{ alignSelf: 'center', height: '1px', width: '80%', backgroundColor: globals.COLOR_GRAY }} />

                <View style={styles.detailsContainer}>
                    <Text style={[globals.styles.h4, styles.participants]}>Participants:</Text>
                </View>

                <View style={[globals.styles.list, { width: '80%' }, transactionInfo['transaction_participants'].length < 5 ? { scrollbarWidth: 'none' } : {}]}>
                    {getParticipants(transactionInfo['transaction_participants'])}
                </View>
            </View>

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

        outputList.push(<ListItem key={i} border={i > 0} name={participantList[i]['username']} id={participantList[i]['user_id']} owed={participantList[i]['amount']} />);
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
function ListItem({ id, name, owed, border }) {

    let text = owed >= 0 ? "Paid" : "Owes";
    let color = owed >= 0 ? { color: globals.COLOR_BLUE } : { color: globals.COLOR_ORANGE };

    return (

        <Link href={'/profile/' + id} asChild>
            <View style={border ? globals.styles.listItemSeperator : globals.styles.listItem} >

                <Text style={globals.styles.listText}>{name}</Text>
                <View style={{ width: 'auto', paddingRight: '.5em', marginTop: '-.5em', marginBottom: '-.5em', minWidth: '5em', alignItems: 'center' }}>
                    <Text style={[globals.styles.listText, { fontSize: '.66em' }, color]}>{text}</Text>
                    <Text style={[globals.styles.listText, color]}>${Math.abs(owed)}</Text>
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

const styles = StyleSheet.create({
    info: {
        width: '45vh',
        minHeight: '30em',
        height: 'auto',
        maxHeight: '80vh',
        backgroundColor: globals.COLOR_WHITE,
        minWidth: '25em',
        boxShadow: '0px 0px 5px 5px #eee',
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


});