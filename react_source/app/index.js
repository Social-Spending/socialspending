import * as globals from '../utils/globals.js'

import { useContext } from 'react';
import { Navigate } from "react-router-dom";

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
            return (<Navigate to={'/summary'} replace={true} />);
        }
        else {
            return (<Navigate to={'/login'} replace={true} />);

        }
    }

    return (<Loading/>);
}


