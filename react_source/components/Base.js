

import { View } from '../utils/globals.js';
import { useState, useEffect } from 'react';

import Header from './Header.js';
import Footer from './Footer.js';
import Notifications from './Notifications.js';

import { ModalContext } from '../modals/ModalContext.js';
import WaitForAuth from './WaitForAuth.js';

export default function Base(props) {

    const [showShelf, setShowShelf] = useState(false);
    // bool indicate if there are notifications present
    const [areNotifs, setAreNotifs] = useState(false);

    const [modal, setModal] = useState(null);

    // bool whether to display notification bar by default if there are notifications
    let defaultDisplayNotif = props.defaultDisplayNotif == true;
    if (defaultDisplayNotif)
    {
        useEffect(() => {
            if (areNotifs) setShowShelf(areNotifs);
        }, [areNotifs]);
    }

    return (
        <ModalContext.Provider value={setModal}>
            <View style={styles.base}>
                <Header showNotif={() => setShowShelf(!showShelf)} isNotifShown={showShelf} areNotifs={areNotifs} />

                <View style={{ width: 'auto', minWidth:'100%', flexDirection: 'column', flex: 1 }}>

                    <View style={{ ...props.style, ...{ flexDirection: 'row', width: '100%', flex: 1 }}}>
                        <View style={styles.container}>
                            {props.children}
                            
                        </View>
                        <WaitForAuth requireLogin={true} >
                            <Notifications show={showShelf} setAreNotifs={setAreNotifs} />
                        </WaitForAuth>

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
