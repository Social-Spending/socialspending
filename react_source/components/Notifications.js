import * as globals from '../utils/globals.js'

import { View, Text } from '../utils/globals.js';
import { useState, useEffect, createContext, useContext } from 'react';
import Button from './Button.js';

import { acceptRejectFriendRequest } from '../utils/friends.js';

import ApproveSvg   from '../assets/images/bx-check.svg';
import DenySvg      from '../assets/images/bx-x.svg';
import DetailsSvg   from '../assets/images/bx-detail.svg';
import UpChevron    from '../assets/images/bx-chevron-up.svg';
import DownChevron from '../assets/images/bx-chevron-down.svg';
import { ModalContext } from '../modals/ModalContext.js';
import TransactionInfo from '../modals/TransactionInfo.js';
import VerifyAction from '../modals/VerifyAction.js';
import WaitForAuth from './WaitForAuth.js';
import { GlobalContext } from './GlobalContext.js';
import { useNavigate } from 'react-router-dom/dist/index.js';
import SVGIcon from './SVGIcon.js';

const NotificationContext = createContext(null);

let navigate = 0;
export default function Notifications(props) {
    const [friendRequests, setFriendRequests] = useState([]);
    const [transactionApprovals, setTransactionApprovals] = useState([]);
    const [completedTransactions, setCompletedTransactions] = useState([]);
    const [groupInvites, setGroupInvites] = useState([]);

    let [notifCount, setNotifCount] = useState(0);

    // get global context var to refresh when page reload is requested
    const {reRenderCount} = useContext(GlobalContext);

    navigate = useNavigate();

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list

        function addNotifCount(amount) {
            notifCount = notifCount + amount
            setNotifCount(notifCount);
        }
        async function getItems() {
            
            setFriendRequests(await getNotifications("friend_request", addNotifCount));
            setTransactionApprovals(await getNotifications("transaction_approval", addNotifCount));
            setCompletedTransactions(await getNotifications("complete_transaction", addNotifCount));
            setGroupInvites(await getNotifications("group_invite", addNotifCount));

            // if the page requested that we show notification bar by default, do so only if there are also notifications present
            props.setAreNotifs(notifCount);
        }
        getItems(); 

    }, [reRenderCount]);

    const removeNotif = (type, id) => {
        switch (type) {
            case "friend_request":

                setFriendRequests(friendRequests.filter((notif) => notif.props.id != id));   
                setNotifCount(notifCount - 1);
                break;
            case "transaction_approval":

                setTransactionApprovals(transactionApprovals.filter((notif) => notif.props.id != id));
                setNotifCount(notifCount - 1);
                break;
            case "complete_transaction":

                setCompletedTransactions(completedTransactions.filter((notif) => notif.props.id != id));
                setNotifCount(notifCount - 1);
                break;
            case "group_invite":

                setGroupInvites(groupInvites.filter((notif) => notif.props.id != id));
                setNotifCount(notifCount - 1);
                break;
            default:
                break;
        }
    }

    
   


    return (
        <NotificationContext.Provider value={{removeNotif:removeNotif}}>
            <View style={{ ...styles.notifShelf, ...props.show ? { width: '20vw', minWidth: '16em', borderStyle: 'none none none solid' } : { width: '0vh' }}}>
               
                <View style={{ ...props.show ? { width: '18vw', minWidth: '14.4em', display: "block" } : { width: '0', display: "none" }}}>
                    <Section name="Group Invites">
                        {groupInvites}
                    </Section>

                    <Section name='Friend Requests'>
                        {friendRequests}
                    </Section>
                
                    <Section name='Pending Transactions'>
                        {transactionApprovals}
                    </Section>

                    <Section name="Completed Transactions">
                        {completedTransactions}
                    </Section>

                        
                </View>
            
            </View>
        </NotificationContext.Provider>
    );
}
function Section(props) {
    const [open, setOpen] = useState(true);
    // use isNEmpty to conditionally render the down chevron only if there are actually things to expand
    let isNEmpty = props.children.length > 0;

    return (
        <>
            <View style={{ flexDirection: 'row' } }>
                <Text style={{ ...globals.styles.h2, ...{ paddingLeft: 0, color: globals.COLOR_GRAY }}} onClick={() => setOpen(!open)}>{props.name}</Text>
                {isNEmpty &&
                    (
                    <Button aria-label={open ? "Hide" : "Open"} style={{ ...styles.sectionButton, ...{ backgroundColor: globals.COLOR_WHITE }}} hoverStyle={{ borderRadius: '50%' }} onClick={() => setOpen(!open)}>
                        <SVGIcon src={DownChevron} style={{ width: '100%', fill: globals.COLOR_GRAY, transition: '500ms', transform: (open ? 'rotate(180deg)' : '') }} />
                    </Button>
                    )
                }
            </View>
            <View style={{ ...styles.notifSection, ...open ? { maxHeight: '75vh' } : { maxHeight: 0, overflowY: 'hidden' }}}>
                {props.children}
            </View>
        </>
    
    );
}


