
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

import Header from './Header.js';
import Footer from './Footer.js';
import { getCookieValue } from "./Utils.js";

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

                <View style={[styles.notifShelf, showShelf ? { width: '20vw' } : { width: '0vh' },]}>

                </View>

            </View>

            <Footer />
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
        width: '100%',
        height: 'auto',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',

    },
    notifShelf: {
        backgroundColor: '#555',
        height: '100%',
        transition: '500ms'


    }

});
