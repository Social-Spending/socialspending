import { StyleSheet, Text, View, Image } from 'react-native';
import { Link } from "expo-router";
import { useState, useEffect } from 'react';

import { HeaderText } from './TextComponents.js'

const LoadingGif = require('../assets/images/loading/loading-1-64.gif');


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
        

    }, []);
    
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
                <Text style={styles.error}> {text} </Text>
                <Image source={LoadingGif} style={styles.loading} />
            </View>
        );
    } else {
        //Transaction info has been returned, render it
        return (
            <View style={styles.info}>

                <View style={styles.labelContainer}>
                    <HeaderText size={2} style={styles.name}>{transactionInfo['transaction_name']}</HeaderText>
                </View>

                <View style={styles.labelContainer}>
                    <Text size={5} style={styles.id}>Transaction #{transactionInfo['transaction_id']}</Text>
                    <Text size={5} style={styles.date}>{transactionInfo['transaction_date']}</Text>
                </View>

                <View style={styles.labelContainer}>
                    <HeaderText size={4} style={styles.descriptionLabel}>Description:</HeaderText>
                </View>
                <View style={styles.labelContainer}>
                    <Text style={styles.description}>{transactionInfo['transaction_description']}</Text>
                </View>

                <View style={{ alignSelf: 'center', height: '1px', width: '80%', backgroundColor: '#777' }} />

                <View style={styles.labelContainer}>
                    <HeaderText size={4} style={styles.participants}>Participants:</HeaderText>
                </View>

                <View style={[styles.participantList, transactionInfo['transaction_participants'].length < 5 ? { scrollbarWidth: 'none' } : {}]}>
                    {getParticipants(transactionInfo['transaction_participants'])}
                </View>
            </View>

        );
    }
}


function getParticipants(participantList) {

    let outputList = [];

    for (let i = 0; i < participantList.length; i++) {
        if (i > 0) outputList.push(<View key={i * 2} style={{ alignSelf: 'center', height: '1px', width: '100%', backgroundColor: '#eee' }} />);

        outputList.push(<ListItem key={i * 2 + 1} name={participantList[i]['username']} id={participantList[i]['user_id']} owed={participantList[i]['amount']} />);
    }

    return outputList;

}

function ListItem(props) {

    let text = props.owed >= 0 ? "Paid" : "Owes";

    return (

        <Link href={'/profile/' + props.id} asChild>
            <View style={styles.participantListItem} >

                <Text size={3} style={styles.participantText}>{props.name}</Text>
                <View style={{ width: 'auto', paddingRight: '.5em', marginTop: '-.5em', marginBottom: '-.5em', minWidth: '5em', alignItems: 'center' }}>
                    <Text size={3} style={[styles.participantText, { fontSize: '.66em' }, props.owed >= 0 ? { color: '#0fa3b1' } : { color: '#f7a072' }]}>{text}</Text>
                    <Text size={3} style={[styles.participantText, props.owed >= 0 ? { color: '#0fa3b1' } : { color: '#f7a072' }]}>${Math.abs(props.owed)}</Text>
                </View>

            </View>
        </Link>

    );
}

async function getTransaction(transactionId, errorRef) {

    try {
        let url = "/transactions.php?transaction_id=" + transactionId;

        let response = await fetch(url, { credentials: 'same-origin' });

        return await response.json();
    }
    catch (error) {
        console.log("error in in GET request to login (/transactions.php)");
        console.log(error);
    }
}

const styles = StyleSheet.create({
    info: {
        width: '45vh',
        minHeight: '30em',
        height: 'auto',
        maxHeight: '80vh',
        backgroundColor: '#FFF',
        minWidth: '25em',
        boxShadow: '0px 0px 5px 5px #eee',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    participantList: {
        flex: 1,
        width: '80%',

        marginTop: '1em',
        marginBottom: '1em',

        justifyContent: 'flex-start',
        alignItems: 'left',
        alignSelf: 'center',

        backgroundColor: '#FFF',

        overflowY: 'scroll',
        scrollbarWidth: 'thin',


    },
    participantListItem: {
        marginTop: '1em',
        backgroundColor: '#FFF',
        paddingBottom: '1em',
        justifyContent: 'space-between',
        alignItems: 'left',
        flexDirection: 'row',

    },
    participantText: {
        fontSize: '1.17em',
        paddingTop: 0,
        paddingLeft: '2%',
        paddingRight: '2%',
        paddingBottom: 0,
        color: '#777'
    },
    error: {
        color: '#F00'
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%'
    },
    id: {
        paddingLeft: 0,
        paddingTop: '0em',
        paddingBottom: '2.5em',
        color: '#777',

    },
    description: {
        paddingLeft: 0,
        paddingTop: '0em',
        paddingBottom: '1em',
        color: '#777',

    },
    name: {
        paddingLeft: 0,
        paddingTop: '1em',
        paddingBottom: '0em',
        color: '#777',

    },
    date: {
        paddingLeft: 0,
        paddingTop: '0em',
        paddingBottom: '0em',
        color: '#777',

    },
    descriptionLabel: {
        paddingLeft: 0,
        paddingTop: '0em',
        paddingBottom: '.25em',
        color: '#777',

    },
    participants: {
        paddingLeft: 0,
        paddingTop: '1em',
        paddingBottom: '.5em',
        color: '#777',

    },
    text: {
        color: '#777',
        fontSize: '.83em',
        fontWeight: 600
    },
    loading: {
        height: '4em',
        width: '4em',
        minWidth: '2em',
        borderRadius: 1,
    },


});