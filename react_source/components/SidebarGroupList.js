import * as globals from '../utils/globals.js'

import { Text, View, Image } from 'react-native';
import { useState, useEffect, useContext } from 'react';

import NewGroup from '../modals/NewGroup.js'
import Button from './Button.js';

import { getGroups } from '../utils/groups.js'

import { ModalContext } from '../modals/ModalContext.js';
import Loading from "./Loading.js";
import { GlobalContext } from './GlobalContext.js';


/**
 *  Sidebar of list of groups to display on the /groups page
 *      @param {number} groupID         Group ID of the currently selected group to display
 *      @param {function} setGroupID    Function handle that changes what group page is displayed
 *                                      setGroupID takes 1 number argument that is...
 *                                          the group_id of the group component to display
 *      @return {React.JSX.Element}     DOM element
 */
export default function SidebarGroupList(props) {

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

        <View style={[props.border ? globals.styles.listItemSeperator : globals.styles.listItem, {cursor: 'pointer'}]} onClick={() => props.setGroupID(props.id)} >
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
        // update the currently selected group to display, if one is not already selected
        if (i == 0 && groupID == null) setGroupID(groups[i].group_id);

        groupList.push(<GroupListItem key={i} border={i > 0} name={groups[i].group_name} id={groups[i].group_id} icon_path={groups[i].icon_path} setGroupID={setGroupID} />);
    }

    return groupList;

}
