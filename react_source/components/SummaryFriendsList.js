import * as globals from "../utils/globals.js";

import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect, useContext } from 'react';

import { Link } from "expo-router";

import { getFriends } from '../utils/friends.js'
import Button from "./Button.js";
import { ModalContext } from "../modals/ModalContext.js";
import WaitForAuth from "./WaitForAuth.js";
import Loading from "./Loading.js";
import NewFriend from "../modals/NewFriend.js";

export default function SummaryFriendsList(props) {

    let setModal = useContext(ModalContext);


    const addFriendModal = () => {
        setModal(<NewFriend />);
    }

    return (

        <View style={[globals.styles.summaryList, props.style]}>

            <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
                <Text style={[globals.styles.h2, globals.styles.summaryLabel]}>FRIENDS</Text>
                <Button style={[globals.styles.formButton, globals.styles.newGroupOrFriendButton]} label='+ ADD FRIEND' onClick={addFriendModal} />
            </View>

            <View style={{ alignSelf: 'center', height: '1px', width: '92%', backgroundColor: globals.COLOR_GRAY, marginTop: '.5em' }} />
            
            <WaitForAuth redirectOnNotLoggedIn={'/login'}>
                <FriendList />
            </WaitForAuth>

        </View>
    );
}

function FriendList() {

    let [summaryFriendItems, setSummaryFriendItems] = useState(null);

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {

            setSummaryFriendItems(await buildFriends());
        }
        getItems();

    }, []);

    if (summaryFriendItems === null) {
        //List hasn't loaded yet, show nothing
        return (
            <Loading />

        );

    } else {
        // List has been parsed into SummaryFriendItem components, render it
        return (
            <View style={globals.styles.list}>
                <View style={[globals.styles.listItem, { padding: 0, position: 'sticky', top: 0, zIndex: 1, backgroundColor: globals.COLOR_WHITE }]} >
                    <Text style={[globals.styles.h3, globals.styles.listText]}>USERNAME</Text>
                    <View style={{ width: 'auto', paddingRight: '.5em', minWidth: '5em', alignItems: 'flex-end' }}>
                        <Text style={[globals.styles.h3, globals.styles.listText]}>BALANCE</Text>
                    </View>
                </View>
                {summaryFriendItems}

            </View>
        );
    }
}

function SummaryFriendItem(props) {

    let text = props.owed < 0 ? "Owes You" : "You Owe";
    let color = props.owed < 0 ? { color: globals.COLOR_BLUE } : { color: globals.COLOR_ORANGE };

    return (

        <Link href={'/profile/' + props.id} asChild>
            <View style={props.border ? globals.styles.listItemSeperator : globals.styles.listItem} >

                <Text style={[globals.styles.listText, {paddingLeft: '.25em'}]}>{props.name}</Text>
                <View style={{ width: 'auto', paddingRight: '.5em', marginVertical: 'auto', minWidth: '5em', alignItems: 'center' }}>
                    <Text style={[globals.styles.listText, { fontSize: '.66em' }, color]}>{text}</Text>
                    <Text style={[globals.styles.listText, color]}>${Math.abs(props.owed / 100).toFixed(2)}</Text>
                </View>

            </View>
        </Link>

    );
}

async function buildFriends() {

    let friendList = [];

    let friends = await getFriends();

    if (friends === null) return friendList;

    for (let i = 0; i < friends.length; i++) {
        friendList.push(<SummaryFriendItem key={i} border={i > 0} name={friends[i].username} id={friends[i].user_id} owed={friends[i].debt} />);
    }

    return friendList;
}
