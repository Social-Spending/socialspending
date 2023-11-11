import * as globals from "../utils/globals.js";

import { Text, View, Image } from '../utils/globals.js';
import { useState, useEffect, useContext } from 'react';

import { Link } from "react-router-dom";

import Button from "./Button.js";

import TransactionInfo from "../modals/TransactionInfo.js";
import VerifyAction from "../modals/VerifyAction.js";


import Leave from '../assets/images/bx-log-out.svg';
import InviteIcon from '../assets/images/bx-user-plus.svg';
import KickIcon from '../assets/images/bx-user-minus.svg';

import { getGroupInfo, leaveGroup, kickMemberFromGroup, revokeInvitation, sendGroupInvitation } from '../utils/groups.js'

import { ModalContext } from '../modals/ModalContext.js';
import { GlobalContext } from "./GlobalContext.js";
import UserSearch from "../modals/UserSearch.js";
import { useNavigate } from "react-router-dom/dist/index.js";
import ChangeableIcon from "./ChangeableIcon.js"


export default function GroupInfo(props) {

    let [groupMembers, setGroupMembers] = useState(null);
    let [transactions, setTransactions] = useState(null);
    let [groupName, setGroupName] = useState(null);
    let [iconPath, setIconPath] = useState(null);

    const setModal = useContext(ModalContext);
    const { currUserID, currUsername, currUserIconPath, reRenderCount } = useContext(GlobalContext);

    const navigate = useNavigate();

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {
            let json = null;

            if (props.id != null) json = await getGroupInfo(props.id, navigate);

            if (json !== null) {
                setGroupName(json.group_name);
                setIconPath(json.icon_path);
                setGroupMembers(getGroupMembers(currUserID, currUsername, currUserIconPath, json));
                setTransactions(getTransactions(json));
            }            
        }
        getItems();
            
    }, [props.id, reRenderCount]);
    if (props.id == null || groupName == null) {
        return (<></>);
    }

    const leave = () => {
        setModal(<VerifyAction label="Are you sure you want to leave this group?" accept={() => leaveGroup(props.id, navigate)} />);
    }


    const addExpense = () => {
        setModal(<NewExpense groupID={props.id} />);

    }

    function inviteMember() {
        setModal(
            <UserSearch
                title="INVITE USER TO GROUP"
                label="Enter the username or email to send a group invite"
                onSubmit={(user, setErrorMsg, setModal, reRender) => {sendGroupInvitation(user, props.id, setModal, reRender, setErrorMsg);}}
                submitLabel="Send Invite"
            />);

    }

    return (
        <View style={{ flexDirection: 'row', height: '100%', flex: 1}}>
            
            <View style={styles.groupInfo} >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: '100%', width: 'auto'}}>
                    <View style={globals.styles.listIconAndTextContainer }>
                        <ChangeableIcon iconPath={iconPath} name={groupName} groupID={props.id} />
                        <Text style={{ ...globals.styles.h1, ...styles.groupName}}>{groupName}</Text>
                    </View>
                    
                    <Button style={{ ...globals.styles.formButton, ...{ width: '15em', margin: 0, marginTop: '.25em' }}} svg={Leave} iconStyle={styles.icon} label='LEAVE GROUP' onClick={leave} />
                    
                </View>
                <View style={styles.listContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ ...globals.styles.h3, ...styles.listTitle}}>Members</Text>
                        <Button style={{ ...globals.styles.formButton, ...{ width: '10em', margin: '.45em .75em 0' }}} svg={InviteIcon} iconStyle={styles.icon} label='ADD MEMBER' onClick={inviteMember} />
                    </View>
                    <View style={styles.listHeader} >

                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>USERNAME</Text>
                        <Text style={{ color: globals.COLOR_GRAY, paddingRight: '2em' }}>STANDING</Text>

                    </View>
                    <View style={{ ...globals.styles.list, ...{ marginTop: '.25em', width: '100%', marginBottom: '1em' }}}>
                        {groupMembers}
                    </View>

                </View>

                <View style={styles.listContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ ...globals.styles.h3, ...styles.listTitle }}>Transactions</Text>
                        <Button style={{}...globals.styles.formButton, ...{ width: '10em', margin: 0, marginTop: '.45em', marginRight: '.75em' }}} label='+ NEW EXPENSE' onClick={addExpense} />
                    </View>
                    <View style={styles.listHeader} >

                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>TRANSACTION</Text>
                        <Text style={{ color: globals.COLOR_GRAY, paddingRight: '2em' }}>YOUR CONTRIBUTION</Text>

                    </View>
                    <View style={{ ...globals.styles.list, ...{ marginTop: '.25em', width: '100%', marginBottom: '1em' }}}>
                        {transactions}
                    </View>

                </View>
            </View> 
        </View>
    );
}

