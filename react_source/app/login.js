import * as globals from '../utils/globals.js'

import Base from '../components/Base.js';
import Login from '../components/Login.js';
import LoggedInRedirect from '../components/LoggedInRedirect.js';
import { useSearchParams } from 'react-router-dom/dist/index.js';

// use example.com/login?origin={destination} to redirect to to destination after login

export default function Page() {
    const [ searchParams , setSearchParams] = useSearchParams();

    return (
        <Base style={globals.styles.container}>
            <LoggedInRedirect ifLoggedIn={true} target={'/' + (searchParams.get("origin") ? searchParams.get("origin") : "summary")} />
            <Login />
        </Base>
    );
}