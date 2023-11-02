import { router } from 'expo-router';
import { useContext } from 'react';
import { GlobalContext } from './GlobalContext.js';
import Loading from './Loading.js';

// component to wait until GlobalContext's isLoading==false before rendering content
// upon isLoading becoming false, will optionally check if user is logged in or not:
//      if redirectOnLoggedIn is set, redirect to this target (placing an entry in the history) if isLoggedIn==true
//      if redirectOnNotLoggedIn is set, redirect to this target (placing an entry in the history) if isLoggedIn==false
export default function WaitForAuth(props) {
    // get data from global context
    const {isLoading, isLoggedIn} = useContext(GlobalContext);

    // waiting to get user info
    if (isLoading) return (
        <Loading/>
    );

    // we have user info, should we redirect?
    if (isLoggedIn) {
        if ('redirectOnLoggedIn' in props) {
            router.push(props.redirectOnLoggedIn);
        }
    }
    else {
        if ('redirectOnNotLoggedIn' in props) {
            router.push(props.redirectOnNotLoggedIn);
        }
    }

    // otherwise, just render content
    return (props.children);
}
