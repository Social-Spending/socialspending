import * as globals from '../../utils/globals.js'

import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import Base from '../../components/Base.js';
import GroupInfo from '../../components/GroupInfo.js';
import Sidebar from '../../components/CollapsibleSidebar.js'

import WaitForAuth from '../../components/WaitForAuth.js';
import SidebarGroupList from '../../components/SidebarGroupList.js';


export default function Page() {

    const { id } = useLocalSearchParams();
    let [groupID, setGroupID] = useState(id ? parseInt(id) : null);

    return (
        <Base style={[globals.styles.container, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
            
            <WaitForAuth redirectOnNotLoggedIn={'/login'}>
                <Sidebar title={'Groups'}>
                    <SidebarGroupList groupID={groupID} setGroupID={setGroupID} />
                </Sidebar>
                <GroupInfo id={groupID} />
            </WaitForAuth>
           
        </Base>
    );
}
