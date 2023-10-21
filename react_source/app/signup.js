
import * as globals from '../utils/globals.js'

import Base from '../components/Base.js';
import Signup from '../components/Signup.js';

export default function Page() {


    return (
        <Base style={globals.styles.container}>
            <Signup />
        </Base>
    );
}


