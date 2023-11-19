import * as globals from "../utils/globals.js";

import { Text, View, Image } from '../utils/globals.js';
import { useState, useEffect, useContext } from 'react';

import { Link, useNavigate } from "react-router-dom";

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
import SVGIcon from "./SVGIcon.js";


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

    const { pushModal, popModal } = useContext(ModalContext);
    const { reRenderCount, currUserID } = useContext(GlobalContext);
    const navigate = useNavigate();


    function unfriend() {
        pushModal(<VerifyAction label={"Are you sure you want to unfriend " + username + " ?"} accept={() => {
            removeFriend(username);
            setIsFriend(false);
            popModal();
            navigate("/friends");
            navigate(0)
        }} />);
    }
    function verifyAddFriend() {
        pushModal(<VerifyAction label={"Are you sure you want to add " + username + " as a friend?"} accept={() => {
            addFriend(username);
            setIsPendingFriend(true);
            popModal();
            navigate("/friends");
            navigate(0)
        }} />);
    }
    function verifyAcceptRejectFriend(acceptNReject) {
        pushModal(<VerifyAction label={"Are you sure you want to " + (acceptNReject ? "accept" : "reject") + " friend request from " + username + "?"} accept={() => {
            acceptRejectFriendRequest(friendRequestNotificationID, acceptNReject);
            setIsPendingFriend(false);
            setIsFriend(acceptNReject);
            popModal();
            navigate("/friends");
            navigate(0)
        }} />);
    }
    function verifyCancelFriendRequest() {
        pushModal(<VerifyAction label={"Are you sure you want to revoke your friend request to " + username + "?"} accept={() => {
            cancelFriendRequest(friendRequestNotificationID);
            setIsPendingFriend(false);
            popModal();
            navigate("/friends");
            navigate(0)
        }} />);
    }


    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {
            let json = null;

            if (props.id != null && props.id != currUserID) {
                json = await getUserInfo(props.id);
                if (!json) navigate("/profile_error", { replace: true })
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
        pushModal(<NewExpense profile={true} />);
    }

    let text = debt < 0 ? "Owes You" : "You Owe";
    let color = debt < 0 ? { color: globals.COLOR_BLUE } : { color: globals.COLOR_ORANGE };
    color = debt == 0 ? { color: globals.COLOR_GRAY } : color;

    return (
        <View style={{ flexDirection: 'row', height: '100%', flex: 1}}>
            <View style={styles.groupInfo} >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: '100%', width: 'auto'}}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            style={{ ...globals.styles.listIcon, ...{ width: '3em', height: '3em' }}}
                            source={iconPath !== null ? decodeURI(iconPath) : globals.getDefaultUserIcon(username)}
                        />
                        <Text style={{ ...globals.styles.h1, ...styles.groupName}}>{username}</Text>
                        
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
                <View style={globals.styles.listContainer}>
                    <Text style={globals.styles.listTitle}>Email</Text>
                    <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600', paddingBottom: '1.5em' }}>{email}</Text>                    
                </View>

                <View style={globals.styles.listContainer}>
                    <Text style={globals.styles.listTitle}>Groups in Common</Text>
                   
                    <View style={{ ...globals.styles.list, ...{ gridTemplateColumns : '100%', marginTop: '.25em', width: '100%', marginBottom: '1em' } }}>
                        <Text style={globals.styles.smallListHeader}>GROUP NAME</Text>
                        {groups}
                    </View>
                </View>

                <View style={globals.styles.listContainer}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={globals.styles.listTitle}>Transactions in Common</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 'auto', paddingRight: '.5em', margin: 'auto 0', minWidth: '5em', alignItems: 'center' }}>
                                <Text style={{ ...globals.styles.listText, ...{ fontSize: '.66em' }, ...color}}>{text}</Text>
                                <Text style={{ ...globals.styles.listText, ...color}}>${Math.abs(debt / 100).toFixed(2)}</Text>
                            </View>
                            <Button id="profile_newExpense" style={{ ...globals.styles.formButton, ...{ width: '10em', margin: '.45em .75em 0' } }} onClick={addExpense} >
                                <label htmlFor="profile_newExpense" style={globals.styles.buttonLabel}>
                                    + NEW EXPENSE
                                </label>
                            </Button>
                        </View>
                    </View>
                    
                    <View style={{ ...globals.styles.list, ...{ marginTop: '.25em', width: '100%', marginBottom: '1em' } }}>
                        <Text style={globals.styles.smallListHeader}>TRANSACTION</Text>
                        <Text style={{ ...globals.styles.smallListHeader, ...{ alignItems: 'flex-end' } }}>DATE</Text>
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
        return (
            <Button
                    id="friend_unfriend"
                    style={{ ...globals.styles.formButton, ...{ width: '15em', margin: '.25em 0 0 0' }}}
                    onClick={onUnfriend}>

                    <SVGIcon src={UnfriendIcon} style={styles.icon} />
                    <label htmlFor="friend_unfriend" style={globals.styles.buttonLabel}>
                        UNFRIEND
                    </label>

            </Button>

          );
    }
    else if (isPendingFriend) {
        // pending friend request
        if (friendRequestCanApprove) {
            // friend request has been sent to this user, options are to accept to reject request
            return (
                <>
                    <Button
                        id="friend_rejectRequest"
                        style={{ ...globals.styles.formButton, ...styles.friendInteractionButton }}
                        onClick={() => unAcceptRejectFriend(false)}>

                        <SVGIcon src={DenySvg} style={styles.icon} />
                        <label htmlFor="friend_rejectRequest" style={globals.styles.buttonLabel}>
                           REJECT FRIEND REQUEST
                        </label>

                    </Button>
                    <Button
                        id="friend_acceptRequest"
                        style={{ ...globals.styles.formButton, ...styles.friendInteractionButton }}
                        onClick={() => unAcceptRejectFriend(true)}>

                        <SVGIcon src={ApproveSvg} style={styles.icon} />
                        <label htmlFor="friend_acceptRequest" style={globals.styles.buttonLabel}>
                            ACCEPT FRIEND REQUEST
                        </label>
                    </Button>
                </>
            );
        }
        else {
            // friend request was sent by the current user, option is to cancel it
            return (
                <Button
                    id="friend_cancelRequest"
                    style={{ ...globals.styles.formButton, ...styles.friendInteractionButton }}
                    onClick={onCancelFriend}>

                    <SVGIcon src={DenySvg} style={styles.icon} />
                    <label htmlFor="friend_cancelRequest" style={globals.styles.buttonLabel}>
                        CANCEL FRIEND REQUEST
                    </label>

                </Button>
            );
               
        }
    }
    else {
        // no pending friend request, only option is to send friend request
         return (
            <Button
                id="friend_add"
                style={{ ...globals.styles.formButton, ...styles.friendInteractionButton }}
                onClick={onAddFriend}>
                <SVGIcon src={AddFriendSvg} style={styles.icon} />
                <label htmlFor="friend_add" style={globals.styles.buttonLabel}>
                    ADD FRIEND
                </label>
            </Button>
         );
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

function GroupListItem({ id, name, icon_path }) {
    return (

        <Link to={'/groups/' + id} style={globals.styles.listItemRow}>
            
            <Image
                style={{ ...globals.styles.listIcon, ...{ marginLeft: '.75em', width: '2.5em', height: '2.5em'}}}
                source={icon_path !== null ? decodeURI(icon_path) : globals.getDefaultGroupIcon(name)}
            />
            <Text style={{ ...globals.styles.listText, ...{paddingLeft: '.25em'}}}>{name}</Text>
            
        </Link>

    );
}

function TransactionListItem({ id, name, date, user_debt, isApproved }) {

    const { pushModal, popModal } = useContext(ModalContext);

    // let text = user_debt >= 0 ? "Borrowed" : "Paid";
    // let color = user_debt >= 0 ? { color: globals.COLOR_ORANGE } : { color: globals.COLOR_BLUE };
    let pendingItalic = isApproved == 0 ? { fontStyle: 'italic' } : {};

    const viewTransaction = () => {
        pushModal(<TransactionInfo id={id} />);
    }

    return (

      <>
            <Text
                style={{ ...globals.styles.listItemRow, ...globals.styles.listText, ...pendingItalic, ...{ cursor: 'pointer', minHeight: '2.5em' } }}
                onClick={viewTransaction}>
                {name}
            </Text>
            <Text
                style={{ ...globals.styles.listItemRow, ...globals.styles.listText, ...{ cursor: 'pointer', justifyContent: 'flex-end' } }}
                onClick={viewTransaction}>
                {date}
            </Text>
      
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
        margin: `1em min(5em, 5vw)`,
        padding: '2.5em min(2.5em, 2.5vw)',
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

};
