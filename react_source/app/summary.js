import * as globals from '../utils/globals.js'
import { View } from '../utils/globals.js';
import Base from '../components/Base.js';
import GroupsList from '../components/GroupsList.js';
import SummaryFriendsList from '../components/SummaryFriendsList.js';
import WaitForAuth from '../components/WaitForAuth.js';
import SummaryTransactionsList from '../components/SummaryTransactionsList.js';

export default function Page() {
    return (
        <Base style={globals.styles.container} defaultDisplayNotif={true}>
            <View style={styles.summaryContainer}>
                <View style={{flexDirection: 'column', paddingRight: '3em'} }>
                    <GroupsList style={{ height: '38vh' }} />
                    <SummaryFriendsList style={{ ...styles.summaryComponentSeparator, ...{ height: '38vh' } }} />
                </View>
                <WaitForAuth redirectOnNotLoggedIn="/login">
                    <SummaryTransactionsList style={{ height: '80vh' }} />
                </WaitForAuth>
                
            </View>
        </Base>
    );
}

const styles = {
    summaryContainer: {
        width: '100%',
        flex: 1,
        backgroundColor: globals.COLOR_BEIGE,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryComponentSeparator: {
        marginTop: '4vh'
    }

};

