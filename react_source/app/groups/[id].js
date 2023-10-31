import * as globals from '../../utils/globals.js'

import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';

import Base from '../../components/Base.js';
import GroupInfo from '../../components/GroupInfo.js';
import VerifyAction from '../../components/VerifyAction.js';

import { getGroupInfo, leaveGroup } from "../../utils/groups.js"



export default function Page() {

    const slug = useLocalSearchParams();

    let json = null;

    useEffect(() => {
        
        getGroupInfo(slug.id);

    }, []);

    const [modal, setModal] = useState(null);

    const verifyLeave = () => {
        setModal(<VerifyAction label="Are you sure you want to leave this group?" accept={() => leaveGroup(slug.id)} reject={() => setModal(null)} exit={() => setModal(null)} />)
    }

    return (
        <>
            <Base style={[globals.styles.container, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
            
                <GroupInfo id={slug.id} json={json} leave={verifyLeave} />
            </Base>
            {modal}
        </>
    );
}






