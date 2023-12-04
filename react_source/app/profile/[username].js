import * as globals from '../../utils/globals.js';


import { useContext, useEffect } from 'react';

import Base from '../../components/Base.js';

import WaitForAuth from '../../components/WaitForAuth.js';
import Profile from '../../components/Profile.js';
import { GlobalContext } from '../../components/GlobalContext.js';
import { useNavigate, useParams } from 'react-router-dom/dist/index.js';


export default function Page() {
    const slug = useParams();

    const { currUsername, isLoading } = useContext(GlobalContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && slug.username == currUsername) {
            navigate('/profile', { replace: true });
            return;
        }

    }, [isLoading, slug.username]);

    

    return (
        <Base style={{ ...globals.styles.container, ...{ justifyContent: 'flex-start', alignItems: 'flex-start' }}}>
           <WaitForAuth redirectOnNotLoggedIn={'/login?origin=profile/' + slug.username}>
                <Profile username={slug.username} />
           </WaitForAuth>
        </Base>
    );
}
