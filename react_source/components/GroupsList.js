import * as globals from "../utils/globals.js";

import { Text, View, Image } from '../utils/globals.js';

import { useState, useEffect, useContext } from 'react';

import { getGroups } from '../utils/groups.js'
import Button from "./Button.js";
import { ModalContext } from "../modals/ModalContext.js";
import NewGroup  from "../modals/NewGroup.js";
import WaitForAuth from "./WaitForAuth.js";
import Loading from "./Loading.js";
import { GlobalContext } from "./GlobalContext.js";
import { Link } from "react-router-dom/dist/index.js";

export default function GroupsList(props) {

    let { pushModal, popModal } = useContext(ModalContext);


    const addGroupModal = () => {
        pushModal(<NewGroup />);
    }

    return (

        <View style={{ ...globals.styles.summaryList, ...props.style}}>

            <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
                <Text style={{ ...globals.styles.h2, ...globals.styles.summaryLabel}}>GROUPS</Text>
                <Button id="groupsList_createGroup" style={{ ...globals.styles.formButton, ...globals.styles.newGroupOrFriendButton }} onClick={addGroupModal}>
                    <label htmlFor="groupsList_createGroup" style={globals.styles.buttonLabel }>
                        + CREATE GROUP
                    </label>
                </Button>
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

                <Text style={globals.styles.listHeader}>GROUP NAME</Text>
                <Text style={{ ...globals.styles.listHeader, ...{ alignItems: 'center' } }}>BALANCE</Text>

                {groupItems}

            </View>
            
        );
    }
}

function GroupItem(props) {

    let text = props.owed < 0 ? "You're Owed" : "You Owe";
    let color = props.owed < 0 ? { color: globals.COLOR_BLUE } : { color: globals.COLOR_ORANGE };
    color = props.owed == 0 ? { color: globals.COLOR_GRAY } : color;

    return (
        <>
            <Link to={'/groups/' + props.id} style={globals.styles.listItemRow}>

                <Image
                    style={{ ...globals.styles.listIcon, ...{ marginLeft: '.75em', width: '2.5em', height: '2.5em' } }}
                    source={props.icon_path !== null ? decodeURI(props.icon_path) : globals.getDefaultGroupIcon(props.name)}
                />
                <Text style={{ ...globals.styles.listText, ...{ paddingLeft: '.25em' } }}>{props.name}</Text>
                
            </Link>
            <Link to={'/groups/' + props.id} style={globals.styles.listItemColumn}>
                
                <Text style={{ ...globals.styles.listText, ...{ fontSize: '.66em' }, ...color }}>{text}</Text>
                <Text style={{ ...globals.styles.listText, ...color }}>${Math.abs(props.owed / 100).toFixed(2)}</Text>
                    
            </Link>
        </>
        

    );
}

async function buildGroups() {

    let groupList = [];
    
    let groups = await getGroups();

    if (groups === null) return groupList;

    for (let i = 0; i < groups.length; i++) {
        groupList.push(<GroupItem key={i} name={groups[i].group_name} id={groups[i].group_id} owed={groups[i].debt} icon_path={groups[i].icon_path} />);
    }
           
    return groupList;

}
