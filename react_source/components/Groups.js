import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

import { Link } from "expo-router";


import { HeaderText } from './TextComponents.js'

const LoadingGif = require('../assets/images/loading/loading-1-64.gif');

export default function Groups(props) {

    return (

        <View style={[styles.groups, props.style]}>

            <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
                <HeaderText size={2} style={[styles.label]}>GROUPS</HeaderText>
                <HeaderText href="/newGroup" size={3} style={styles.newGroup}>Create New Group</HeaderText>
            </View>

            <View style={{ alignSelf: 'center', height: '1px', width: '92%', backgroundColor: '#bbb' }} />


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
            <View style={styles.groupList}>
                <Image source={LoadingGif} style={styles.loading} />
            </View>

        );

    } else {
        //List has been returned, render it
        return (
            <View style={styles.groupList}>
                <View style={[styles.groupListItem, { position: 'sticky', top: 0, zIndex: 1 }]} >
                    <HeaderText size={3} style={[styles.groupText, { marginBottom: '-.5em' }]}>GROUP NAME</HeaderText>
                    <View style={{ width: '15%', paddingRight: '.5em', minWidth: '5em', alignItems: 'flex-end' }}>
                        <HeaderText size={3} style={[styles.groupText, { marginBottom: '-.5em' }]}>BALANCE</HeaderText>
                    </View>
                </View>
                {groupItems}

            </View>

        );

    }
}

function GroupItem(props) {

    let text = props.owed >= 0 ? "You're Owed" : "You Owe";

    return (

        <Link href={'/groups/' + props.id} asChild>
            <View style={styles.groupListItem} >

                <Text size={3} style={styles.groupText}>{props.name}</Text>
                <View style={{ width: 'auto', paddingRight: '.5em', marginTop: '-.5em', marginBottom: '-.5em', minWidth: '5em', alignItems: 'center' }}>
                    <Text size={3} style={[styles.groupText, { fontSize: '.66em' }, props.owed >= 0 ? { color: '#0fa3b1' } : { color: '#f7a072' }]}>{text}</Text>
                    <Text size={3} style={[styles.groupText, props.owed >= 0 ? { color: '#0fa3b1' } : { color: '#f7a072' }]}>${Math.abs(props.owed)}</Text>
                </View>

            </View>
        </Link>

    );
}

async function generateGroupList() {

    let groupList = [];

    for (let i = 0; i < 100; i++) {


        groupList.push(<View key={i * 2} style={{ alignSelf: 'center', height: '1px', width: '100%', backgroundColor: '#eee' }} />);

        groupList.push(<GroupItem key={i * 2 + 1} name={'Group ' + Math.abs(Math.floor(Math.sin(i) * 1000000))} id={Math.abs(Math.floor(Math.sin(i) * 1000000))} owed={(Math.tan(i) * 1000).toFixed(2)} />);
    }

    return groupList;

}


const styles = StyleSheet.create({
    groups: {
        width: '35vw',
        minHeight: '20em',
        height: '25vw',
        backgroundColor: '#FFF',
        minWidth: '20em',
        boxShadow: '0px 0px 5px 5px #eee',

        justifyContent: 'flex-start',
        alignItems: 'left',
        overflow: 'hidden'
    },
    groupList: {
        flex: 1,
        width: '92%',

        marginTop: '1em',
        marginBottom: '1em',

        justifyContent: 'flex-start',
        alignItems: 'left',
        alignSelf: 'center',

        backgroundColor: '#FFF',

        overflowY: 'scroll',
        scrollbarWidth: 'thin',

        //borderWidth: '1px',
        borderColor: '#ddd',

    },

    groupListItem: {
        marginTop: '1em',
        backgroundColor: '#FFF',
        paddingBottom: '1em',
        justifyContent: 'space-between',
        alignItems: 'left',
        flexDirection: 'row',

    },
    groupText: {
        fontSize: '1.17em',
        paddingTop: 0,
        paddingLeft: '2%',
        paddingRight: '2%',
        paddingBottom: 0,
        color: '#777'
    },
    label: {
        marginLeft: '3%',
        paddingLeft: ' .5em',
        paddingTop: '2em',
        paddingBottom: '0em',
        color: '#777',

    },
    newGroup: {
        marginRight: '3%',
        paddingRight: ' .5em',
        paddingTop: '2em',
        paddingBottom: '0em',
        color: '#f7a072',
        alignSelf: 'flex-end',
    },
    checkbox: {
        marginTop: '.75em',
        color: '#777',
        backgroundColor: 'red'
    },
    text: {
        color: '#777',
        fontSize: '.83em',
        fontWeight: 600
    },
    buttonContainer: {
        width: '75%',
        height: '1.75em',
        fontSize: '1.17em',
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '1em',
        backgroundColor: '#f7a072',
        borderRadius: 4,
        boxShadow: '3px 3px 3px #aaa',
    },
    loading: {
        height: '4em',
        width: '4em',
        minWidth: '2em',
        borderRadius: 1,
    },

});