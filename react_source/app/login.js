import * as globals from '../utils/globals.js'

import Base from '../components/Base.js';
import Login from '../components/Login.js';
import LoggedInRedirect from '../components/LoggedInRedirect.js';

export default function Page() {

    return (
        <Base style={globals.styles.container}>
            <LoggedInRedirect ifLoggedIn={true} target={'/summary'}/>
            <Login />
        </Base>
    );
}
