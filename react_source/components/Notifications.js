import * as globals from '../utils/globals.js'

import { StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import Button from './Button.js';

import ApproveSvg   from '../assets/images/bx-check.svg';
import DenySvg      from '../assets/images/bx-x.svg';
import DetailsSvg   from '../assets/images/bx-detail.svg';
import UpChevron    from '../assets/images/bx-chevron-up.svg';
import DownChevron  from '../assets/images/bx-chevron-down.svg';

export default function Notifications(props) {

    return (
        <View style={[styles.notifShelf, props.show ? { width: '20vw', borderLeftStyle: 'solid' } : { width: '0vh' }]}>
            <View style={[props.show ? { width: '18vw', display: "block" } : { width: '0', display: "none"}]}>
                <Section name='Friend Requests'>
                    <FriendRequest name="Friend Request One" date={"1/2/23"}></FriendRequest>
                </Section>
                
                <Section name='Pending Transactions'>
                    <ApproveTransaction name="Transaction One" date={"1/2/23"}></ApproveTransaction>
                    <ApproveTransaction name="Transaction Two Hopefully this is long enough to overflow" date={"3/2/23"}></ApproveTransaction>
                    <ApproveTransaction name="Transaction Three Hopefully this is long enough to overflow im going to make it even longer to show more text" date={"6/2/23"}></ApproveTransaction>
                </Section>

                <Section name="Compeleted Transactions">
                    <CompletedTransaction name="Transaction Four" date={"1/2/23"}></CompletedTransaction>
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

async function getNotification(user_id, type){


    let payload = new URLSearchParams();
    payload.append('user_id', user_id);
    payload.append('notification_type', type);

    // do the POST request
    try {
        let response = await fetch("/notifications.php", { method: 'GET', body: payload, credentials: 'same-origin' });

        if (response.ok) {
           
        }
        else {

        }
    }
    catch (error) {
        console.log("error in in GET request to notifications (/notifications.php)");
        console.log(error);
    }
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
