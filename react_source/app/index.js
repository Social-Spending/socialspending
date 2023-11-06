import * as globals from '../utils/globals.js'

import { useContext } from 'react';
import { Redirect } from "expo-router";

import { GlobalContext } from '../components/GlobalContext.js';

import "../utils/global.css"
import Loading from '../components/Loading.js';

export default function Page() {
    // get data from global context
    const {isLoading, isLoggedIn} = useContext(GlobalContext);

    // waiting to get user info
    if (!isLoading) {
        // we have user info, should we redirect?
        if (isLoggedIn) {
            return (<Redirect href={'/summary'} />);
        }
        else {
            return (<Redirect href={'/login'} />);

        }
    }

    return (<Loading/>);
}


