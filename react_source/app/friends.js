import * as globals from '../utils/globals.js'

import { useState } from 'react';

import Base from '../components/Base.js';
import WaitForAuth from '../components/WaitForAuth.js';
import Profile from '../components/Profile.js';
import Sidebar from '../components/CollapsibleSidebar.js';
import SidebarFriendList from '../components/SidebarFriendList.js';

export default function Page() {
    let [friendID, setFriendID] = useState(null);

    return (
        <Base style={{ ...globals.styles.container, ...{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', maxHeight: '100vh' } }}>

        <Sidebar title={'Friends'}>
            <WaitForAuth redirectOnNotLoggedIn={'/login?origin=friends'}>
                <SidebarFriendList friendID={friendID} setFriendID={setFriendID} />
            </WaitForAuth>
        </Sidebar>
        <Profile id={friendID} />
    </Base>
    );
}
