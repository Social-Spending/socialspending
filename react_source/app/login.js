import * as globals from '../utils/globals.js';

import Base from '../components/Base.js';
import Login from '../components/Login.js';

export default function Page() {

    return (
        <Base style={globals.styles.container }>
            <Login />
        </Base>
            
        
    );
}