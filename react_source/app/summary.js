import * as globals from '../utils/globals.js'

import Base from '../components/Base.js';
import Groups from '../components/Groups.js';

export default function Page() {
    return (
        <Base style={globals.styles.container}>
            <Groups />
        </Base>
    );
}


