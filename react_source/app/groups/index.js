import * as globals from '../../utils/globals.js'

import { useState } from 'react';

import Base from '../../components/Base.js';
import GroupInfo from '../../components/GroupInfo.js';
import Sidebar from '../../components/CollapsibleSidebar.js'

import WaitForAuth from '../../components/WaitForAuth.js';
import SidebarGroupList from '../../components/SidebarGroupList.js';
import { useSearchParams } from 'react-router-dom/dist/index.js';


export default function Page() {


    const [searchParams, setSearchParams] = useSearchParams(); 

    let [groupID, setGroupID] = useState(searchParams.get('id') ? parseInt(searchParams.get('id')) : null);

    return (
        <Base style={{ ...globals.styles.container, ...{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}}>
            
            <WaitForAuth redirectOnNotLoggedIn={'/login?origin=groups'}>
                <Sidebar title={'Groups'}>
                    <SidebarGroupList groupID={groupID} setGroupID={setGroupID} />
                </Sidebar>
                <GroupInfo id={groupID} />
            </WaitForAuth>
           
        </Base>
    );
}
