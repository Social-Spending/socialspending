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

    // make a quick GET request to login.php to check if the user's cookies are already authenticated
    // assemble endpoint for authentication
    fetch("/login.php", { credentials: 'same-origin' }).then((response) => {
        if (response.status == 200) {
            // redirect
            //router.replace("/summary");
        }
    });


    return (
        <Base style={[globals.styles.container, { flexDirection: 'row' }]}>
            <Sidebar title={'Groups'}>
                <GroupList />
            </Sidebar>
            <GroupInfo name="TEST GROUP" />
        </Base>
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
                <Button style={{ height: '2em' }} textStyle={{ color: globals.COLOR_GRAY }} label=" + Create New Group" />                
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
        let response = await fetch("/groups.php?" + payload, { method: 'GET', credentials: 'same-origin' });

        if (response.ok) {
            let json = await response.json();
            if (json !== null) {
                let groups = json['groups'];

                for (let i = 0; i < groups.length; i++) {

                    groupList.push(<GroupListItem key={i} border={i > 0} name={groups[i].group_name} id={groups[i].group_id} />);
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

    }

});
