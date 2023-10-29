import * as globals from '../utils/globals.js'

import { StyleSheet, View } from 'react-native';
import { useState } from 'react';

import Header from './Header.js';
import Footer from './Footer.js';
import { getCookieValue } from './Utils.js';
import Notifications from './Notifications.js';

export default function Base(props) {

    const [showShelf, setShowShelf] = useState(false);

    //Check if user is logged in a display correct header
    let loggedIn = (getCookieValue("session_id") !== "");

    return (
        <View style={styles.base}>
            <Header loggedIn={loggedIn} showNotif={() => setShowShelf(!showShelf)} />

            <View style={[props.style, { flexWrap: 'nowrap', justifyContent: 'flex-end', flexDirection: 'row' }]}>

                <View style={styles.container}>
                    {props.children}
                </View>

                
                <Notifications show={showShelf} />
                

                <Footer />

            </View>

        </View>
    );
}



const styles = StyleSheet.create({
    base: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexWrap: 'nowrap',

    },
    container: {
        flex: 1,
        top: '-2vh',
        height: 'auto',
        minHeight: '45em',
        width: '100%',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',

    },
    notifShelf: {
        zIndex: 2,
        backgroundColor: '#555',
        height: '100%',
        transition: '500ms'


    }

});
