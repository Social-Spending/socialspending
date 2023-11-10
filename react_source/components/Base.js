import * as globals from '../utils/globals.js'

import { View } from '../utils/globals.js';
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

                <View style={{ width: 'auto', minWidth:'100%', flexDirection: 'column', flex: 1 }}>

                    <View style={{ ...props.style, ...{ flexDirection: 'row', width: '100%', flex: 1 }}}>
                        <View style={styles.container}>
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

const styles = {
    base: {
        flex: 1,
        width: 'max-content',
        minWidth: '100%',
        height: 'auto',
        minHeight: '100%',
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

    }

};
