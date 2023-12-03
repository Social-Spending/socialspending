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
import NewExpense from "../modals/NewExpense.js";
import SVGIcon from "./SVGIcon.js";


export default function GroupInfo(props) {

    let [groupMembers, setGroupMembers] = useState(null);
    let [transactions, setTransactions] = useState(null);
    let [groupName, setGroupName] = useState(null);
    let [iconPath, setIconPath] = useState(null);

    const { pushModal, popModal } = useContext(ModalContext);
    const { currUserID, currUsername, currUserIconPath, reRenderCount, reRender } = useContext(GlobalContext);

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
        pushModal(<VerifyAction label="Are you sure you want to leave this group?" accept={async () => {
            await leaveGroup(props.id, navigate);
            popModal();
            navigate("/groups", { replace: true });
            navigate(0); //fallback refresh page if already on groups
        }} />);
    }


    const addExpense = () => {
        pushModal(<NewExpense groupID={props.id} />);

    }

    function inviteMember() {
        pushModal(
            <UserSearch
                title="INVITE USER TO GROUP"
                label="Enter the username or email to send a group invite"
                onSubmit={(user, setErrorMsg, popModal, reRender) => {sendGroupInvitation(user, props.id, popModal, reRender, setErrorMsg);}}
                submitLabel="Send Invite"
            />);

    }

    return (
        <View style={{ flexDirection: 'row', height: '100%', flex: 1}}>
            
            <View style={styles.groupInfo} >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: '100%', width: 'auto'}}>
                    <View style={{ flexDirection: 'row' } }>
                        <ChangeableIcon iconPath={iconPath} name={groupName} groupID={props.id} />
                        <Text style={{ ...globals.styles.h1, ...styles.groupName}}>{groupName}</Text>
                    </View>
                    
                    <Button id="groupPage_leaveGroup" style={{ ...globals.styles.formButton, ...{ width: '15em', margin: 0, marginTop: '.25em' } }} onClick={leave}>
                        <SVGIcon src={Leave} style={styles.icon} />
                        <label htmlFor="groupPage_leaveGroup" style={globals.styles.buttonLabel }>
                            LEAVE GROUP
                        </label>
                    </Button>
                    
                </View>
                <View style={globals.styles.listContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={globals.styles.listTitle}>Members</Text>
                        <Button id="groupPage_addMember" style={{ ...globals.styles.formButton, ...{ width: '10em', margin: '.45em .75em 0' } }} onClick={inviteMember}>
                            <SVGIcon src={InviteIcon} style={styles.icon} />
                            <label htmlFor="groupPage_addMember" style={globals.styles.buttonLabel}>
                                ADD MEMBER
                            </label>
                        </Button>
                    </View>
                    

                    <View style={{ ...globals.styles.list, ...{ marginTop: '.25em', width: '100%', marginBottom: '1em' } }}>
                        <Text style={globals.styles.smallListHeader}>USERNAME</Text>
                        <Text style={{ ...globals.styles.smallListHeader, ...{ alignItems: 'flex-end' } }}>STANDING</Text>
                        {groupMembers}
                    </View>

                </View>

                <View style={globals.styles.listContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={globals.styles.listTitle }>Transactions</Text>
                        <Button id="groupPage_newExpense" style={{ ...globals.styles.formButton, ...{ width: '10em', margin: '.45em .75em 0' } }} onClick={addExpense}>
                            <label htmlFor="groupPage_newExpense" style={globals.styles.buttonLabel}>
                                + NEW EXPENSE
                            </label>
                        </Button>
                        
                    </View>
                    <View style={{ ...globals.styles.list, ...{ marginTop: '.25em', width: '100%', marginBottom: '1em' } }}>
                        <Text style={globals.styles.smallListHeader}>TRANSACTION</Text>
                        <Text style={{ ...globals.styles.smallListHeader, ...{ alignItems: 'flex-end' } } }>MY CONTRIBUTION</Text>
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
        name="Me"
        id={currUserID}
        owed={json.debt}
        group_id={json.group_id}
        icon_path={currUserIconPath}
    />);

    // add existing group members
    for (let i = 0; i < json['members'].length; i++) {

        outputList.push(<MemberListItem
            key={i}
            name={json['members'][i].username}
            id={json['members'][i].user_id}
            owed={json['members'][i].debt}
            group_id={json.group_id}
            icon_path={json['members'][i].icon_path}
        />);
    }

    // add members with pending invites
    for (let i = 0; i < json['pending_invites'].length; i++) {

        outputList.push(<MemberListItem
            key={i + json['members'].length}
            pending={true}
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
 *      @param {boolean} pending        if the user is a pending invite or not
 *      @param {number} group_id     group_id for the page being displayed
 *      @param {string} icon_path    relative link to icon resource
 *      @return {React.JSX.Element}  DOM element  
 */
function MemberListItem({ id, name, owed, pending, group_id, icon_path }) {

    let text = owed < 0 ? "Is Owed" : "Owes";
    let color = owed < 0 ? { color: globals.COLOR_BLUE } : { color: globals.COLOR_ORANGE };
    color = owed == 0 ? { color: globals.COLOR_GRAY } : color;

    // get currUserID to remove the 'kick' button next to the member list item for the current user
    // get reRender to re-load the page after a user has been removed
    const { currUserID, reRender } = useContext(GlobalContext);
    const { pushModal, popModal } = useContext(ModalContext);

    function kickMember() {
        if (pending) {
            pushModal(<VerifyAction label={'Are you sure you want to revoke the group invitation for ' + name + '?'} accept={() => revokeInvitation(id, group_id, popModal, reRender)} />);
        }else{
            pushModal(<VerifyAction label={'Are you sure you want to remove ' + name + ' from the group?'} accept={() => kickMemberFromGroup(id, group_id, popModal, reRender)} />);
        }
        
    }

    return (
        <>
            <Link to={currUserID != id ? '/profile/' + name : '/profile'} style={globals.styles.listItemRow}>
                
                <Image
                    style={{ ...globals.styles.listIcon, ...{ marginLeft: '.75em', width: '2.5em', height: '2.5em' } }}
                    source={icon_path !== null ? decodeURI(icon_path) : globals.getDefaultUserIcon(name)}
                />
                <Text style={{ ...globals.styles.listText, ...{ fontStyle: pending ? 'italic' : "inherit", paddingLeft: '.25em' } }}>{name}</Text>
                {currUserID != id &&

                    <Button style={{ ...globals.styles.transparentButton, ...{ width: '1.75em', margin: 0, marginTop: '.25em' } }} aria-label="Kick User" onClick={kickMember}>
                        <SVGIcon src={KickIcon} style={styles.kickButton} />
                    </Button>
                }
                
            </Link>
            <Link to={currUserID != id ? '/profile/' + name : '/profile'} style={{
                ...globals.styles.listItemColumn,
                ...{ alignItems: 'flex-end' }
            }}>
                
                {!pending &&
                    <>
                        <Text style={{ ...globals.styles.listText, ...{ fontSize: '.66em' }, ...color }}>{text}</Text>
                        <Text style={{ ...globals.styles.listText, ...color }}>${Math.abs(owed / 100).toFixed(2)}</Text>
                    </>
                }
               
            </Link>
        
        </>
        

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

    const { pushModal, popModal } = useContext(ModalContext);

    let text = owed >= 0 ? "Borrowed" : "Paid";
    let color = owed >= 0 ? { color: globals.COLOR_ORANGE } : { color: globals.COLOR_BLUE };
    color = owed == 0 ? { color: globals.COLOR_GRAY } : color;

    let pendingItalic = isApproved == 0 ? { fontStyle: 'italic' } : {};

    const viewTransaction = () => {
        pushModal(<TransactionInfo id={id} />);
    }

    return (

        <>
            <Text
                style={{ ...globals.styles.listText, ...globals.styles.listItemRow, ...pendingItalic, ...{ cursor: 'pointer' }}}
                onClick={viewTransaction}>
                {name}
            </Text>
            <View
                style={{
                ...globals.styles.listItemColumn,
                ...{alignItems: 'flex-end', cursor: 'pointer'}
                 }}
                onClick={viewTransaction}>
                <Text style={{ ...globals.styles.listText, ...{ fontSize: '.66em' }, ...color }}>{text}</Text>
                <Text style={{ ...globals.styles.listText, ...color }}>${Math.abs(owed / 100).toFixed(2)}</Text>
            </View>
        </>

            

        
        

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