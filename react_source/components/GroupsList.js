import * as globals from "../utils/globals.js";

import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect, useContext } from 'react';

import { Link } from "expo-router";

import { getGroups } from '../utils/groups.js'
import Button from "./Button.js";
import { ModalContext } from "../modals/ModalContext.js";
import WaitForAuth from "./WaitForAuth.js";
import Loading from "./Loading.js";
import { GlobalContext } from "./GlobalContext.js";

export default function GroupsList(props) {

    let setModal = useContext(ModalContext);


    const addGroupModal = () => {
        setModal(<NewGroup />);
    }

    return (

        <View style={[globals.styles.summaryList, props.style]}>

            <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
                <Text style={[globals.styles.h2, globals.styles.summaryLabel]}>GROUPS</Text>
                <Button style={[globals.styles.formButton, globals.styles.newGroupOrFriendButton]} label='+ CREATE GROUP' onClick={addGroupModal} />
            </View>

            <View style={{ alignSelf: 'center', height: '1px', width: '92%', backgroundColor: globals.COLOR_GRAY, marginTop: '.5em' }} />
            
            <WaitForAuth redirectOnNotLoggedIn={'/login'}>
                <GroupList />
            </WaitForAuth>

        </View>
    );
}

function GroupList() {

    let [groupItems, setGroupItems] = useState(null);
    const {reRenderCount} = useContext(GlobalContext);

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {

            setGroupItems(await buildGroups());
        }
        getItems();

    }, [reRenderCount]);

    if (groupItems === null) {
        //List hasnt loaded yet show nothing
        return (
            <Loading />

        );

    } else {
        //List has been returned, render it
        return (
            <View style={globals.styles.list}>
                <View style={[globals.styles.listItem, { padding: 0, position: 'sticky', top: 0, zIndex: 1, backgroundColor: globals.COLOR_WHITE }]} >
                    <Text style={[globals.styles.h3, globals.styles.listText]}>GROUP NAME</Text>
                    <View style={{ width: 'auto', paddingRight: '.5em', minWidth: '5em', alignItems: 'flex-end' }}>
                        <Text style={[globals.styles.h3, globals.styles.listText]}>BALANCE</Text>
                    </View>
                </View>
                {groupItems}

            </View>
        );
    }
}

function GroupItem(props) {

    let text = props.owed < 0 ? "You're Owed" : "You Owe";
    let color = props.owed < 0 ? { color: globals.COLOR_BLUE } : { color: globals.COLOR_ORANGE };

    return (

        <Link href={'/groups/' + props.id} asChild>
            <View style={props.border ? globals.styles.listItemSeperator : globals.styles.listItem} >

                <View style={globals.styles.listIconAndTextContainer}>
                    <Image
                        style={[globals.styles.listIcon, { marginLeft: '.75em', width: '2.5em', height: '2.5em'}]}
                        source={props.icon_path !== null ? decodeURI(props.icon_path) : globals.getDefaultGroupIcon(props.name)}
                    />
                    <Text style={[globals.styles.listText, {paddingLeft: '.25em'}]}>{props.name}</Text>
                </View>
                <View style={{ width: 'auto', paddingRight: '.5em', marginVertical: 'auto', minWidth: '5em', alignItems: 'center' }}>
                    <Text style={[globals.styles.listText, { fontSize: '.66em' }, color]}>{text}</Text>
                    <Text style={[globals.styles.listText, color]}>${Math.abs(props.owed / 100).toFixed(2)}</Text>
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
                    
        groupList.push(<GroupItem key={i} border={i > 0} name={groups[i].group_name} id={groups[i].group_id} owed={groups[i].debt} icon_path={groups[i].icon_path} />);
    }
           
    return groupList;

}
