import * as globals from '../../utils/globals.js'

import Base from '../../components/Base.js';

import WaitForAuth from '../../components/WaitForAuth.js';
import SelfProfile from '../../components/SelfProfile.js';


export default function Page() {

    return (
        <Base style={{ ...globals.styles.container, ...{ justifyContent: 'flex-start', alignItems: 'flex-start' }}}>
           <WaitForAuth redirectOnNotLoggedIn={'/login?origin=profile'}>
                <SelfProfile />
           </WaitForAuth>
        </Base>
    );
}






