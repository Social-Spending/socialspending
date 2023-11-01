import * as globals from '../utils/globals.js'

import Base from '../components/Base.js';
import GroupsList from '../modals/NewExpense.js';

export default function Page() {
    return (
        <Base style={globals.styles.container}>
            <GroupsList />
        </Base>
    );
}


