import * as globals from '../utils/globals.js'

import { StyleSheet, View } from 'react-native';
import { useState } from 'react';

import Header from './Header.js';
import Footer from './Footer.js';
import { getCookieValue } from './Utils.js';
import Notifications from './Notifications.js';

import { ModalContext } from '../modals/ModalContext.js';

export default function Base(props) {

    const [showShelf, setShowShelf] = useState(false);

    const [modal, setModal] = useState(null);
    // state variables for information about the current user
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currUserID, setCurrUserID] = useState(0);
    const [currUsername, setCurrUsername] = useState('username');

    // Check if user is logged in and if they are get their username
    // may need to await this promise if the values are needed to render the current modal
    //  ie. if the 'summary' page will redirect when isLoggedIn==false, we must wait for this...
    //      fetch to complete before we can determine if the user is indeed logged in
    let getUserInfoPromise = getUserInfo(setIsLoggedIn, setCurrUserID, setCurrUsername);


    return (
        <ModalContext.Provider value={setModal}>
            <View style={styles.base}>
                <Header loggedIn={isLoggedIn}
                        currUsername={currUsername}
                        showNotif={() => setShowShelf(!showShelf)}
                        doSignout={() => doSignout(setIsLoggedIn, setCurrUserID, setCurrUsername)} />

                <View style={[{ flex: 1, flexWrap: 'nowrap', flexDirection: 'column' }]}>
        
                    <View style={[props.style, { flexDirection: 'row', width: '100%', flex: 1 }]}>
                        <View style={[styles.container]}>
                            {props.children}
                        </View>
                
                        <Notifications show={showShelf} />
                    </View>
        
                    <Footer />
        
                </View>
                
            </View>
            {modal}
        </ModalContext.Provider>
    );
}

async function getUserInfo(setIsLoggedIn, setCurrUserID, setCurrUsername) {
    // simple GET request to user info endpoint
    let endpoint = '/user_info.php';
    try {
        let response = await fetch(endpoint, { method: 'GET', credentials: 'same-origin' });

        if (response.ok) {
            // unpack information
            let responseJSON = await response.json();
            setIsLoggedIn(true);
            setCurrUserID(responseJSON['user_id']);
            setCurrUsername(responseJSON['username']);
        }
        // else if (response.status == 401)
        // {
        //     // user is not logged in, redirect them
        //     // don't do this, because the current modal could be the login page
        //     router.push("/login");
        // }
    }
    catch (error) {
        console.log('error in in GET request to ' + endpoint);
        console.log(error);
    }
}

async function doSignout(setIsLoggedIn, setCurrUserID, setCurrUsername) {
    // simple GET request to signout endpoint
    let endpoint = '/signout.php';
    try {
        let response = await fetch(endpoint, { method: 'GET', credentials: 'same-origin' });

        if (response.ok) {
            // clear state variables about the current user
            setIsLoggedIn(false);
            setCurrUserID(0);
            setCurrUsername('');
            // redirect to login page
            router.push("/login");
        }
        else {
            // failed, display error message returned by server
            let responseJSON = await response.json();
            let message = 'Failed to signout: ' + responseJSON['message'];
            alert(message);
        }
    }
    catch (error) {
        console.log('error in in GET request to ' + endpoint);
        console.log(error);
    }
}

const styles = StyleSheet.create({
    base: {
        flex: 1,
        width: '100%',
        height: '100%',
        minHeight : '100vh',
        flexWrap: 'nowrap',

    },
    container: {
        flex: 1,
        height: '100%',
        minHeight: '45em',
        width: '100%',
        flexWrap: 'nowrap',
        flexDirection: 'inherit',
        alignItems: 'inherit',
        justifyContent: 'inherit'

    },
    notifShelf: {
        
        zIndex: 2,
        backgroundColor: '#555',
        height: '100%',
        transition: '500ms'


    }

});
