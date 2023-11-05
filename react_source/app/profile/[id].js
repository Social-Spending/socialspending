import * as globals from '../../utils/globals.js';

import { useLocalSearchParams, router } from 'expo-router';
import { useContext } from 'react';

import Base from '../../components/Base.js';

import WaitForAuth from '../../components/WaitForAuth.js';
import Profile from '../../components/Profile.js';
import { GlobalContext } from '../../components/GlobalContext.js';


export default function Page() {
    const slug = useLocalSearchParams();

    const { currUserID, isLoading } = useContext(GlobalContext);

    if (!isLoading && slug.id == currUserID) {
        router.replace('/profile');
        return;
    }

    return (
        <Base style={[globals.styles.container, { justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
           <WaitForAuth redirectOnNotLoggedIn={'/login'}>
                <Profile id={slug.id} />
           </WaitForAuth>
        </Base>
    );
}