function FriendRequest(props) {

    const {removeNotif} = useContext(NotificationContext);
    const {reRender} = useContext(GlobalContext);
    const setModal = useContext(ModalContext);

    const approve = (accept) => {
        setModal(<VerifyAction label={"Are you sure you want to " + (accept ? "accept " : "reject ") + props.name + "'s friend request?"} accept={() => { approveFriendRequest(props.id, accept, removeNotif, reRender); setModal(null); } } reject={() => setModal(null)} exit={() => setModal(null)} />);
    }

    return (
        <View style={styles.notification}>
            
            <View style={{flex: 1}}>
                <Text style={styles.text}>New Pending Friend Request {props.date}</Text>
                <View style={{ flexDirection: 'columnn', justifyContent: 'center' }}>
                    <Text style={styles.notificationText}>{props.name} sent you a friend request</Text>
                </View>
                
            </View>
            <View style={styles.buttonContainer}>
                <Button style={{ ...styles.button, ...{ backgroundColor: globals.COLOR_WHITE } }} onClick={() => navigate("/profile/" + props.user_id)} >
                    <SVGIcon src={DetailsSvg} style={ {fill: globals.COLOR_GRAY, width: '1.5em' }}/>
                </Button>
                <Button style={{ ...styles.button, ...{ backgroundColor: globals.COLOR_WHITE } }} onClick={() => approve(true)} >
                    <SVGIcon src={ApproveSvg} style={{ fill: globals.COLOR_BLUE, width: '2em' }} />
                </Button>
                <Button style={{ ...styles.button, ...{ backgroundColor: globals.COLOR_WHITE } }} onClick={() => approve(false)} >
                    <SVGIcon src={DenySvg} style={{ fill: globals.COLOR_ORANGE, width: '2em' }} />
                </Button>
            </View>
                      
        </View>
        
    );
}

function ApproveTransaction(props) {
    const {removeNotif} = useContext(NotificationContext);
    const {reRender} = useContext(GlobalContext);
    const setModal = useContext(ModalContext);

    const viewTransaction = () => {
        setModal(<TransactionInfo id={props.trans_id} exit={() => setModal(null)} />);
    }

    const approve = (accept) => {
        setModal(<VerifyAction label={"Are you sure you want to " + (accept ? "approve " : "reject ") + props.name + "?"} accept={() => { approveTransaction(props.trans_id, props.id, accept, removeNotif, reRender); setModal(null); }} reject={() => setModal(null)} exit={() => setModal(null)} />);
    }

    return (
        <View style={styles.notification}>
            
            <View style={{flex: 1}}>
                <Text style={styles.text}>New Pending Transaction {props.date}</Text>
                <View style={{ flexDirection: 'columnn', justifyContent: 'center' }}>
                    <Text style={styles.notificationText}>{props.name}</Text>
                </View>
                
            </View>
            <View style={styles.buttonContainer}>

                <Button style={{ ...styles.button, ...{ backgroundColor: globals.COLOR_WHITE } }} onClick={viewTransaction} >
                    <SVGIcon src={DetailsSvg} style={{ fill: globals.COLOR_GRAY, width: '1.5em' }} />
                </Button>
                <Button style={{ ...styles.button, ...{ backgroundColor: globals.COLOR_WHITE } }} onClick={() => approve(true)} >
                    <SVGIcon src={ApproveSvg} style={{ fill: globals.COLOR_BLUE, width: '2em' }} />
                </Button>
                <Button style={{ ...styles.button, ...{ backgroundColor: globals.COLOR_WHITE } }} onClick={() => approve(false)} >
                    <SVGIcon src={DenySvg} style={{ fill: globals.COLOR_ORANGE, width: '2em' }} />
                </Button>

                
            </View>
                      
        </View>
        
    );
}

