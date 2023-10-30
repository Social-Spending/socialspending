import * as globals from '../utils/globals.js'

import { StyleSheet, View } from 'react-native';
import { useState } from 'react';

import Header from './Header.js';
import Footer from './Footer.js';
import { getCookieValue } from "./Utils.js";
import Notifications from "./Notifications.js";

export default function Base(props) {

    const [showShelf, setShowShelf] = useState(false);

    //Check if user is logged in a display correct header
    let loggedIn = (getCookieValue("session_id") !== "");

    return (
        <View style={styles.base}>
            <Header loggedIn={loggedIn} showNotif={() => setShowShelf(!showShelf)} />

            <View style={[props.style, { flexWrap: 'nowrap' }]}>

                <View style={[styles.container]}>
                    {props.children}
                </View>

                    <View style={[styles.notifShelf, showShelf ? {width: '20vw', /*visibility: "visible",*/ display: "block"} : {width: '0vh', /*visibility: "hidden",*/ display: "none"}]}>
                        <Notifications />
                    </View>
                </View>

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
