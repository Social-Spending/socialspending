import * as globals from '../utils/globals.js'

import { StyleSheet, Text, View, Image } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';

const LoadingGif = require('../assets/images/loading/loading-blue-block-64.gif');

import Base from '../components/Base.js';
import GroupInfo from '../components/GroupInfo.js';
import Sidebar from '../components/CollapsibleSidebar.js'
import Button from '../components/Button.js';



export default function Page() {

    
    

    useEffect(() => {
        // make a quick GET request to login.php to check if the user's cookies are already authenticated
        // assemble endpoint for authentication
        // React advises to declare the async function directly inside useEffect
        fetch("/login.php", { credentials: 'same-origin' }).then((response) => {
            if (response.status != 200) {
                // redirect
                //router.replace("/login");
            }
        });

    }, []);

    let [groupID, setGroupID] = useState(null);

    return (
        <Base style={[globals.styles.container, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
            <Sidebar title={'Groups'}>
                <GroupList setGroupID={setGroupID} />
            </Sidebar>
            <GroupInfo id={groupID} />
        </Base>
    );
}

function GroupList(props) {

    let [groupItems, setGroupItems] = useState(null);

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {

            setGroupItems(await getGroups(props.setGroupID));
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
                <Button style={{ height: '2em' }} textStyle={{ color: globals.COLOR_GRAY }} label="+ Create New Group" />                
            </>

        );

    }
}

function GroupListItem(props) {

    console.log(props.id);
    return (

        <View style={props.border ? styles.listItemSeperator : styles.listItem} onClick={() => props.setGroupID(props.id)} >

            <Text style={globals.styles.listText}>{props.name}</Text>

        </View>
    );
}

async function getGroups(setGroupID) {

    let groupList = [];

    // pul username and password in form data for a POST request
    let payload = new URLSearchParams();
    payload.append('brief', true);

    // do the POST request
    try {
        let response = await fetch("/groups.php?" + payload, { method: 'GET', credentials: 'same-origin' });

        if (response.ok) {
            let json = await response.json();
            if (json !== null) {
                let groups = json['groups'];

                for (let i = 0; i < groups.length; i++) {
                    if (i == 0) setGroupID(groups[i].group_id);
                    groupList.push(<GroupListItem key={i} border={i > 0} name={groups[i].group_name} id={groups[i].group_id} setGroupID={setGroupID} />);
                }
            }

            
        }
    }
    catch (error) {
        console.log("error in in GET request to groups (/groups.php)");
        console.log(error);
    }

    return groupList;

}

const styles = StyleSheet.create({
    
    listItem: {
        justifyContent: 'space-between',
        alignItems: 'left',
        flexDirection: 'row',
        marginTop: '.5em',
        paddingBottom: '.5em',
        paddingLeft: '1em',
        cursor: 'pointer'

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
        paddingLeft: '1em',
        cursor: 'pointer'

    }

});
