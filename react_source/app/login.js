import * as globals from '../utils/globals.js'

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
        <Base style={globals.styles.container}>
            <Login />
        </Base>
    );
}
