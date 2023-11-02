import * as globals from '../utils/globals.js'

import { StyleSheet, View } from 'react-native';
import { useState } from 'react';

import Header from './Header.js';
import Footer from './Footer.js';
import Notifications from './Notifications.js';

import { ModalContext } from '../modals/ModalContext.js';

export default function Base(props) {

    const [showShelf, setShowShelf] = useState(false);

    const [modal, setModal] = useState(null);


    return (
        <ModalContext.Provider value={setModal}>
            <View style={styles.base}>
                <Header showNotif={() => setShowShelf(!showShelf)} />

                <View style={[{ flex: 1, flexWrap: 'nowrap', flexDirection: 'column' }]}>

                    <View style={[props.style, { flexDirection: 'row', width: '100%', flex: 1 }]}>
                        <View style={[styles.container]}>
                            {props.children}
                        </View>

                        <Notifications show={showShelf} />
                    </View>

                    <Footer />

                </View>

            </View>\
            {modal}
        </ModalContext.Provider>
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
