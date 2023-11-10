import * as globals from '../utils/globals.js'

import Base from '../components/Base.js';
import Login from '../components/Login.js';
import LoggedInRedirect from '../components/LoggedInRedirect.js';
import { useLocalSearchParams } from 'expo-router';

// use example.com/login?origin={destination} to redirect to to destination after login

export default function Page() {
    const { origin } = useLocalSearchParams();

    return (
        <Base style={globals.styles.container}>
            <LoggedInRedirect ifLoggedIn={true} target={'/' + (origin ? origin : "summary")}/>
            <Login />
        </Base>
    );
}