function getGroupMembers(currUserID, currUsername, currUserIconPath, json) {

   
    let outputList = [];

    // add current user
    if (currUserIconPath == null)
    {
        currUserIconPath = globals.getDefaultUserIcon(currUsername);
    }
    outputList.push(<MemberListItem
        key={-1}
        border={false}
        name="You"
        id={currUserID}
        owed={json.debt}
        group_id={json.group_id}
        icon_path={currUserIconPath}
    />);

    // add existing group members
    for (let i = 0; i < json['members'].length; i++) {

        outputList.push(<MemberListItem
            key={i}
            border={true}
            name={json['members'][i].username}
            id={json['members'][i].user_id}
            owed={json['members'][i].debt}
            group_id={json.group_id}
            icon_path={json['members'][i].icon_path}
        />);
    }

    // add members with pending invites
    for (let i = 0; i < json['pending_invites'].length; i++) {

        outputList.push(<PendingMemberListItem
            key={i + json['members'].length}
            border={true}
            name={json['pending_invites'][i].username}
            id={json['pending_invites'][i].user_id}
            icon_path={json['pending_invites'][i].icon_path}
            group_id={json.group_id}
        />);
    }

    return outputList;

}

function getTransactions(json) {

    let outputList = [];

    for (let i = 0; i < json['transactions'].length; i++) {

        outputList.push(<TransactionListItem
            key={i}
            border={i > 0}
            name={json['transactions'][i].name}
            id={json['transactions'][i].transaction_id}
            owed={json['transactions'][i].user_debt}
            isApproved={json['transactions'][i].is_approved}
            />);
    }

    return outputList;

}

/**
 *  Assembles DOM elements for a single list entry
 *      @param {number} id           user_id of participant
 *      @param {string} name         username of participant
 *      @param {number} owed         how much the participant paid/owes
 *      @param {number} group_id     group_id for the page being displayed
 *      @param {string} icon_path    relative link to icon resource
 *      @return {React.JSX.Element}  DOM element  
 */
function MemberListItem({ id, name, owed, border, group_id, icon_path }) {

    let text = owed < 0 ? "Is Owed" : "Owes";
    let color = owed < 0 ? { color: globals.COLOR_BLUE } : { color: globals.COLOR_ORANGE };
    color = owed == 0 ? { color: globals.COLOR_GRAY } : color;

    // get currUserID to remove the 'kick' button next to the member list item for the current user
    // get reRender to re-load the page after a user has been removed
    const { currUserID, reRender } = useContext(GlobalContext);
    const setModal = useContext(ModalContext);

    function kickMember(event) {
        event.preventDefault();
        setModal(<VerifyAction label={'Are you sure you want to remove '+name+' from the group?'} accept={() => kickMemberFromGroup(id, group_id, setModal, reRender)} />);
    }

    return (

        <Link to={'/profile/' + id}>
            <View style={border ? globals.styles.listItemSeperator : globals.styles.listItem} >
                <View style={globals.styles.listIconAndTextContainer}>
                    <Image
                        style={{ ...globals.styles.listIcon, ...{marginLeft: '.75em', width: '2.5em', height: '2.5em'}}}
                        source={icon_path !== null ? decodeURI(icon_path) : globals.getDefaultUserIcon(name)}
                    />
                    <Text style={{ ...globals.styles.listText, ...{paddingLeft: '.25em'}}}>{name}</Text>
                    {currUserID != id ? <Button style={{ ...globals.styles.transparentButton, ...{ width: '1.75em', margin: 0, marginTop: '.25em' }}} svg={KickIcon} iconStyle={styles.kickButton} aria-label="Kick User" onClick={kickMember} /> : <></>}
                </View>
                <View style={{ width: 'auto', paddingRight: '.5em', marginTop: '-.5em', marginBottom: '-.5em', minWidth: '5em', alignItems: 'center' }}>
                    <Text style={{ ...globals.styles.listText, ...{ fontSize: '.66em' }, ...color}}>{text}</Text>
                    <Text style={{ ...globals.styles.listText, ...color}}>${Math.abs(owed / 100).toFixed(2)}</Text>
                </View>

            </View>
        </Link>

    );
}

