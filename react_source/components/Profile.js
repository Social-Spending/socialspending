import * as globals from "../utils/globals.js";

import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect, useContext } from 'react';

import { Link } from "expo-router";

import Button from "./Button.js";

import TransactionInfo from "../modals/TransactionInfo.js";
import VerifyAction from "../modals/VerifyAction.js";


import UnfriendIcon from '../assets/images/bx-user-minus.svg';
import ApproveSvg   from '../assets/images/bx-user-check.svg';
import DenySvg      from '../assets/images/bx-user-x.svg';
import AddFriendSvg from '../assets/images/bx-user-plus.svg';

import { getUserInfo, removeFriend, addFriend, acceptRejectFriendRequest, cancelFriendRequest} from '../utils/friends.js'

import { ModalContext } from '../modals/ModalContext.js';
import { GlobalContext } from "./GlobalContext.js";
import NewExpense from "../modals/NewExpense.js";


export default function Profile(props) {

    let [groups, setGroups] = useState(null);
    let [transactions, setTransactions] = useState(null);
    let [username, setUsername] = useState(null);
    let [email, setEmail] = useState(null);
    let [iconPath, setIconPath] = useState(null);
    let [debt, setDebt] = useState(null);
    let [isFriend, setIsFriend] = useState(false);
    let [isPendingFriend, setIsPendingFriend] = useState(false);
    let [friendRequestNotificationID, setFriendRequestNotificationID] = useState(null);
    let [friendRequestCanApprove, setFriendRequestCanApprove] = useState(null);

    const setModal = useContext(ModalContext);
    const { reRenderCount } = useContext(GlobalContext);


    function unfriend() {
        setModal(<VerifyAction label={"Are you sure you want to unfriend " + username + " ?"} accept={() => {removeFriend(username); setIsFriend(false); setModal(null); }} />);
    }
    function verifyAddFriend() {
        setModal(<VerifyAction label={"Are you sure you want to add " + username + " as a friend?"} accept={() => { addFriend(username); setIsPendingFriend(true);  setModal(null);}} />);
    }
    function verifyAcceptRejectFriend(acceptNReject) {
        setModal(<VerifyAction label={"Are you sure you want to "+(acceptNReject ? "accept" : "reject")+" friend request from " + username + "?"} accept={() => {acceptRejectFriendRequest(friendRequestNotificationID, acceptNReject); setIsPendingFriend(false); setIsFriend(acceptNReject); setModal(null);}} />);
    }
    function verifyCancelFriendRequest() {
        setModal(<VerifyAction label={"Are you sure you want to revoke your friend request to " + username + "?"} accept={() => {cancelFriendRequest(friendRequestNotificationID); setIsPendingFriend(false); setModal(null);}} />);
    }


    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {
            let json = null;

            if (props.id != null) {
                json = await getUserInfo(props.id);
            }

            if (json != null) {
                setUsername(json.username);
                setEmail(json.email);
                setIconPath(json.icon_path);
                setDebt(json.debt);
                setIsFriend(json.is_friend);
                setIsPendingFriend(json.is_pending_friend);
                setFriendRequestNotificationID(json.friend_request_notification_id);
                setFriendRequestCanApprove(json.friend_request_can_approve);
                setGroups(getGroupList(json.groups));
                setTransactions(getTransactionList(json.transactions));
            }
        }
        getItems();

    }, [props.id, reRenderCount]);
    if (props.id == null || username == null) {
        return (<></>);
    }


    const addExpense = () => {
        setModal(<NewExpense profile={true} />);
    }

    let text = debt < 0 ? "Owes You" : "You Owe";
    let color = debt < 0 ? { color: globals.COLOR_BLUE } : { color: globals.COLOR_ORANGE };
    color = debt == 0 ? { color: globals.COLOR_GRAY } : color;

    return (
        <View style={{ flexDirection: 'row', height: '100%', flex: 1}}>
            <View style={styles.groupInfo} >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: '100%', width: 'auto'}}>
                    <View style={globals.styles.listIconAndTextContainer}>
                        <Image
                            style={[globals.styles.listIcon, { width: '3em', height: '3em' }]}
                            source={iconPath !== null ? decodeURI(iconPath) : globals.getDefaultUserIcon(username)}
                        />
                        <Text style={[globals.styles.h1, styles.groupName]}>{username}</Text>
                        
                    </View>
                    <FriendInteractionButtons
                        isFriend={isFriend}
                        isPendingFriend={isPendingFriend}
                        friendRequestCanApprove={friendRequestCanApprove}
                        onUnfriend={unfriend}
                        unAcceptRejectFriend={(acceptNReject) => verifyAcceptRejectFriend(acceptNReject)}
                        onCancelFriend={verifyCancelFriendRequest}
                        onAddFriend={verifyAddFriend}
                    />
                </View>
                <View style={styles.listContainer}>
                    <Text style={[globals.styles.h3, styles.listTitle]}>Email</Text>
                    <View style={styles.listHeader} >

                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600', paddingBottom: '1.5em' }}>{email}</Text>

                    </View>
                </View>

                <View style={styles.listContainer}>
                    <Text style={[globals.styles.h3, styles.listTitle]}>Groups in Common</Text>
                    <View style={styles.listHeader} >

                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>GROUP NAME</Text>

                    </View>
                    <View style={[globals.styles.list, { marginTop: '.25em', width: '100%', marginBottom: '1em' }]}>
                        {groups}
                    </View>
                </View>

                <View style={styles.listContainer}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={[globals.styles.h3, styles.listTitle]}>Transactions in Common</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 'auto', paddingRight: '.5em', marginTop: '.45em', minWidth: '5em', alignItems: 'center' }}>
                                <Text style={[globals.styles.listText, { fontSize: '.66em' }, color]}>{text}</Text>
                                <Text style={[globals.styles.listText, color]}>${Math.abs(debt / 100).toFixed(2)}</Text>
                            </View>
                            <Button style={[globals.styles.formButton, { width: '10em', margin: 0, marginTop: '.45em', marginRight: '.75em' }]} label='+ NEW EXPENSE' onClick={addExpense} />
                        </View>
                        
                    </View>
                    
                    <View style={styles.listHeader} >

                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>TRANSACTION</Text>
                        <Text style={{ color: globals.COLOR_GRAY, paddingRight: '2em' }}>DATE</Text>

                    </View>
                    <View style={[globals.styles.list, { marginTop: '.25em', width: '100%', marginBottom: '1em' }]}>
                        {transactions}
                    </View>

                </View>
            </View>
        </View>
    );
}

