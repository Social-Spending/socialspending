import * as globals from '../utils/globals.js'

import { useContext } from 'react';
import Base from '../components/Base.js';
import Friends from "../components/Friends.js"
import WaitForAuth from '../components/WaitForAuth.js';

export default function Page() {
    return (
    <Base style={globals.styles.container}>
        <WaitForAuth redirectOnNotLoggedIn={'/login'}>
            <Friends />
        </WaitForAuth>
    </Base>
    );
}
