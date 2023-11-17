import * as globals from '../utils/globals.js'

import { Text, View, Image } from '../utils/globals.js';
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
    let { pushModal, popModal } = useContext(ModalContext);
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
        pushModal(<NewGroup />);
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
                <Button id="sidebar_createGroup" style={{ height: '2em' }} onClick={addGroupModal} >
                    <label htmlFor="sidebar_createGroup" style={{ ...globals.styles.h5, ...{ cursor: 'pointer', color: globals.COLOR_GRAY } }}>
                        + Create New Group
                    </label>
                </Button>            
            </>

        );

    }
}

function GroupListItem(props) {

    return (

        <Button id={"sidebar_group_" + props.name} style={{ ...globals.styles.sidebarListItem, ...{ padding: 0 } }} onClick={() => props.setGroupID(props.id)} >
            <View style={{ ...globals.styles.sidebarListItem, ...{padding: '.25em 1em'}}}>
                <Image
                    style={{ ...globals.styles.listIcon, ...{ width: '1.25em', height: '1.25em'}}}
                    source={props.icon_path !== null ? decodeURI(props.icon_path) : globals.getDefaultGroupIcon(props.name)}
                />
                <label htmlFor={"sidebar_group_" + props.name} style={{ ...globals.styles.listText, ...{ paddingLeft: '.25em' }}}>{props.name}</label>
            </View>
        </Button>
    );
}

async function buildGroups(groupID, setGroupID) {

    let groupList = [];

    let groups = await getGroups();

    if (groups === null) return groupList;

    for (let i = 0; i < groups.length; i++) {
        // update the currently selected group to display, if one is not already selected
        if (i == 0 && groupID == null) setGroupID(groups[i].group_id);

        groupList.push(<GroupListItem key={i} name={groups[i].group_name} id={groups[i].group_id} icon_path={groups[i].icon_path} setGroupID={setGroupID} />);
    }

    return groupList;

}
