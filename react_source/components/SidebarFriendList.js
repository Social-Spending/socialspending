import * as globals from '../utils/globals.js'

import { Text, View, Image } from '../utils/globals.js';
import { useState, useEffect, useContext } from 'react';

import NewFriend from '../modals/NewFriend.js';
import Button from './Button.js';
import Loading from './Loading.js';
import { ModalContext } from '../modals/ModalContext.js';
import { GlobalContext } from './GlobalContext.js';
import { getFriends } from '../utils/friends.js';

/**
 *  Sidebar of list of friends to display on the /friends page
 *      @param {number} friendID        user_id of the currently selected friend to display
 *      @param {function} setFriendID   Function handle that changes what profile page is displayed
 *                                      setFriendID takes 1 number argument that is...
 *                                          the user_id of the friend profile to display
 *      @return {React.JSX.Element}     DOM element
 */
export default function SidebarFriendList(props) {
    let [friendItems, setFriendItems] = useState(null);
    let { pushModal, popModal } = useContext(ModalContext);
    const {reRenderCount} = useContext(GlobalContext);

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {

            setFriendItems(await buildSidebarFriendListItems(props.friendID, props.setFriendID));
        }
        getItems();

    }, [reRenderCount]);

    const addFriendModal = () => {
        pushModal(<NewFriend />);
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
                <Button id="sidebar_addFriend" style={{ height: '2em' }} onClick={addFriendModal} >
                    <label htmlFor="sidebar_addFriend" style={{ ...globals.styles.h5, ...{ cursor: 'pointer', color: globals.COLOR_GRAY } }}>
                        + Add Friend
                    </label>
                </Button>
            </>

        );

    }
}

// properties: name, icon_path, border, setFriendID, isPending
function SidebarFriendListItems(props) {
    // show pending friend requests in italics
    let pendingItalic = props.isPending == 1 ? { fontStyle: 'italic' } : {};

    return (
        <Button id={"sidebar_friend_" + props.name} style={{ ...globals.styles.sidebarListItem, ...{ padding: 0 } }} onClick={() => props.setFriendID(props.id) }>
            <View style={{...globals.styles.sidebarListItem, ...{padding: '.25em 1em'}} }>
                <Image
                    style={{ ...globals.styles.listIcon, ...{ width: '1.25em', height: '1.25em'}}}
                    source={props.icon_path !== null ? decodeURI(props.icon_path) : globals.getDefaultUserIcon(props.name)}
                />
                <label htmlFor={"sidebar_friend_" + props.name} style={{ ...globals.styles.listText, ...pendingItalic, ...{ paddingLeft: '.25em' }}}>{props.name}</label>
            </View>
        </Button>
        
    );
}

async function buildSidebarFriendListItems(friendID, setFriendID)
{
    let friendList = [];

    let friendJSON = await getFriends();

    if (friendJSON === null) return friendList;

    for (let i = 0; i < friendJSON.length; i++) {
        // update what friend is displayed, if one is not already selected or if the selected profile is no longer a friend
        if (i == 0 && (friendID == null || friendJSON.find((f) => f.user_id == friendID) == null)) setFriendID(friendJSON[i].user_id);

        friendList.push(<SidebarFriendListItems
            key={i}
            name={friendJSON[i].username}
            id={friendJSON[i].user_id}
            icon_path={friendJSON[i].icon_path}
            isPending={friendJSON[i].is_pending}
            setFriendID={setFriendID}
        />);
    }

    return friendList;
}
