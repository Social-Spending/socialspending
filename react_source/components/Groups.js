import * as globals from "../utils/globals.js";

import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect } from 'react';

import { Link } from "expo-router";

import Sidebar from './CollapsabileSidebar.js'
import TransactionInfo from "./TransactionInfo.js";

const LoadingGif = require('../assets/images/loading/loading-blue-block-64.gif');

export default function Groups(props) {
    return (
        <View style={{ flexDirection: 'row', width: '100%', height: '100%'}}>
            <Sidebar title={'Groups'}>
               <GroupList />
            </Sidebar>
            <View style={{ flex: 2, paddingLeft: '3em', paddingRight: '3em' }} >
                <Text style={[globals.styles.h1, styles.groupName]}>GROUP NAME</Text>
                <Text style={[globals.styles.h3, {color: globals.COLOR_GRAY}]}>Members:</Text>
                <View style={[globals.styles.list, { width: '100%' }]}>
                    {getParticipants()}
                </View>
                <Text style={[globals.styles.h3, { color: globals.COLOR_GRAY }]}>Transactions:</Text>
                <View style={[globals.styles.list, { width: '100%', borderWidth: 1, borderColor: globals.COLOR_GRAY }]}>
                    {getTransactions()}
                </View>
                
            </View>
            <View style={{flex:1, maxHeight: '100vh', justifyContent: 'center', alignItems: 'center', position: 'sticky', top: 0}}>
                <TransactionInfo />
            </View>
            
        </View>
        
    );
}

function getParticipants() {

    let outputList = [];

    for (let i = 0; i < 10; i++) {

        outputList.push(<MemberListItem key={i} border={i > 0} name={'test'} id={1} owed={1} />);
    }

    return outputList;

}

function getTransactions() {

    let outputList = [];

    for (let i = 0; i < 10; i++) {

        outputList.push(<TransactionListItem key={i} border={i > 0} name={'test'} id={1} owed={1} />);
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
function TransactionListItem({ id, name, owed, border }) {

    let text = owed >= 0 ? "You Paid" : "You're Owed";
    let color = owed >= 0 ? { color: globals.COLOR_BLUE } : { color: globals.COLOR_ORANGE };

    return (

        
        <View style={border ? styles.listItemSeperator : styles.listItem} >

            <Text style={globals.styles.listText}>{name}</Text>
            <View style={{ width: 'auto', paddingRight: '.5em', marginTop: '-.5em', marginBottom: '-.5em', minWidth: '5em', alignItems: 'center' }}>
                <Text style={[globals.styles.listText, { fontSize: '.66em' }, color]}>{text}</Text>
                <Text style={[globals.styles.listText, color]}>${Math.abs(owed)}</Text>
            </View>

        </View>
        

    );
}

function GroupList() {

    let [groupItems, setGroupItems] = useState(null);

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {

            setGroupItems(await getGroups());
        }
        getItems();

    }, []);

    if (groupItems === null) {
        //List hasnt loaded yet show nothing
        return (
            <Image source={LoadingGif} style={globals.styles.loading} />
        );

    } else {
        //List has been returned, render it
        return (
            <>
                {groupItems}
            </>
            
        );

    }
}

function GroupListItem(props) {

    return (

        <View style={props.border ? styles.listItemSeperator : styles.listItem} >

            <Text style={globals.styles.listText}>{props.name}</Text>

        </View>
    );
}

async function getGroups() {

    let groupList = [];

    


    // pul username and password in form data for a POST request
    let payload = new URLSearchParams();
    payload.append('brief', true);

    // do the POST request
    try {
        let response = await fetch("/groups.php" + payload, { method: 'GET', credentials: 'same-origin' });

       


        if (response.ok) {
            /*
            let groups = await response.json()['groups'];

            for (let i = 0; i < groups.length; i++) {

                groupList.push(<GroupListItem key={i} border={i > 0} name={groups[i].group_name} id={groups[i].group_id} />);
            }*/
        }
        else {
           
        }
    }
    catch (error) {
        console.log("error in in GET request to groups (/groups.php)");
        console.log(error);
    }

    return groupList;  

}


const styles = StyleSheet.create({
    groupName: {
        color: globals.COLOR_GRAY,
        borderStyle: 'none',
        borderBottomStyle: 'solid',
        borderWidth: 2,
        borderColor: globals.COLOR_GRAY,
        borderRadius: 2,
        paddingLeft: 0,
        paddingBottom: '.25em'
    },
    listItem: {
        backgroundColor: globals.COLOR_WHITE,
        justifyContent: 'space-between',
        alignItems: 'left',
        flexDirection: 'row',
        marginTop: '.5em',
        paddingBottom: '.5em',
        paddingLeft: '1em'

    },
    listItemSeperator: {
        backgroundColor: globals.COLOR_WHITE,
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

});