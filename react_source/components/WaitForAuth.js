
import { useContext, useEffect } from 'react';
import { GlobalContext } from './GlobalContext.js';
import Loading from './Loading.js';
import { useNavigate } from 'react-router-dom/dist/index.js';

// component to wait until GlobalContext's isLoading==false before rendering content
// upon isLoading becoming false, will optionally check if user is logged in or not:
//      if redirectOnLoggedIn is set, redirect to this target (placing an entry in the history) if isLoggedIn==true
//      if redirectOnNotLoggedIn is set, redirect to this target (placing an entry in the history) if isLoggedIn==false
//      if requireLogin is set and requireLogin == true, content will only be rendered if isLoggedIn==true


export default function WaitForAuth(props) {
    // get data from global context

    const { isLoading, isLoggedIn } = useContext(GlobalContext);
    let navigate = useNavigate();

    // waiting to get user info
    

    // we have user info, should we redirect?
    useEffect(() => {
        if (!isLoading) {
            if (isLoggedIn) {
                if ('redirectOnLoggedIn' in props) {
                    navigate(props.redirectOnLoggedIn, { replace: true });
                    return;
                }
            }
            else {
                if ('redirectOnNotLoggedIn' in props) {
                    navigate(props.redirectOnNotLoggedIn, { replace: true });
                    ;
                    return;
                }
            }
        }
        
    }, [isLoading]);

    if (isLoading) return (
        <Loading />
    );
    // check if logon required
    if ('requireLogin' in props && props.requireLogin) {
        if (isLoggedIn) {
            return (props.children);
        }
        else return;
    }

    // otherwise, just render content
    return (props.children);
}
