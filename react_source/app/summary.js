import * as globals from '../utils/globals.js'

import Base from '../components/Base.js';
import GroupsList from '../components/GroupsList.js';

export default function Page() {
    return (
        <Base style={globals.styles.container}>
            <GroupsList />
        </Base>
    );
}


