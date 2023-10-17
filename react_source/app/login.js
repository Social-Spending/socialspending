
import { StyleSheet, Text, View } from 'react-native';

import Base from '../components/Base.js';
import Login from '../components/Login.js';

export default function Page() {


    return (
        <Base style={styles.container}>
            <Login />
        </Base>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        flex: 1,
        backgroundColor: '#f9f7f3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    darkContainer: {
        position: 'relative',
        width: '100%',
        flex: 1,
        backgroundColor: '#2B2D42',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
