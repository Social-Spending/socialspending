import { router } from 'expo-router';
import { useContext } from 'react';
import { GlobalContext } from './GlobalContext.js';

// component will redirect based on isLoggedIn in global context
// will wait for user info to be valid to decide on redirect
// will redirect to target (placing an entry in the history) ...
//      if isLoggedIn == onLoggedIn
export default function LoggedInRedirect({onLoggedIn, target}) {
    // get isLoggedIn from global context
    const {isLoading, isLoggedIn} = useContext(GlobalContext);

    // waiting to get user info
    if (!isLoading) {
        // we have user info, should we redirect?
        if (isLoggedIn == onLoggedIn) {
            router.push(target);
        }
    }
}
