import * as globals from '../utils/globals.js'

import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect, useContext } from 'react';

import Base from '../components/Base.js';
import WaitForAuth from '../components/WaitForAuth.js';
import NewFriend from '../modals/NewFriend.js';
import Button from '../components/Button.js';
import Loading from '../components/Loading.js';
import { ModalContext } from '../modals/ModalContext.js';
import { GlobalContext } from '../components/GlobalContext.js';
import { getFriends } from '../utils/friends.js';
import Profile from '../components/Profile.js';
import Sidebar from '../components/CollapsibleSidebar.js';

export default function Page() {
    let [friendID, setFriendID] = useState(null);

    return (
        <Base style={[globals.styles.container, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }]}>

        <Sidebar title={'Friends'}>
            <WaitForAuth redirectOnNotLoggedIn={'/login'}>
                <SidebarFriendList setFriendID={setFriendID} />
            </WaitForAuth>
        </Sidebar>
        <Profile id={friendID} />
    </Base>
    );
}

function SidebarFriendList(props) {
    let [friendItems, setFriendItems] = useState(null);
    let setModal = useContext(ModalContext);
    const {reRenderCount} = useContext(GlobalContext);

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {

            setFriendItems(await buildSidebarFriendListItems(props.setFriendID));
        }
        getItems();

    }, [reRenderCount]);

    const addFriendModal = () => {
        setModal(<NewFriend />);
    }

    if (friendItems === null) {
        //List hasnt loaded yet show nothing
        return (
            <Loading />
        );

    } else {
        //List has been returned, render it
        return (
            <>
                {friendItems}
                <Button style={{ height: '2em' }} textStyle={{ color: globals.COLOR_GRAY }} label="+ Add Friend" onClick={addFriendModal} />
            </>

        );

    }
}

function SidebarFriendListItems(props) {
    return (
        <View style={props.border ? styles.listItemSeperator : styles.listItem} onClick={() => props.setFriendID(props.id)} >
            <Text style={globals.styles.listText}>{props.name}</Text>
        </View>
    );
}

async function buildSidebarFriendListItems(setFriendID)
{
    let friendList = [];

    let friendJSON = await getFriends();

    if (friendJSON === null) return friendList;

    for (let i = 0; i < friendJSON.length; i++) {
        if (i == 0) setFriendID(friendJSON[i].user_id);
        friendList.push(<SidebarFriendListItems key={i} border={i > 0} name={friendJSON[i].username} id={friendJSON[i].user_id} setFriendID={setFriendID} />);
    }

    return friendList;
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
