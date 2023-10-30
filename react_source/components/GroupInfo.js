import * as globals from "../utils/globals.js";

import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect } from 'react';

import { Link } from "expo-router";


import TransactionInfo from "./TransactionInfo.js";

const LoadingGif = require('../assets/images/loading/loading-blue-block-64.gif');

export default function GroupInfo(props) {

    const [transactionID, setTransactionID] = useState(0);

    let [groupMembers, setGroupMembers] = useState(null);
    let [transactions, setTransactions] = useState(null);
    let [groupName, setGroupName] = useState(null);

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {
            let json = null;

            if (props.json === undefined || props.json === null) {

                json = await getGroupInfo(props.id);
            } else {

                json = props.json;
            }

            if (json !== null) {
                setGroupName(json.group_name);                

                setGroupMembers(await getGroupMembers(json));
                setTransactions(await getTransactions(props.id, setTransactionID));
            }            
        }
        getItems();
            

    }, [props.id]);
    if (props.id == null || groupName == null) {
        return (<></>);
    }

    return (
        <View style={{ flexDirection: 'row', flex: 1, height: '100%'}}>
            
            <View style={{ flex: 1, margin: '5em', padding: '2.5em', marginTop: '1em' }} >
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[globals.styles.h1, styles.groupName, {fontWeight: '100'}]}>Groups / </Text>
                    <Text style={[globals.styles.h1, styles.groupName]}>{groupName}</Text>

                </View>
                <View style={styles.listContainer}>
                    <Text style={[globals.styles.h3, { color: globals.COLOR_GRAY, fontWeight: 600, paddingLeft: '1em', paddingBottom: '1.5em' }]}>Members</Text>
                    <View style={styles.listHeader} >

                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>USERNAME</Text>
                        <Text style={{ color: globals.COLOR_GRAY, paddingRight: '2em' }}>STANDING</Text>

                    </View>
                    <View style={[globals.styles.list, { marginTop: '.25em', width: '100%', marginBottom: '1em' }]}>
                        {groupMembers}
                    </View>

                </View>

                <View style={styles.listContainer}>
                    <Text style={[globals.styles.h3, { color: globals.COLOR_GRAY, fontWeight: 600, paddingLeft: '1em', paddingBottom: '1.5em' }]}>Transactions</Text>
                    <View style={styles.listHeader} >

                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>TRANSACTION</Text>
                        <Text style={{ color: globals.COLOR_GRAY, paddingRight: '2em' }}>YOUR CONTRIBUTION</Text>

                    </View>
                    <View style={[globals.styles.list, { marginTop: '.25em', width: '100%', marginBottom: '1em' }]}>
                        {transactions}
                    </View>

                </View>
            </View> 
        </View>
    );
}
async function getGroupInfo(id) {

   
    // pul username and password in form data for a POST request
    let payload = new URLSearchParams();
    payload.append('brief', false);
    payload.append('groupID', id);

    // do the POST request
    try {
        let response = await fetch("/groups.php?" + payload, { method: 'GET', credentials: 'same-origin' });

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
        console.log("error in in GET request to groups (/groups.php)");
        console.log(error);
    }

    return null;

}

function getGroupMembers(json) {

   
    let outputList = [];

    for (let i = 0; i < json['members'].length; i++) {

        outputList.push(<MemberListItem key={i} border={i > 0} name={json['members'][i].username} id={json['members'][i].user_id} owed={json['members'][i].debt} />);
    }

    return outputList;

}

function getTransactions(groupID, setID) {

    let outputList = [];

    for (let i = 0; i < 10; i++) {

        outputList.push(<TransactionListItem key={i} border={i > 0} name={'test'} id={i} owed={1} onClick={() => setID(i) } />);
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
function MemberListItem({ id, name, owed, border }) {

    let text = owed >= 0 ? "Is Owed" : "Owes";
    let color = owed >= 0 ? { color: globals.COLOR_BLUE } : { color: globals.COLOR_ORANGE };

    return (

        <Link href={'/profile/' + id} asChild>
            <View style={border ? styles.listItemSeperator : styles.listItem} >

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
 *  Assembles DOM elements for a single list entry
 *      @param {number} id           user_id of participant
 *      @param {string} name         username of participant
 *      @param {number} owed         how much the participant paid/owes
 *      @return {React.JSX.Element}  DOM element  
 */
function TransactionListItem({ id, name, owed, border, onClick }) {

    let text = owed >= 0 ? "You Paid" : "You're Owed";
    let color = owed >= 0 ? { color: globals.COLOR_BLUE } : { color: globals.COLOR_ORANGE };

    return (

        
        <View style={border ? styles.listItemSeperator : styles.listItem} onClick={onClick} >

            <Text style={globals.styles.listText}>{name}</Text>
            <View style={{ width: 'auto', paddingRight: '.5em', marginTop: '-.5em', marginBottom: '-.5em', minWidth: '5em', alignItems: 'center' }}>
                <Text style={[globals.styles.listText, { fontSize: '.66em' }, color]}>{text}</Text>
                <Text style={[globals.styles.listText, color]}>${Math.abs(owed)}</Text>
            </View>

        </View>
        

    );
}



const styles = StyleSheet.create({
    groupName: {
        color: globals.COLOR_GRAY,
        borderRadius: 2,
        padding: 0,
        paddingBottom: '.25em',
        fontWeight: 500
    },
    listItem: {
        justifyContent: 'space-between',
        alignItems: 'left',
        flexDirection: 'row',
        marginTop: '.5em',
        paddingBottom: '.5em',
        paddingLeft: '1em'

    },
    listItemSeperator: {
        justifyContent: 'space-between',
        alignItems: 'left',
        flexDirection: 'row',
        borderStyle: 'none',
        borderTopStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#eee',
        paddingTop: '.5em',
        paddingBottom: '.5em',
        paddingLeft: '1em'

    },
    listContainer: {
        marginTop: '2em',
        boxShadow: '0px 0px 5px 5px #eee',
        borderRadius: '1em',
        backgroundColor: globals.COLOR_WHITE
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderStyle: 'none',
        borderBottomStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#eee',
        paddingBottom: '.5em'
    }

});