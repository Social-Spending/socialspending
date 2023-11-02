import * as globals from '../../utils/globals.js'

import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect, useRef, useContext } from 'react';

const LoadingGif = require('../../assets/images/loading/loading-blue-block-64.gif');

import Base from '../../components/Base.js';
import GroupInfo from '../../components/GroupInfo.js';
import NewGroup from '../../modals/NewGroup.js'
import Sidebar from '../../components/CollapsibleSidebar.js'
import Button from '../../components/Button.js';

import { leaveGroup, getGroups } from '../../utils/groups.js'

import { ModalContext } from '../../modals/ModalContext.js';
import WaitForAuth from '../../components/WaitForAuth.js';


export default function Page() {
    let [groupID, setGroupID] = useState(null);

    return (
        <Base style={[globals.styles.container, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
            <WaitForAuth redirectOnNotLoggedIn={'/login'}>
                <Sidebar title={'Groups'}>
                    <GroupList setGroupID={setGroupID}  />
                </Sidebar>
                <GroupInfo id={groupID} />
            </WaitForAuth>
        </Base>
    );
}

function GroupList(props) {

    let [groupItems, setGroupItems] = useState(null);
    let setModal = useContext(ModalContext);

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {

            setGroupItems(await buildGroups(props.setGroupID));
        }
        getItems();

    }, []);

    const addGroupModal = () => {
        setModal(<NewGroup />);
    }

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
                <Button style={{ height: '2em' }} textStyle={{ color: globals.COLOR_GRAY }} label="+ Create New Group" onClick={addGroupModal} />                
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

async function buildGroups(setGroupID) {

    let groupList = [];

    let groups = await getGroups();

    if (groups === null) return groupList;

    for (let i = 0; i < groups.length; i++) {
        if (i == 0) setGroupID(groups[i].group_id);
        groupList.push(<GroupListItem key={i} border={i > 0} name={groups[i].group_name} id={groups[i].group_id} setGroupID={setGroupID} />);
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
