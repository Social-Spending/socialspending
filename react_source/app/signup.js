
import * as globals from '../utils/globals.js'

import Base from '../components/Base.js';
import Signup from '../components/Signup.js';
import LoggedInRedirect from '../components/LoggedInRedirect.js';

export default function Page() {
    return (
        <Base style={globals.styles.container}>
            <LoggedInRedirect onLoggedIn={true} target={'/summary'}/>
            <Signup />
        </Base>
    );
}


