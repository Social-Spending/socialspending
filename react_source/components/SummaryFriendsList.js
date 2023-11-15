import * as globals from "../utils/globals.js";

import { Text, View, Image } from '../utils/globals.js';
import { useState, useEffect, useContext } from 'react';


import { getFriends } from '../utils/friends.js'
import Button from "./Button.js";
import { ModalContext } from "../modals/ModalContext.js";
import WaitForAuth from "./WaitForAuth.js";
import Loading from "./Loading.js";
import NewFriend from "../modals/NewFriend.js";
import { GlobalContext } from "./GlobalContext.js";
import { Link } from "react-router-dom/dist/index.js";

export default function SummaryFriendsList(props) {

    let { pushModal, popModal } = useContext(ModalContext);


    const addFriendModal = () => {
        pushModal(<NewFriend />);
    }

    return (

        <View style={{ ...globals.styles.summaryList, ...props.style}}>

            <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
                <Text style={{ ...globals.styles.h2, ...globals.styles.summaryLabel}}>FRIENDS</Text>
                <Button id="friendsList_addFriend" style={{ ...globals.styles.formButton, ...globals.styles.newGroupOrFriendButton }} onClick={addFriendModal} >
                    <label htmlFor="friendsList_addFriend" style={globals.styles.buttonLabel }>
                        + ADD FRIEND 
                    </label>
                </Button>
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
    const {reRenderCount} = useContext(GlobalContext);


    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {

            setSummaryFriendItems(await buildFriends());
        }
        getItems();

    }, [reRenderCount]);

    if (summaryFriendItems === null) {
        //List hasn't loaded yet, show nothing
        return (
            <Loading />

        );

    } else {
        // List has been parsed into SummaryFriendItem components, render it
        return (
            <View style={globals.styles.list}>
                <View style={globals.styles.listLabel} >
                    <Text style={{ ...globals.styles.h3, ...globals.styles.listText}}>USERNAME</Text>
                    <View style={{ width: 'auto', paddingRight: '.5em', minWidth: '5em', alignItems: 'flex-end' }}>
                        <Text style={{ ...globals.styles.h3, ...globals.styles.listText}}>BALANCE</Text>
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
    color = props.owed == 0 ? { color: globals.COLOR_GRAY } : color;

    return (

        <Link to={'/profile/' + props.id}>
            <View style={props.border ? globals.styles.listItemSeperator : globals.styles.listItem} >
                <View style={globals.styles.listIconAndTextContainer}>
                    <Image
                        style={{ ...globals.styles.listIcon, ...{ marginLeft: '.75em', width: '2.5em', height: '2.5em'}}}
                        source={props.icon_path !== null ? decodeURI(props.icon_path) : globals.getDefaultUserIcon(props.name)}
                    />
                    <Text style={{ ...globals.styles.listText, ...{paddingLeft: '.25em'}}}>{props.name}</Text>
                </View>
                <View style={{ width: 'auto', paddingRight: '.5em', marginVertical: 'auto', minWidth: '5em', alignItems: 'center' }}>
                    <Text style={{ ...globals.styles.listText, ...{ fontSize: '.66em' }, ...color}}>{text}</Text>
                    <Text style={{ ...globals.styles.listText, ...color}}>${Math.abs(props.owed / 100).toFixed(2)}</Text>
                </View>

            </View>
        </Link>

    );
}

async function buildFriends() {

    let friendList = [];

    let friends = await getFriends();

    if (friends === null) return friendList;

    // only add friends that are not pending
    for (let i = 0; i < friends.length; i++) {
        if (friends[i].is_pending == 0)
        {
            friendList.push(<SummaryFriendItem
                key={i}
                border={i > 0}
                name={friends[i].username}
                id={friends[i].user_id}
                icon_path={friends[i].icon_path}
                owed={friends[i].debt}
            />);
        }
    }

    return friendList;
}
