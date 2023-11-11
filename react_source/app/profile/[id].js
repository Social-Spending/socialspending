import * as globals from '../../utils/globals.js';


import { useContext } from 'react';

import Base from '../../components/Base.js';

import WaitForAuth from '../../components/WaitForAuth.js';
import Profile from '../../components/Profile.js';
import { GlobalContext } from '../../components/GlobalContext.js';
import { useNavigate, useParams } from 'react-router-dom/dist/index.js';


export default function Page() {
    const slug = useParams();

    const { currUserID, isLoading } = useContext(GlobalContext);

    const navigate = useNavigate();

    if (!isLoading && slug.id == currUserID) {
        navigate('/profile', { replace: true });
        return;
    }

    return (
        <Base style={{ ...globals.styles.container, ...{ justifyContent: 'flex-start', alignItems: 'flex-start' }}}>
           <WaitForAuth redirectOnNotLoggedIn={'/login?origin=profile/' + slug.id}>
                <Profile id={slug.id} />
           </WaitForAuth>
        </Base>
    );
}
