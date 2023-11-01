import * as globals from "../utils/globals.js";

import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect, useContext } from 'react';

import { Link } from "expo-router";

const LoadingGif = require('../assets/images/loading/loading-blue-block-64.gif');

import { getGroups } from '../utils/groups.js'
import Button from "./Button.js";
import { ModalContext } from "../modals/ModalContext.js";
import NewGroup from "../modals/NewGroup.js";

export default function GroupsList(props) {

    let setModal = useContext(ModalContext);


    const addGroupModal = () => {
        setModal(<NewGroup />);
    }

    return (

        <View style={[styles.groups, props.style]}>

            <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
                <Text style={[globals.styles.h2, styles.label]}>GROUPS</Text>
                <Button style={[globals.styles.formButton, styles.newGroup]} label='+ CREATE GROUP' onClick={addGroupModal} />
            </View>

            <View style={{ alignSelf: 'center', height: '1px', width: '92%', backgroundColor: globals.COLOR_GRAY, marginTop: '.5em' }} />


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

            setGroupItems(await buildGroups());
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

                <Text style={[globals.styles.listText]}>{props.name}</Text>
                <View style={{ width: 'auto', paddingRight: '.5em', marginTop: '-.5em', marginBottom: '-.5em', minWidth: '5em', alignItems: 'center' }}>
                    <Text style={[globals.styles.listText, { fontSize: '.66em' }, color]}>{text}</Text>
                    <Text style={[globals.styles.listText, color]}>${Math.abs(props.owed)}</Text>
                </View>

            </View>
        </Link>

    );
}

async function buildGroups() {

    let groupList = [];
    
    let groups = await getGroups();

    if (groups === null) return groupList;

    for (let i = 0; i < groups.length; i++) {
                    
        groupList.push(<GroupItem key={i} border={i > 0} name={groups[i].group_name} id={groups[i].group_id} owed={groups[i].debt} />);
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
        marginTop: '2em',
        paddingBottom: '0em',
        color: globals.COLOR_ORANGE,
        alignSelf: 'flex-end',
        width: '10em'
    }

});