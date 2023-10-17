import { StyleSheet } from 'react-native';
import { router } from 'expo-router';

import Base from '../components/Base.js';
import Login from '../components/Login.js';

export default function Page() {

    // make a quick GET request to login.php to check if the user's cookies are already authenticated
    // assemble endpoint for authentication
    fetch("/login.php", { credentials: 'same-origin' }).then((response) => {
        if (response.status == 200) {
            // redirect
            router.replace("/summary");
        }
    });


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
