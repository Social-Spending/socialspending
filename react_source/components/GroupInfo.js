import * as globals from "../utils/globals.js";

import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect, useContext } from 'react';

import { Link } from "expo-router";

import Button from "./Button.js";

import TransactionInfo from "../modals/TransactionInfo.js";
import VerifyAction from "../modals/VerifyAction.js";
import UploadIcon from "../modals/UploadIcon.js";
import NewExpense from "../modals/NewExpense.js";


import Leave from '../assets/images/bx-log-out.svg';
import Upload from '../assets/images/bx-upload.svg';

import { getGroupInfo, leaveGroup, kickMemberFromGroup } from '../utils/groups.js'

import { ModalContext } from '../modals/ModalContext.js';
import { GlobalContext } from "./GlobalContext.js";


export default function GroupInfo(props) {

    let [groupMembers, setGroupMembers] = useState(null);
    let [transactions, setTransactions] = useState(null);
    let [groupName, setGroupName] = useState(null);
    let [iconPath, setIconPath] = useState(null);

    const setModal = useContext(ModalContext);
    const { currUserID, reRenderCount} = useContext(GlobalContext);

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {
            let json = null;

            if (props.id != null) json = await getGroupInfo(props.id);

            if (json !== null) {
                setGroupName(json.group_name);
                setIconPath(json.icon_path);
                setGroupMembers(getGroupMembers(currUserID, json));
                setTransactions(getTransactions(json));
            }            
        }
        getItems();
            
    }, [props.id, reRenderCount]);
    if (props.id == null || groupName == null) {
        return (<></>);
    }

    const leave = () => {
        setModal(<VerifyAction label="Are you sure you want to leave this group?" accept={() => leaveGroup(props.id)} />);
    }

    const addExpense = () => {
        setModal(<NewExpense groupID={props.id} />);
    }

    return (
        <View style={{ flexDirection: 'row', height: '100%', flex: 1}}>
            
            <View style={styles.groupInfo} >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: '100%', width: 'auto'}}>
                    <View style={globals.styles.listIconAndTextContainer }>
                        <GroupIcon iconPath={iconPath} groupName={groupName} groupID={props.id} />
                        <Text style={[globals.styles.h1, styles.groupName]}>{groupName}</Text>
                    </View>
                    
                    <Button style={[globals.styles.formButton, { width: '15em', margin: 0, marginTop: '.25em' }]} svg={Leave} iconStyle={styles.icon} label='LEAVE GROUP' onClick={leave} />
                </View>
                <View style={styles.listContainer}>
                    <Text style={[globals.styles.h3, styles.listTitle]}>Members</Text>
                    <View style={styles.listHeader} >

                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>USERNAME</Text>
                        <Text style={{ color: globals.COLOR_GRAY, paddingRight: '2em' }}>STANDING</Text>

                    </View>
                    <View style={[globals.styles.list, { marginTop: '.25em', width: '100%', marginBottom: '1em' }]}>
                        {groupMembers}
                    </View>

                </View>

                <View style={styles.listContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[globals.styles.h3, styles.listTitle]}>Transactions</Text>
                        <Button style={[globals.styles.formButton, { width: '10em', margin: 0, marginTop: '.45em', marginRight: '.75em' }]} label='+ NEW EXPENSE' onClick={addExpense} />
                    </View>
                    <View style={styles.listHeader} >

                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>TRANSACTION</Text>
                        <Text style={{ color: globals.COLOR_GRAY, paddingRight: '2em' }}>YOUR CONTRIBUTION</Text>

                    </View>
                    <View style={[globals.styles.list, { marginTop: '.25em', width: '100%', marginBottom: '1em' }]}>
                        {transactions}
                    </View>

                </View>
            </View> 
        </View>
    );
}

function GroupIcon({ iconPath, groupName, groupID }) {

    const [hover, setHover] = useState(false);
    const setModal = useContext(ModalContext);

    const upload = () => {
        setModal(<UploadIcon groupID={groupID} />);
    }

    return (
        <View onClick={upload}  onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <Image
                style={[globals.styles.listIcon, { width: '3em', height: '3em' }]}
                source={iconPath !== null ? decodeURI(iconPath) : globals.getDefaultGroupIcon(groupName)}
            />
            <View style={[{ display: hover ? 'inherit' : 'none'}, styles.uploadContainer]}>
                <Upload style={{ fill: globals.COLOR_WHITE, width: '2em', height: '2em' }} />
            </View>
            
        </View>
        
    );
}

function getGroupMembers(currUserID, json) {

   
    let outputList = [];

    outputList.push(<MemberListItem key={-1} border={false} name="You" id={currUserID} owed={json.debt} group_id={json.group_id} />);

    for (let i = 0; i < json['members'].length; i++) {

        outputList.push(<MemberListItem key={i} border={true} name={json['members'][i].username} id={json['members'][i].user_id} owed={json['members'][i].debt} group_id={json.group_id} />);
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
 *      @return {React.JSX.Element}  DOM element  
 */
function MemberListItem({ id, name, owed, border, group_id }) {

    let text = owed < 0 ? "Is Owed" : "Owes";
    let color = owed < 0 ? { color: globals.COLOR_BLUE } : { color: globals.COLOR_ORANGE };
    color = owed == 0 ? { color: globals.COLOR_GRAY } : color;

    // get currUserID to remove the 'kick' button next to the member list item for the current user
    // get reRender to re-load the page after a user has been removed
    const { currUserID, reRender} = useContext(GlobalContext);
    const setModal = useContext(ModalContext);

    function kickMember(event) {
        event.preventDefault();
        setModal(<VerifyAction label={'Are you sure you want to remove '+name+' from the group?'} accept={() => kickMemberFromGroup(id, group_id, setModal, reRender)} />);
    }

    return (

        <Link href={'/profile/' + id} asChild>
            <View style={border ? styles.listItemSeperator : styles.listItem} >

                <View style={globals.styles.listIconAndTextContainer}>
                    <Text style={globals.styles.listText}>{name}</Text>
                    {currUserID != id ? <Button style={[globals.styles.transparentButton, { width: '1.75em', margin: 0, marginTop: '.25em' }]} svg={Leave} iconStyle={styles.kickButton} aria-label="Kick User" onClick={kickMember} /> : <></>}
                </View>
                <View style={{ width: 'auto', paddingRight: '.5em', marginTop: '-.5em', marginBottom: '-.5em', minWidth: '5em', alignItems: 'center' }}>
                    <Text style={[globals.styles.listText, { fontSize: '.66em' }, color]}>{text}</Text>
                    <Text style={[globals.styles.listText, color]}>${Math.abs(owed / 100).toFixed(2)}</Text>
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

        <View style={[border ? styles.listItemSeperator : styles.listItem, {cursor:'pointer'}]} onClick={viewTransaction} >

            <Text style={[globals.styles.listText, pendingItalic]}>{name}</Text>
            <View style={{ width: 'auto', paddingRight: '.5em', marginTop: '-.5em', marginBottom: '-.5em', minWidth: '5em', alignItems: 'center' }}>
                <Text style={[globals.styles.listText, { fontSize: '.66em' }, color]}>{text}</Text>
                <Text style={[globals.styles.listText, color]}>${Math.abs(owed / 100).toFixed(2)}</Text>
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
        height: 'auto',
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
    listTitle: {
        color: globals.COLOR_GRAY,
        fontWeight: 600,
        paddingLeft: '1em',
        paddingBottom: '1.5em' 
    },
    icon: {
        fill: globals.COLOR_WHITE,
        width: '1.25em'
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

});