import * as globals from '../utils/globals.js'

import { StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import Button from './Button.js';

import ApproveSvg   from '../assets/images/bx-check.svg';
import DenySvg      from '../assets/images/bx-x.svg';
import DetailsSvg   from '../assets/images/bx-detail.svg';
import UpChevron    from '../assets/images/bx-chevron-up.svg';
import DownChevron  from '../assets/images/bx-chevron-down.svg';

export default function Notifications(props) {
    const [friendRequests, setFriendRequests] = useState(null);
    const [transactionApprovals, setTransactionApprovals] = useState(null);
    const [completedTransactions, setCompletedTransactions] = useState(null);

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request groups and construct the list
        async function getItems() {

            setFriendRequests(await getNotifications("friend_request"));
            setTransactionApprovals(await getNotifications("transaction_approval"));
            setCompletedTransactions(await getNotifications("complete_transaction"));
        }
        getItems();

    }, []);


    return (
        <View style={[styles.notifShelf, props.show ? { width: '20vw', borderLeftStyle: 'solid' } : { width: '0vh' }]}>
            <View style={[props.show ? { width: '18vw', display: "block" } : { width: '0', display: "none"}]}>
                <Section name='Friend Requests'>
                    {friendRequests}
                </Section>
                
                <Section name='Pending Transactions'>
                    {transactionApprovals}
                </Section>

                <Section name="Compeleted Transactions">
                    {completedTransactions}
                </Section>
                
            </View>
            
        </View>
    );
}
function Section(props) {
    const [open, setOpen] = useState(true);

    return (
        <>
            <View style={{ flexDirection: 'row' } }>
                <Text style={[globals.styles.h2, { paddingLeft: 0, color: globals.COLOR_GRAY }]} onClick={() => setOpen(!open)}>{props.name}</Text>
                <Button style={[styles.sectionButton, {transition: '500ms', transform: (open ? 'rotate(180deg)' : ''), backgroundColor: globals.COLOR_WHITE }]} svg={DownChevron} iconStyle={{ width : '100%', fill: globals.COLOR_GRAY }} hoverStyle={{ borderRadius: '50%' }} onClick={() => setOpen(!open)} />
            </View>
            <View style={[styles.notifSection, open ? { maxHeight: '75vh' } : { maxHeight: 0, overflowY: 'hidden' }]}>
                {props.children}
            </View>
        </>
    
    );
}


function FriendRequest(props) {
    return (
        <View style={styles.notification}>
            
            <View style={{flex: 1}}>
                <Text style={styles.text}>New Pending Friend Request {props.date}</Text>
                <View style={{ flexDirection: 'columnn', justifyContent: 'center' }}>
                    <Text style={styles.notificationText}>{props.name} sent you a friend request</Text>
                </View>
                
            </View>
            <View style={styles.buttonContainer}>

                <Button style={[styles.button, { backgroundColor: globals.COLOR_WHITE }]} svg={DetailsSvg} iconStyle={{ fill: globals.COLOR_GRAY }} />
                <Button style={[styles.button, { backgroundColor: globals.COLOR_WHITE }]} svg={ApproveSvg} iconStyle={{ fill: globals.COLOR_BLUE, width: '2em' }} />
                <Button style={[styles.button, { backgroundColor: globals.COLOR_WHITE }]} svg={DenySvg} iconStyle={{ fill: globals.COLOR_ORANGE, width: '2em' }} />
            </View>
                      
        </View>
        
    );
}

function ApproveTransaction(props) {

    return (
        <View style={styles.notification}>
            
            <View style={{flex: 1}}>
                <Text style={styles.text}>New Pending Transaction {props.date}</Text>
                <View style={{ flexDirection: 'columnn', justifyContent: 'center' }}>
                    <Text style={styles.notificationText}>{props.name}</Text>
                </View>
                
            </View>
            <View style={styles.buttonContainer}>

                <Button style={[styles.button, { backgroundColor: globals.COLOR_WHITE }]} svg={DetailsSvg} iconStyle={{ fill: globals.COLOR_GRAY }} />
                <Button style={[styles.button, { backgroundColor: globals.COLOR_WHITE }]} svg={ApproveSvg} iconStyle={{ fill: globals.COLOR_BLUE, width: '2em' }} />
                <Button style={[styles.button, { backgroundColor: globals.COLOR_WHITE }]} svg={DenySvg} iconStyle={{ fill: globals.COLOR_ORANGE, width: '2em' }} />
            </View>
                      
        </View>
        
    );
}

function CompletedTransaction(props) {

    return (
        <View style={styles.notification}>
            
            <View style={{flex: 1}}>
                <Text style={styles.text}>New Completed Transaction {props.date}</Text>
                <View style={{ flexDirection: 'columnn', justifyContent: 'center' }}>
                    <Text style={styles.notificationText}>{props.name}</Text>
                </View>
                
            </View>
            <View style={styles.buttonContainer}>

                <Button style={[styles.button, { backgroundColor: globals.COLOR_WHITE }]} svg={DetailsSvg} iconStyle={{ fill: globals.COLOR_GRAY }} />
            </View>
                      
        </View>
        
    );
}

async function getNotifications(type){

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
                    switch (type) {
                        case "friend_request":
                            for (let i = 0; i < json.length; i++) {
                                notifications.push(<FriendRequest name={json[i].username} />)
                            }
                            break;
                        case "transaction_approval":
                            for (let i = 0; i < json.length; i++) {
                                notifications.push(<ApproveTransaction name={json[i].name} />)
                            }
                            break;
                        case "complete_transaction":

                            for (let i = 0; i < json.length; i++) {
                                notifications.push(<CompletedTransaction name={json[i].name} />)
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



const styles = StyleSheet.create({
    notifShelf: {
        overflowX: 'hidden',
        alignItems: 'center',
        zIndex: 2,
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

});
