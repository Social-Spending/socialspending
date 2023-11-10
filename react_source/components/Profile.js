import * as globals from "../utils/globals.js";

import { Text, View, Image } from '../utils/globals.js';
import { useState, useEffect, useContext } from 'react';

import { Link } from "react-router-dom";

import Button from "./Button.js";

import TransactionInfo from "../modals/TransactionInfo.js";
import VerifyAction from "../modals/VerifyAction.js";


import UnfriendIcon from '../assets/images/bx-log-out.svg';

import { getUserInfo, removeFriend, addFriend} from '../utils/friends.js'

import { ModalContext } from '../modals/ModalContext.js';
import { GlobalContext } from "./GlobalContext.js";


export default function Profile(props) {

    let [groups, setGroups] = useState(null);
    let [transactions, setTransactions] = useState(null);
    let [username, setUsername] = useState(null);
    let [email, setEmail] = useState(null);
    let [iconPath, setIconPath] = useState(null);
    let [debt, setDebt] = useState(null);
    let [isFriend, setIsFriend] = useState(false);
    let [isPendingFriend, setIsPendingFriend] = useState(true);

    const setModal = useContext(ModalContext);
    const {reRenderCount, reRender} = useContext(GlobalContext);


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
                setGroups(getGroupList(json.groups));
                setTransactions(getTransactionList(json.transactions));
            }
        }
        getItems();

    }, [props.id, reRenderCount]);
    if (props.id == null || username == null) {
        return (<></>);
    }

    function unfriend() {
        setModal(<VerifyAction label={"Are you sure you want to unfriend " + username + " ?"} accept={() => {removeFriend(username, reRender); setIsFriend(false); setModal(null);}} />);
    }
    function verifyAddFriend() {
        setModal(<VerifyAction label={"Are you sure you want to add " + username + " as a friend?"} accept={() => {addFriend(username); setIsPendingFriend(true); setModal(null);}} />);
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
                            style={{ ...globals.styles.listIcon, ...{ width: '3em', height: '3em' }}}
                            source={iconPath !== null ? decodeURI(iconPath) : globals.getDefaultUserIcon(username)}
                        />
                        <Text style={{ ...globals.styles.h1, ...styles.groupName}}>{username}</Text>
                        
                    </View>
                    {isFriend ? <Button style={{ ...globals.styles.formButton, ...{ width: '15em', margin: 0, marginTop: '.25em' }}} svg={UnfriendIcon} iconStyle={styles.icon} label={'UNFRIEND'} onClick={unfriend} /> : <Button style={{ ...globals.styles.formButton, ...{ width: '15em', margin: 0, marginTop: '.25em' }}} iconStyle={styles.icon} label={isPendingFriend ? 'PENDING' : 'ADD FRIEND'} onClick={verifyAddFriend} disabled={isPendingFriend}/> }
                </View>
                <View style={styles.listContainer}>
                    <Text style={{ ...globals.styles.h3, ...styles.listTitle}}>Email</Text>
                    <View style={styles.listHeader} >

                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600', paddingBottom: '1.5em' }}>{email}</Text>

                    </View>
                </View>

                <View style={styles.listContainer}>
                    <Text style={{ ...globals.styles.h3, ...styles.listTitle}}>Groups in Common</Text>
                    <View style={styles.listHeader} >

                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>GROUP NAME</Text>

                    </View>
                    <View style={{ ...globals.styles.list, ...{ marginTop: '.25em', width: '100%', marginBottom: '1em' }}}>
                        {groups}
                    </View>
                </View>

                <View style={styles.listContainer}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{ ...globals.styles.h3, ...styles.listTitle}}>Transactions in Common</Text>
                        <View style={{ width: 'auto', paddingRight: '.5em', margin: 'auto 0', minWidth: '5em', alignItems: 'center' }}>
                            <Text style={{ ...globals.styles.listText, ...{ fontSize: '.66em' }, ...color}}>{text}</Text>
                            <Text style={{ ...globals.styles.listText, ...color}}>${Math.abs(debt / 100).toFixed(2)}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.listHeader} >

                        <Text style={{ color: globals.COLOR_GRAY, paddingLeft: '2em', fontWeight: '600' }}>TRANSACTION</Text>
                        <Text style={{ color: globals.COLOR_GRAY, paddingRight: '2em' }}>DATE</Text>

                    </View>
                    <View style={{ ...globals.styles.list, ...{ marginTop: '.25em', width: '100%', marginBottom: '1em' }}}>
                        {transactions}
                    </View>

                </View>
            </View>
        </View>
    );
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

        <Link to={'/groups/' + id}>
            <View style={border ? globals.styles.listItemSeperator : globals.styles.listItem} >
                <View style={globals.styles.listIconAndTextContainer}>
                    <Image
                        style={{ ...globals.styles.listIcon, ...{ marginLeft: '.75em', width: '2.5em', height: '2.5em'}}}
                        source={icon_path !== null ? decodeURI(icon_path) : globals.getDefaultGroupIcon(name)}
                    />
                    <Text style={{ ...globals.styles.listText, ...{paddingLeft: '.25em'}}}>{name}</Text>
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

        <View style={{ ...border ? globals.styles.listItemSeperator : globals.styles.listItem, ...{cursor:'pointer'}}} onClick={viewTransaction} >

            <Text style={{ ...globals.styles.listText, ...pendingItalic}}>{name}</Text>
            <Text style={globals.styles.listText}>{date}</Text>

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
        padding: '2.5em min(2.5em, 2.5vw)',
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
        borderStyle: 'none none solid',
        borderWidth: '1px',
        borderColor: '#eee',
        paddingBottom: '.5em'
    },
    icon: {
        fill: globals.COLOR_WHITE,
        width: '1.25em'
    }

};