function CompletedTransaction(props) {
    const {removeNotif} = useContext(NotificationContext);
    const setModal = useContext(ModalContext);

    const viewTransaction = () => {
        setModal(<TransactionInfo id={props.trans_id} exit={() => setModal(null)} />);
    }

    return (
        <View style={styles.notification}>
            
            <View style={{flex: 1}}>
                <Text style={styles.text}>New Completed Transaction {props.date}</Text>
                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <Text style={styles.notificationText}>{props.name}</Text>
                </View>
                
            </View>
            <View style={styles.buttonContainer}>

                <Button style={{ ...styles.button, ...{ backgroundColor: globals.COLOR_WHITE } }} onClick={viewTransaction} >
                    <SVGIcon src={DetailsSvg} style={{ fill: globals.COLOR_GRAY, width: '1.5em' }} />
                </Button>
            
                <Button style={{ ...styles.button, ...{ backgroundColor: globals.COLOR_WHITE } }} onClick={() => dismissCompletedTransaction(props.id, removeNotif)} >
                    <SVGIcon src={DenySvg} style={{ fill: globals.COLOR_ORANGE, width: '2em' }} />
                </Button>

            </View>
                      
        </View>
        
    );
}

/* properties:  name is group name
                id is notification id
                group_id is group id
*/
function GroupInvite(props) {
    const {removeNotif} = useContext(NotificationContext);
    const {reRender} = useContext(GlobalContext);
    const setModal = useContext(ModalContext);


    const approve = (accept) => {
        setModal(<VerifyAction label={"Are you sure you want to " + (accept ? "join " : "ignore invite to ") + props.name + "?"} accept={() => { approveGroupInvite(props.id, accept, removeNotif, reRender); setModal(null); }} reject={() => setModal(null)} exit={() => setModal(null)} />);
    }

    return (
        <View style={styles.notification}>

            <View style={{flex: 1}}>
                <Text style={styles.text}>New Group Invite</Text>
                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <Text style={styles.notificationText}>{props.name}</Text>
                </View>

            </View>
            <View style={styles.buttonContainer}>

                <Button style={{ ...styles.button, ...{ backgroundColor: globals.COLOR_WHITE } }} onClick={() => navigate("/groups/" + props.group_id)} >
                    <SVGIcon src={DetailsSvg} style={{ fill: globals.COLOR_GRAY, width: '1.5em' }} />
                </Button>
                <Button style={{ ...styles.button, ...{ backgroundColor: globals.COLOR_WHITE } }} onClick={() => approve(true)} >
                    <SVGIcon src={ApproveSvg} style={{ fill: globals.COLOR_BLUE, width: '2em' }} />
                </Button>
                <Button style={{ ...styles.button, ...{ backgroundColor: globals.COLOR_WHITE } }} onClick={() => approve(false)} >
                    <SVGIcon src={DenySvg} style={{ fill: globals.COLOR_ORANGE, width: '2em' }} />
                </Button>
               
            </View>

        </View>

    );
}

async function approveFriendRequest(id, approved, removeNotif, reRender) {
    let response = await acceptRejectFriendRequest(id, approved);
    if (response === 0) {
        // success
        removeNotif('friend_request', id);
        // call function to refresh the Base component with new friend
        reRender();
    }
    else {
        // otherwise, error
        console.log(response);
    }
}


async function approveTransaction(trans_id, id, approved, removeNotif, reRender) {

    let payload = `{
        "transaction_id": ` + trans_id + `
    }`;

    if (approved) {
        try {
            let response = await fetch("/transaction_approval.php", { method: 'PUT', body: payload, credentials: 'same-origin' });

            if (response.ok) {
                removeNotif('transaction_approval', id);
                // call function to refresh the Base component with new friend
                reRender();
            } else {

            }
        }
        catch (error) {
            console.error("error in PUT request to transaction_approval (/transaction_approval.php)");
            console.error(error);
        }
    } else {
        try {
            let response = await fetch("/transactions.php", { method: 'DELETE', body: payload, credentials: 'same-origin' });

            if (response.ok) {
                removeNotif('transaction_approval', id);
                // call function to refresh the Base component with new friend
                reRender();
            } else {

            }
        }
        catch (error) {
            console.error("error in DELETE request to transactions (/transactions.php)");
            console.error(error);
        }
    }
}