function FriendInteractionButtons({isFriend, isPendingFriend, friendRequestCanApprove, onUnfriend, unAcceptRejectFriend, onCancelFriend, onAddFriend}) {
    // function to return an array of DOM buttons that let you interact with the friendship
    // ie. add friend, unfriend, accept friend request, reject friend request, cancel friend request
    // this must be called after all other state variables have been set
    if (isFriend) {
        // users are friends, only option is to not be friends
        return (<Button
            style={[globals.styles.formButton, { width: '15em', margin: 0, marginTop: '.25em' }]}
            svg={UnfriendIcon}
            iconStyle={styles.icon}
            label={'UNFRIEND'}
            onClick={onUnfriend}
        />);
    }
    else if (isPendingFriend) {
        // pending friend request
        if (friendRequestCanApprove) {
            // friend request has been sent to this user, options are to accept to reject request
            return (
                <View>
                    <Button
                        style={[globals.styles.formButton, styles.friendInteractionButton]}
                        svg={DenySvg}
                        iconStyle={styles.icon}
                        label={'REJECT FRIEND REQUEST'}
                        onClick={() => unAcceptRejectFriend(false)}
                    />
                    <Button
                        style={[globals.styles.formButton, styles.friendInteractionButton]}
                        svg={ApproveSvg}
                        iconStyle={styles.icon}
                        label={'ACCEPT FRIEND REQUEST'}
                        onClick={() => unAcceptRejectFriend(true)}
                    />
                </View>
            );
        }
        else {
            // friend request was sent by the current user, option is to cancel it
            return (<Button
                style={[globals.styles.formButton, styles.friendInteractionButton]}
                svg={DenySvg}
                iconStyle={styles.icon}
                label={'CANCEL FRIEND REQUEST'}
                onClick={onCancelFriend}
            />);
        }
    }
    else {
        // no pending friend request, only option is to send friend request
        return (<Button
            style={[globals.styles.formButton, styles.friendInteractionButton]}
            svg={AddFriendSvg}
            iconStyle={styles.icon}
            label={'ADD FRIEND'}
            onClick={onAddFriend}
        />);
    }
}

function getGroupList(groupsJSON) {
    let outputList = [];

    for (let i = 0; i < groupsJSON.length; i++) {

        outputList.push(<GroupListItem key={i} border={i > 0} name={groupsJSON[i].group_name} id={groupsJSON[i].group_id} icon_path={groupsJSON[i].icon_path} />);
    }

    return outputList;
}

function getTransactionList(transactionsJSON) {
    let outputList = [];

    for (let i = 0; i < transactionsJSON.length; i++) {
        outputList.push(
            <TransactionListItem
                key={i}
                border={i > 0}
                name={transactionsJSON[i].name}
                id={transactionsJSON[i].transaction_id}
                date={transactionsJSON[i].date}
                user_debt={transactionsJSON[i].user_debt}
                isApproved={transactionsJSON[i].is_approved}
            />
        );
    }

    return outputList;
}

function GroupListItem({ id, name, icon_path, border }) {
    return (

        <Link href={'/groups/' + id} asChild>
            <View style={border ? globals.styles.listItemSeperator : globals.styles.listItem} >
                <View style={globals.styles.listIconAndTextContainer}>
                    <Image
                        style={[globals.styles.listIcon, { marginLeft: '.75em', width: '2.5em', height: '2.5em'}]}
                        source={icon_path !== null ? decodeURI(icon_path) : globals.getDefaultGroupIcon(name)}
                    />
                    <Text style={[globals.styles.listText, {paddingLeft: '.25em'}]}>{name}</Text>
                </View>
            </View>
        </Link>

    );
}

function TransactionListItem({ id, name, date, user_debt, border, isApproved }) {

    const setModal = useContext(ModalContext);

    // let text = user_debt >= 0 ? "Borrowed" : "Paid";
    // let color = user_debt >= 0 ? { color: globals.COLOR_ORANGE } : { color: globals.COLOR_BLUE };
    let pendingItalic = isApproved == 0 ? { fontStyle: 'italic' } : {};

    const viewTransaction = () => {
        setModal(<TransactionInfo id={id} />);
    }

    return (

        <View style={[border ? globals.styles.listItemSeperator : globals.styles.listItem, {cursor:'pointer'}]} onClick={viewTransaction} >

            <Text style={[globals.styles.listText, pendingItalic]}>{name}</Text>
            <Text style={globals.styles.listText}>{date}</Text>

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
    listContainer: {
        height: 'auto',
        marginTop: '2em',
        boxShadow: '0px 0px 5px 5px #eee',
        borderRadius: '1em',
        backgroundColor: globals.COLOR_WHITE
    },
    listTitle: {
        color: globals.COLOR_GRAY,
        fontWeight: 600,
        paddingLeft: '1em',
        paddingBottom: '1.5em'
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
    friendInteractionButton: {
        width: '15em',
        margin: 0,
        marginTop: '.25em'
    }
});
