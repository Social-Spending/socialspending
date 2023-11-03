import * as globals from '../../utils/globals.js'

import { useLocalSearchParams, router } from 'expo-router';

import Base from '../../components/Base.js';
import GroupInfo from '../../components/GroupInfo.js';

import WaitForAuth from '../../components/WaitForAuth.js';


export default function Page() {
    const slug = useLocalSearchParams();

    return (
        <Base style={[globals.styles.container, { justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
           <WaitForAuth redirectOnNotLoggedIn={'/login'}>
                <GroupInfo id={slug.id} />
           </WaitForAuth>
        </Base>
    );
}






