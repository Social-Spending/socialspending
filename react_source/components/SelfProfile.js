import * as globals from "../utils/globals.js";

import { Text, View } from '../utils/globals.js';
import { useState, useEffect, useContext } from 'react';

import Button from "./Button.js";

import { getUserInfo } from '../utils/friends.js'

import { ModalContext } from '../modals/ModalContext.js';
import { GlobalContext } from "./GlobalContext.js";
import EditProfile from "../modals/EditProfile.js";
import ChangeableIcon from "./ChangeableIcon.js"




export default function SelfProfile(props) {

    const setModal = useContext(ModalContext);
    const {
        reRenderCount,
        currUserID,
        currUsername,
        isLoading,
        currUserIconPath
    } = useContext(GlobalContext);

    let [username, setUsername] = useState(currUsername);
    let [email, setEmail] = useState(null);
    let [iconPath, setIconPath] = useState(currUserIconPath);

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {
            let json = null;

            if (!isLoading) {
                json = await getUserInfo(currUserID);
            }

            if (json != null) {
                setUsername(json.username);
                setEmail(json.email);
                setIconPath(json.icon_path);
            }
        }
        getItems();
    }, [isLoading, reRenderCount]);

    function editProfile() {
        setModal(<EditProfile/>);
    }

    return (
        <View style={{ flexDirection: 'row', height: '100%', flex: 1}}>
            <View style={styles.groupInfo} >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: '100%', width: 'auto'}}>
                    <View style={globals.styles.listIconAndTextContainer} >
                        <ChangeableIcon iconPath={iconPath} name={username} />
                        <Text style={{ ...globals.styles.h1, ...styles.groupName}}>Your Profile</Text>
                    </View>
                </View>
                <View style={styles.list}>
                    <View style={{ ...styles.listHeader, ...styles.listItem}}>
                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>USERNAME</Text>
                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>{username}</Text>
                    </View>
                    <View style={{ ...styles.listHeader, ...styles.listItemSeperator}}>
                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>EMAIL</Text>
                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>{email}</Text>
                    </View>
                    <View style={{ ...styles.listHeader, ...styles.listItemSeperator}}>
                        <Button style={{ ...globals.styles.formButton, ...{ width: '15em', margin: 0, marginTop: '.25em' }}} svg={null} iconStyle={styles.icon} label={'EDIT PROFILE'} onClick={editProfile} />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = {
    groupName: {
        color: globals.COLOR_GRAY,
        borderRadius: 2,
        padding: 0,
        paddingBottom: '.25em',
        margin: '0 .5em',
        fontWeight: 500
    },
    groupInfo: {
        flex: 1,
        width: 'auto',
        margin: `1em min(5em, 5vw)`,
        padding: `2.5em min(2.5em, 2.5vw)`
    },
    listItem: {
        justifyContent: 'space-between',
        alignItems: 'left',
        flexDirection: 'row',
        marginTop: '.5em',
        paddingBottom: '.5em',
        paddingLeft: '1em'

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
        paddingLeft: '1em'

    },
    listContainer: {
        flex:1,
        marginTop: '2em',
        boxShadow: '0px 0px 5px 5px #eee',
        borderRadius: '1em',
        backgroundColor: globals.COLOR_WHITE
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderStyle: 'none none solid',
        borderWidth: '1px',
        borderColor: '#eee',
        paddingBottom: '.5em'
    },
    icon: {
        fill: globals.COLOR_WHITE,
        width: '1.25em'
    },
    

};