async function approveGroupInvite(notification_id, accept, removeNotif, reRender) {
    // 'operation' values are defined by groups.php backend api
    let payload = {
        'notification_id': notification_id,
        'operation': accept ? 'accept_invitation' : 'reject_invitation'
    };

    // do the POST request
    try {
        let response = await fetch("/groups.php", {
            method: 'POST',
            body: JSON.stringify(payload),
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (await response.ok) {
            // remove notification and re-render the group page
            removeNotif('group_invite', notification_id);
            reRender();
        }
        else {
            // failed, display error message returned by server
            console.log("Error while accepting/rejecting group invite");
            console.log(error);
        }
    }
    catch (error) {
        console.log("error in accept_invitation/reject_invitation operation (POST request) to /groups.php");
        console.log(error);
    }
}

async function dismissCompletedTransaction(id, removeNotif) {
    let payload = {
        'notification_id': id,
        'operation': 'dismiss'
    };

    // do the POST request
    try {
        let response = await fetch("/notifications.php", {
            method: 'POST',
            body: JSON.stringify(payload),
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (await response.ok) {
            // remove notification and re-render the group page
            removeNotif("complete_transaction", id)
        }
        else {
            // failed, display error message returned by server
            console.log("Error while dismissing completed transaction");
        }
    }
    catch (error) {
        console.log("error in POST request to /notifications.php");
        console.log(error);
    }
}

async function getNotifications(type, addNotifCount){

    let notifications = [];

    let payload = new URLSearchParams();
    payload.append('type', type);

    // do the POST request
    try {
        let response = await fetch("/notifications.php?" + payload, { method: 'GET', credentials: 'same-origin' });

        if (response.ok) {
            try {
                let json = await response.json();
                if (json !== null) {

                    addNotifCount(json.length);
                    switch (type) {
                        case "friend_request":
                            for (let i = 0; i < json.length; i++) {
                                notifications.push(<FriendRequest key={i} name={json[i].username} id={json[i].notification_id} user_id={json[i].friend_id} />)
                            }
                            break;
                        case "transaction_approval":
                            for (let i = 0; i < json.length; i++) {
                                notifications.push(<ApproveTransaction key={i} name={json[i].name} id={json[i].notification_id} trans_id={json[i].transaction_id} />)
                            }
                            break;
                        case "complete_transaction":

                            for (let i = 0; i < json.length; i++) {
                                notifications.push(<CompletedTransaction key={i} name={json[i].name} id={json[i].notification_id} trans_id={json[i].transaction_id} />)
                            }
                            break;
                        case "group_invite":

                            for (let i = 0; i < json.length; i++) {
                                notifications.push(<GroupInvite key={i} name={json[i].group_name} id={json[i].notification_id} group_id={json[i].group_id} />)
                            }

                            break;
                        default:
                            console.error("error in GET request to notifications (/notifications.php)");
                            console.error("Unrecognized notification type");
                            break;
                    }
                }
                
            } catch (error) {
				console.error("error in GET request to notifications (/notifications.php)");
				console.error("No JSON returned");
			}
        }
    }
    catch (error) {
        console.error("error in GET request to notifications (/notifications.php)");
        console.error(error);
    }
    return notifications;
}



const styles = {
    notifShelf: {
        overflowX: 'hidden',
        alignItems: 'center',
        backgroundColor: globals.COLOR_WHITE,
        height: '100%',
        transition: '500ms',
        borderWidth: 1,
        borderStyle: 'none',
    },
    notifSection: {
        transition: '500ms',
        overflowY: 'auto',
        scrollbarWidth: 'thin'
    },
    notification: {
        backgroundColor: globals.COLOR_WHITE,
        alignItems: 'left',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: '.5em',
        marginBottom: '.5em',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    button: {
        width: '2em',
        height: '2em',
        fontSize: '1em',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: globals.COLOR_BLUE,
    },
    sectionButton: {
        width: '2em',
        height: '2em',
        fontSize: '1em',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '1.25em'
    },
    notificationText: {
        fontSize: '1em',
        paddingTop: 0,
        paddingLeft: '.2em',
        paddingRight: '.2em',
        paddingBottom: '.5em',
        color: globals.COLOR_GRAY
    },
    text: {
        fontSize: '.75em',
        paddingTop: '.5em',
        paddingLeft: '.2em',
        paddingRight: '.2em',
        fontWeight: 'bold',
        color: globals.COLOR_GRAY
    },

};
