import * as globals from "../utils/globals.js";

import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect } from 'react';

import { Link } from "expo-router";

const LoadingGif = require('../assets/images/loading/loading-blue-block-64.gif');

export default function Groups(props) {

    return (

        <View style={[styles.groups, props.style]}>

            <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
                <Text style={[globals.styles.h2, styles.label]}>GROUPS</Text>
                <Text href="/newGroup" style={[globals.styles.h3, styles.newGroup]}>Create New Group</Text>
            </View>

            <View style={{ alignSelf: 'center', height: '1px', width: '92%', backgroundColor: globals.COLOR_GRAY }} />


            <GroupList />


        </View>
    );
}

function GroupList() {

    let [groupItems, setGroupItems] = useState(null);

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {

            setGroupItems(await generateGroupList());
        }
        getItems();

    }, []);

    if (groupItems === null) {
        //List hasnt loaded yet show nothing
        return (
            <View style={globals.styles.list}>
                <Image source={LoadingGif} style={globals.styles.loading} />
            </View>

        );

    } else {
        //List has been returned, render it
        return (
            <View style={globals.styles.list}>
                <View style={[globals.styles.listItem, { position: 'sticky', top: 0, zIndex: 1 }]} >
                    <Text style={[globals.styles.h3, globals.styles.listText, { marginBottom: '-.5em' }]}>GROUP NAME</Text>
                    <View style={{ width: 'auto', paddingRight: '.5em', minWidth: '5em', alignItems: 'flex-end' }}>
                        <Text style={[globals.styles.h3, globals.styles.listText, { marginBottom: '-.5em' }]}>BALANCE</Text>
                    </View>
                </View>
                {groupItems}

            </View>

        );

    }
}

function GroupItem(props) {

    let text = props.owed >= 0 ? "You're Owed" : "You Owe";
    let color = props.owed >= 0 ? { color: globals.COLOR_BLUE } : { color: globals.COLOR_ORANGE };

    return (

        <Link href={'/groups/' + props.id} asChild>
            <View style={props.border ? globals.styles.listItemSeperator : globals.styles.listItem} >

                <Text style={globals.styles.text}>{props.name}</Text>
                <View style={{ width: 'auto', paddingRight: '.5em', marginTop: '-.5em', marginBottom: '-.5em', minWidth: '5em', alignItems: 'center' }}>
                    <Text style={[globals.styles.listText, { fontSize: '.66em' }, color]}>{text}</Text>
                    <Text style={[globals.styles.listText, color]}>${Math.abs(props.owed)}</Text>
                </View>

            </View>
        </Link>

    );
}

async function generateGroupList() {

    let groupList = [];

    for (let i = 0; i < 100; i++) {

        groupList.push(<GroupItem key={i} border={i >0} name={'Group ' + Math.abs(Math.floor(Math.sin(i) * 1000000))} id={Math.abs(Math.floor(Math.sin(i) * 1000000))} owed={(Math.tan(i) * 1000).toFixed(2)} />);
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
    }

});