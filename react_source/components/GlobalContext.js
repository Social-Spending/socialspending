/*
    How to use this GlobalContext
        - If your component needs the user's info (ie. user_id) to function,
            wrap the component in a <WaitForAuth> component. This component takes optional properties
            to define where to redirect the user if it turns out they are/aren't logged in
        - If the page can be loaded without needing the user's info (ie. login, a specific group's page)
            add the <LoggedInRedirect> component somewhere in your return statement
            to redirect the user if it turns out the user is/is not logged on
    Other Info
        - _layout.js will wrap all pages in <GlobalContextProvider></GlobalContextProvider>,
            so variables stored in GlobalContext may be accessed in *any* page or component.
        - To access data in GlobalContext, you need the following imports:
                import { GlobalContext } from '<directory>/GlobalContext.js';
                import { useContext } from 'react';
            Get data like this:
                function MyComponent () {
                    const globalContext = useContext(GlobalContext);
                    if (globalContext.isLoggedIn) {
                        router.push('/summary');
                    }
                }
            Or like this:
                function MyComponent () {
                    const {isLoading, currUserID, currUsername, loginAttempts} = useContext(GlobalContext);
                    const [loginAttemptsState, setLoginAttemptsState] = loginAttempts;
                }
        Remember that the app page will get re-rendered when global context
        state variables change (ie. setLoginAttempts(69) )
*/

import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from '../node_modules/react-router-dom/dist/index';

// global context provides information about currently logged in user too all child pages
export const GlobalContext = createContext();

let navigate = 0;

export function GlobalContextProvider (props) {
    // state variables for information about the current user
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currUserID, setCurrUserID] = useState(0);
    const [currUsername, setCurrUsername] = useState('New User');
    const [currUserIconPath, setCurrUserIconPath] = useState(null);
    // state var to re-try getting user info when a login/signup attempt is made
    const [loginAttempts, setLoginAttempts] = useState(0);
    // state var to indicate if browser is still waiting for getUserInfo
    const [isLoading, setIsLoading] = useState(true);
    var cancelGetUserInfoController = null;
    // state var to re-render page
    const [reRenderCount, setReRenderCount] = useState(0);
    const reRender = () => { setReRenderCount(reRenderCount + 1); };

    navigate = useNavigate();

    useEffect(() => {
            // Check if user is logged in and if they are get their username
            // only do this when the page is loaded or loginAttempts was changed to trigger a re-render, not under normal re-rendering

            // first cancel existing requests, if we were waiting
            if (cancelGetUserInfoController != null)
            {
                cancelGetUserInfoController.abort();
            }
            cancelGetUserInfoController = new AbortController()
            setIsLoading(true);
            // getUserInfo will update state variables and trigger a re-render
            getUserInfo(setIsLoggedIn, setCurrUserID, setCurrUsername, setCurrUserIconPath, setIsLoading, cancelGetUserInfoController.signal);
    }, [loginAttempts]);

    return (
        <GlobalContext.Provider 
            value={{
                isLoggedIn: isLoggedIn,
                currUserID: currUserID,
                currUsername: currUsername,
                currUserIconPath: currUserIconPath,
                loginAttempts: [loginAttempts, setLoginAttempts],
                isLoading: isLoading,
                reRenderCount: reRenderCount,
                reRender: reRender,
                doSignout: () => doSignout(setIsLoggedIn, setCurrUserID, setCurrUsername)
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    );
}

async function getUserInfo(setIsLoggedIn, setCurrUserID, setCurrUsername, setCurrUserIconPath, setIsLoading, signal) {
    // simple GET request to user info endpoint
    let endpoint = '/user_info.php';
    try {
        var response = await fetch(endpoint, {
                method: 'GET',
                credentials: 'same-origin',
                signal: signal
            });
    }
    catch (error) {
        if (error.name != 'AbortError')
        {
            console.log('error in in GET request to ' + endpoint);
            console.log(error);
        }
    }

    if (response.ok) {
        // unpack information
        let responseJSON = await response.json();
        setIsLoggedIn(true);
        setCurrUserID(responseJSON['user_id']);
        setCurrUsername(responseJSON['username']);
        setCurrUserIconPath(responseJSON['icon_path']);
    }
    setIsLoading(false);
}

async function doSignout(setIsLoggedIn, setCurrUserID, setCurrUsername) {
    // simple GET request to signout endpoint
    let endpoint = '/signout.php';
    try {
        let response = await fetch(endpoint, { method: 'GET', credentials: 'same-origin' });

        if (response.ok) {
            // clear state variables about the current user
            setIsLoggedIn(false);
            setCurrUserID(0);
            setCurrUsername('New User');
            // redirect to login page
            navigate("/login");
        }
        else {
            // failed, display error message returned by server
            let responseJSON = await response.json();
            let message = 'Failed to signout: ' + responseJSON['message'];
            alert(message);
        }
    }
    catch (error) {
        console.log('error in in GET request to ' + endpoint);
        console.log(error);
    }
}

// call getUserInfo in page=>useEffect on each page
