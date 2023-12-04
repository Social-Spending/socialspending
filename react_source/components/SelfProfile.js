import * as globals from "../utils/globals.js";

import { Text, View } from '../utils/globals.js';
import { useState, useEffect, useContext } from 'react';

import Button from "./Button.js";

import { getUserInfo } from '../utils/friends.js'

import { ModalContext } from '../modals/ModalContext.js';
import { GlobalContext } from "./GlobalContext.js";
import EditProfile from "../modals/EditProfile.js";
import ChangeableIcon from "./ChangeableIcon.js"
import SVGIcon from "./SVGIcon.js";

export default function SelfProfile(props) {

    const { pushModal, popModal } = useContext(ModalContext);
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
        pushModal(<EditProfile/>);
    }

    return (
        <View style={{ flexDirection: 'row', height: '100%', flex: 1}}>
            <View style={styles.groupInfo} >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: '100%', width: 'auto'}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center'}} >
                        <ChangeableIcon iconPath={iconPath} name={username} />
                        <Text style={{ ...globals.styles.h1, ...globals.styles.profileAndGroupNameText}}>MY PROFILE</Text>
                    </View>
                </View>
                
                <View style={styles.listHeader}>
                    <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>USERNAME</Text>
                    <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>{username}</Text>
                </View>
                <View style={styles.listHeader}>
                    <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>EMAIL</Text>
                    <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>{email}</Text>
                </View>
                <View style={{ ...styles.listHeader, ...{ borderWidth: 0 } }}>
                    <Button id="profile_editProfile" style={{ ...globals.styles.formButton, ...{ width: '15em', margin: 0, marginTop: '.25em' } }}  onClick={editProfile} >
                           
                        <label htmlFor="profile_editProfile" style={globals.styles.buttonLabel }>
                            EDIT PROFILE
                        </label>
                    </Button>
                </View>
                
            </View>
        </View>
    );
}

const styles = {
    groupInfo: {
        flex: 1,
        width: 'auto',
        margin: `1em min(5em, 5vw)`,
        padding: `2.5em min(2.5em, 2.5vw)`
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderStyle: 'none none solid none',
        borderWidth: '2px',
        borderColor: globals.COLOR_OFF_WHITE,
        padding: '.75em'
    },
    icon: {
        fill: globals.COLOR_WHITE,
        width: '1.25em'
    },
    

};
