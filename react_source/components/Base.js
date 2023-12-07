

import { View } from '../utils/globals.js';
import { useState, useEffect } from 'react';

import Header from './Header.js';
import Footer from './Footer.js';
import Notifications from './Notifications.js';

import { ModalContext } from '../modals/ModalContext.js';
import WaitForAuth from './WaitForAuth.js';
import VerifyAction from '../modals/VerifyAction.js';

export default function Base(props) {

    const [showShelf, setShowShelf] = useState(false);
    // bool indicate if there are notifications present
    const [areNotifs, setAreNotifs] = useState(false);

    let [modals, setModals] = useState([]);

    // bool whether to display notification bar by default if there are notifications
    useEffect(() => {
        let defaultDisplayNotif = props.defaultDisplayNotif == true;
        if (defaultDisplayNotif) {
            if (areNotifs) setShowShelf(areNotifs);
        }
    }, [areNotifs]);
    

    function pushModal(modal) {
        modals.push(<React.Fragment key={modals.length}>{modal}</React.Fragment>);
        setModals(modals.concat([])); //This is so dumb but it wont work with just setModals(modals) it only works with a function that returns an array
    }
    function popModal(num = 1) {
        for (let i = 0; i < num; i++) {
            if (modals.length) modals.pop();
        }
        setModals(modals.concat([])); 
        
    }

    return (
        <ModalContext.Provider value={{ pushModal: pushModal, popModal: popModal }}>
            <View style={{...props.style, ...styles.base}}>
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
            {modals}
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
        flexDirection: 'none',
        alignItems: 'none',
        justifyContent: 'none'

    },
    container: {
        flex: 1,
        height: '100%',
        minHeight: '100%',
        width: '100%',
        flexWrap: 'nowrap',
        flexDirection: 'inherit',
        alignItems: 'inherit',
        justifyContent: 'inherit'

    }

};
