import * as globals from '../../utils/globals.js'

import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';

import Base from '../../components/Base.js';
import GroupInfo from '../../components/GroupInfo.js';

import { getGroupInfo, leaveGroup } from "../../utils/groups.js"


export default function Page() {

    const slug = useLocalSearchParams();

    return (
        <Base style={[globals.styles.container, { justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
            <GroupInfo id={slug.id} />
        </Base>  
    );
}






