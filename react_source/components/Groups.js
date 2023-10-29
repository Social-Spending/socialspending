import * as globals from "../utils/globals.js";

import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect } from 'react';

import { Link } from "expo-router";

import Sidebar from './CollapsabileSidebar.js'

const LoadingGif = require('../assets/images/loading/loading-blue-block-64.gif');

export default function Groups(props) {
    return (
        <>
            <Sidebar title={'Groups'}>
               <GroupList />
            </Sidebar>
        </>
        
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
    groups: {
        width: '35vw',
        minHeight: '20em',
        height: '25vw',
        backgroundColor: globals.COLOR_WHITE,
        minWidth: '20em',
        boxShadow: '0px 0px 5px 5px #eee',

        justifyContent: 'flex-start',
        alignItems: 'left',
        overflow: 'hidden'
    },
    label: {
        marginLeft: '3%',
        paddingLeft: ' .5em',
        paddingTop: '2em',
        paddingBottom: '0em',
        color: globals.COLOR_GRAY,
    },
    newGroup: {
        marginRight: '3%',
        paddingRight: ' .5em',
        paddingTop: '2em',
        paddingBottom: '0em',
        color: globals.COLOR_ORANGE,
        alignSelf: 'flex-end',
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