/**
 *  Assembles DOM elements for a single list entry
 *      @param {number} id           user_id of participant
 *      @param {string} name         username of participant
 *      @param {number} group_id     group_id for the page being displayed
 *      @param {string} icon_path    relative link to this user's profile icon
 *      @return {React.JSX.Element}  DOM element  
 */
function PendingMemberListItem({ id, name, border, group_id, icon_path }) {
    // get currUserID to remove the 'kick' button next to the member list item for the current user
    // get reRender to re-load the page after a user has been removed
    const { currUserID, reRender} = useContext(GlobalContext);
    const setModal = useContext(ModalContext);

    function revokeInvite(event) {
        event.preventDefault();
        setModal(<VerifyAction label={'Are you sure you want to revoke the group invitation for '+name+'?'} accept={() => revokeInvitation(id, group_id, setModal, reRender)} />);
    }

    return (

        <Link to={'/profile/' + id}>
            <View style={border ? globals.styles.listItemSeperator : globals.styles.listItem} >

                <View style={globals.styles.listIconAndTextContainer}>
                    <Image
                        style={{ ...globals.styles.listIcon, ...{marginLeft: '.75em', width: '2.5em', height: '2.5em'}}}
                        source={icon_path !== null ? decodeURI(icon_path) : globals.getDefaultUserIcon(name)}
                    />
                    <Text style={{ ...globals.styles.listText, ...{fontStyle: 'italic', paddingLeft: '.25em'}}}>{name}</Text>
                    <Button style={{ ...globals.styles.transparentButton, ...{ width: '1.75em', margin: 0, marginTop: '.25em' }}} svg={KickIcon} iconStyle={styles.kickButton} aria-label="Revoke Invite" onClick={revokeInvite} />
                </View>

            </View>
        </Link>

    );
}

/**
 *  Assembles DOM elements for a single list entry
 *      @param {number} id           user_id of participant
 *      @param {string} name         username of participant
 *      @param {number} owed         how much the participant paid/owes
 *      @return {React.JSX.Element}  DOM element  
 */
function TransactionListItem({ id, name, owed, border, isApproved }) {

    const setModal = useContext(ModalContext);

    let text = owed >= 0 ? "Borrowed" : "Paid";
    let color = owed >= 0 ? { color: globals.COLOR_ORANGE } : { color: globals.COLOR_BLUE };
    color = owed == 0 ? { color: globals.COLOR_GRAY } : color;

    let pendingItalic = isApproved == 0 ? { fontStyle: 'italic' } : {};

    const viewTransaction = () => {
        setModal(<TransactionInfo id={id} />);
    }

    return (

        <View style={{ ...border ? globals.styles.listItemSeperator : globals.styles.listItem, ...{cursor:'pointer'}}} onClick={viewTransaction} >

            <Text style={{ ...globals.styles.listText, ...pendingItalic}}>{name}</Text>
            <View style={{ width: 'auto', paddingRight: '.5em', marginTop: '-.5em', marginBottom: '-.5em', minWidth: '5em', alignItems: 'center' }}>
                <Text style={{ ...globals.styles.listText, ...{ fontSize: '.66em' }, ...color}}>{text}</Text>
                <Text style={{ ...globals.styles.listText, ...color}}>${Math.abs(owed / 100).toFixed(2)}</Text>
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
        marginTop: '1em',
        margin: `1em min(5em, 5vw)`,
        padding: `2.5em min(2.5em, 2.5vw)`
    },
    listContainer: {
        height: 'auto',
        marginTop: '2em',
        boxShadow: '0px 0px 5px 5px #eee',
        borderRadius: '1em',
        backgroundColor: globals.COLOR_WHITE,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderStyle: 'none none solid',
        borderWidth: '1px',
        borderColor: '#eee',
        paddingBottom: '.5em'
    },
    listTitle: {
        color: globals.COLOR_GRAY,
        fontWeight: 600,
        paddingLeft: '1em',
        paddingBottom: '1.5em' 
    },
    icon: {
        fill: globals.COLOR_WHITE,
        width: '1.5em'
    },
    kickButton: {
        fill: globals.COLOR_GRAY,
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

};