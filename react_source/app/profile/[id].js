import * as globals from '../../utils/globals.js';

import { useLocalSearchParams } from 'expo-router';

import Base from '../../components/Base.js';

import WaitForAuth from '../../components/WaitForAuth.js';
import Profile from '../../components/Profile.js';


export default function Page() {
    const slug = useLocalSearchParams();

    return (
        <Base style={[globals.styles.container, { justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
           <WaitForAuth redirectOnNotLoggedIn={'/login'}>
                <Profile id={slug.id} />
           </WaitForAuth>
        </Base>
    );
}
