import * as globals from '../../utils/globals.js'

import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect, useRef, useContext } from 'react';
import { useLocalSearchParams } from 'expo-router';

import Base from '../../components/Base.js';
import GroupInfo from '../../components/GroupInfo.js';
import NewGroup from '../../modals/NewGroup.js'
import Sidebar from '../../components/CollapsibleSidebar.js'
import Button from '../../components/Button.js';

import { leaveGroup, getGroups } from '../../utils/groups.js'

import { ModalContext } from '../../modals/ModalContext.js';
import WaitForAuth from '../../components/WaitForAuth.js';
import Loading from "../../components/Loading.js";
import { GlobalContext } from '../../components/GlobalContext.js';


export default function Page() {

    const { id } = useLocalSearchParams();
    let [groupID, setGroupID] = useState(id ? parseInt(id) : null);

    return (
        <Base style={[globals.styles.container, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
            
            <WaitForAuth redirectOnNotLoggedIn={'/login'}>
                <Sidebar title={'Groups'}>
                    <GroupList groupID={groupID} setGroupID={setGroupID} />
                </Sidebar>
                <GroupInfo id={groupID} />
            </WaitForAuth>
           
        </Base>
    );
}

function GroupList(props) {

    let [groupItems, setGroupItems] = useState(null);
    let setModal = useContext(ModalContext);
    const {reRenderCount} = useContext(GlobalContext);

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {

            setGroupItems(await buildGroups(props.groupID, props.setGroupID));
        }
        getItems();

    }, [reRenderCount]);

    const addGroupModal = () => {
        setModal(<NewGroup />);
    }

    if (groupItems === null) {
        //List hasnt loaded yet show nothing
        return (
            <Loading />
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

    return (

        <View style={props.border ? styles.listItemSeperator : styles.listItem} onClick={() => props.setGroupID(props.id)} >
            <View style={globals.styles.listIconAndTextContainer}>
                <Image
                    style={[globals.styles.listIcon, { width: '1.25em', height: '1.25em'}]}
                    source={props.icon_path !== null ? decodeURI(props.icon_path) : globals.getDefaultGroupIcon(props.name)}
                />
                <Text style={globals.styles.listText}>{props.name}</Text>
            </View>

        </View>
    );
}

async function buildGroups(groupID, setGroupID) {

    let groupList = [];

    let groups = await getGroups();

    if (groups === null) return groupList;

    for (let i = 0; i < groups.length; i++) {
        if (i == 0 && groupID == null) setGroupID(groups[i].group_id);
        groupList.push(<GroupListItem key={i} border={i > 0} name={groups[i].group_name} id={groups[i].group_id} icon_path={groups[i].icon_path} setGroupID={setGroupID} />);
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
