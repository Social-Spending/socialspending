import * as globals from "../utils/globals.js";

import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect, useContext } from 'react';

import Button from "./Button.js";

import { getUserInfo } from '../utils/friends.js'

import { ModalContext } from '../modals/ModalContext.js';
import { GlobalContext } from "./GlobalContext.js";
import EditProfile from "../modals/EditProfile.js";
import UploadIcon from "../modals/UploadIcon.js";

import Upload from '../assets/images/bx-upload.svg';


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
                        <UserIcon iconPath={iconPath} username={username} />
                        <Text style={[globals.styles.h1, styles.groupName]}>Your Profile</Text>
                    </View>
                </View>
                <View style={styles.list}>
                    <View style={[styles.listHeader, styles.listItem]}>
                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>USERNAME</Text>
                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>{username}</Text>
                    </View>
                    <View style={[styles.listHeader, styles.listItemSeperator]}>
                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>EMAIL</Text>
                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>{email}</Text>
                    </View>
                    <View style={[styles.listHeader, styles.listItemSeperator]}>
                        <Button style={[globals.styles.formButton, { width: '15em', margin: 0, marginTop: '.25em' }]} svg={null} iconStyle={styles.icon} label={'EDIT PROFILE'} onClick={editProfile} />
                    </View>
                </View>
            </View>
        </View>
    );
}

function UserIcon({iconPath, username}) {

    const [hover, setHover] = useState(false);
    const setModal = useContext(ModalContext);

    const upload = () => {
        setModal(<UploadIcon groupNUser={false} />);
    }

    return (
        <View onClick={upload}  onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <Image
                style={[globals.styles.listIcon, { width: '3em', height: '3em' }]}
                source={iconPath !== null ? decodeURI(iconPath) : globals.getDefaultUserIcon(username)}
            />
            <View style={[{ display: hover ? 'inherit' : 'none'}, styles.uploadContainer]}>
                <Upload style={{ fill: globals.COLOR_WHITE, width: '2em', height: '2em' }} />
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    groupName: {
        color: globals.COLOR_GRAY,
        borderRadius: 2,
        padding: 0,
        paddingBottom: '.25em',
        marginHorizontal: '.5em',
        fontWeight: 500
    },
    groupInfo: {
        flex: 1,
        width: 'auto',
        marginTop: '1em',
        marginHorizontal: `min(5em, 5vw)`,
        paddingVertical: '2.5em',
        paddingHorizontal: `min(2.5em, 2.5vw)`
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
        borderStyle: 'none',
        borderBottomStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#eee',
        paddingBottom: '.5em'
    },
    icon: {
        fill: globals.COLOR_WHITE,
        width: '1.25em'
    },
    uploadContainer: {
        cursor: 'pointer',
        position: 'absolute',
        width: '3em',
        height: '3em',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: globals.COLOR_MODAL
    }

});
