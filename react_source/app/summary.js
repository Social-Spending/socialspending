import * as globals from '../utils/globals.js'
import { StyleSheet, View } from 'react-native';
import Base from '../components/Base.js';
import GroupsList from '../components/GroupsList.js';
import SummaryFriendsList from '../components/SummaryFriendsList.js';

export default function Page() {
    return (
        <Base style={globals.styles.container}>
            <View style={styles.summaryContainer}>
                <GroupsList />
                <SummaryFriendsList style={styles.summaryComponentSeparator} />
            </View>
        </Base>
    );
}

const styles = StyleSheet.create({
    summaryContainer: {
        width: '100%',
        flex: 1,
        backgroundColor: globals.COLOR_BEIGE,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryComponentSeparator: {
        paddingTop: '1em',
        paddingBottom: '1em'
    }

});

