import * as globals from '../utils/globals.js';


import { Text, View, Image, Modal } from '../utils/globals.js';

import { useRef, useState, useContext, useEffect } from 'react';


import Button from '../components/Button.js'
import { ModalContext } from './ModalContext.js';
import { GlobalContext } from '../components/GlobalContext.js';

import Logo from '../assets/images/logo/logo-name-64.png';
import { debounce } from '../utils/userSearch.js';

const MAX_DISPLAYED = 15;


/**
 *  modal intended to be wrapped, used in different ways to search for a user
 *      ie. to search for a user to add as a friend or to invite to a group
 *      @param {string} title        title of the modal to be displayed
 *      @param {string} label        question presented to the user
 *      @param {string} submitLabel  text to put on the 'submit' button
 *      @param {JSON Object} style   Styles to use
 *      @param {Function} exit       function to call when exiting if you dont want to exit the modal for some reason
 *      @param {number} onSubmit     function handle for what to do with the username/email when user presses submit
 *                                   onSubmit takes args (user, setErrorMsg, popModal, reRender)...
 *                                   where  'user' is a string of the username/email entered
 *                                          'setErrorMsg' is a function handle that takes 1 argument of a string error message to present on this modal
 *                                          'popModal' is a function handle from ModalContext that takes 0 or 1 arguments and removes one (or more) modals from the stack
 *      @return {React.JSX.Element}  DOM element
 */
export default function OfflineUserSearch(props) {
    // context vars/functions
    const { reRender } = useContext(GlobalContext);
    const { pushModal, popModal } = useContext(ModalContext);

    // refs to DOM content
    const errorMessageRef = useRef(null);
    const userRef = useRef(null);

    const [foundUsers, setFoundUsers] = useState([]);

    // functions
    function handleChildClick(e) {
        e.stopPropagation();
    }

    function onSubmit() {

        let foundUsers = props.users.filter((user) =>
            user.username.toLowerCase().indexOf(userRef.current.value.toLowerCase()) != -1 /* set to 0 to only include names that start with the search*/
            && !props.excludedUsers.includes(user.username)
        );

        if (foundUsers.length != 0) {
            props.onSubmit(foundUsers[0]);
            popModal();
        } else {
            popModal();
        }
    }

    //Create debounced function for searching users
    let onNameChange = debounce(() => searchUser(props.users, props.excludedUsers, userRef, errorMessageRef, setFoundUsers), 500);
    useEffect(() => {
        searchUser(props.users, props.excludedUsers, userRef, errorMessageRef, setFoundUsers);

    }, []);


    // DOM content to return
    return (
        <Modal
            transparent={true}
            visible={true}
            onRequestClose={() => popModal()}>

            <View style={{ ...globals.styles.modalBackground, ...props.style }} onClick={(props.exit != undefined ? props.exit : () => popModal())}>
                <View style={styles.create} onClick={handleChildClick}>

                    <Image source={Logo} style={styles.logo} />

                    <Text style={{ ...globals.styles.label, ...globals.styles.h2, ...{ padding: 0 } }}>{props.title}</Text>
                    <Text style={{ ...globals.styles.text, ...{ paddingTop: '1em', textAlign: 'center' } }}>{props.label}</Text>

                    <Text ref={errorMessageRef} id='userSearch_errorMessage' style={globals.styles.error}></Text>

                    <View style={globals.styles.labelContainer}>
                        <label htmlFor="userSearch_name" style={{ ...globals.styles.h5, ...globals.styles.label }}>USERNAME</label>
                    </View>

                    <input autoFocus
                        tabIndex={0}
                        ref={userRef}
                        placeholder=" Enter username"
                        style={globals.styles.input}
                        id='userSearch_name'
                        name="user"
                        onInput={onNameChange}
                    />
                    
                    <View style={styles.dropDown}>
                        {foundUsers}
                    </View>

                    <Button id="userSearch_button" tabIndex={0} style={{...globals.styles.formButton, ...{ marginBottom: '1em' }}} onClick={onSubmit}>
                        <label htmlFor="userSearch_button" style={globals.styles.buttonLabel}>
                            {props.submitLabel}
                        </label>
                    </Button>

                </View>
            </View>
        </Modal>
    );
}
/**
 * An entry to display on the found users drop down menu
 * Clicking will set the input value and clear the drop down
 * 
 * @param {string} username     username of the person to display
 * @param {string} icon         path to the users icon
 * @param {function} setFound   function to change the contents of the drop down
 * @returns {React.JSX.Element}
 */
function FoundUser(props) {
    function pickUser() {
        props.userRef.current.value = props.username;
        props.setFound([]);
    }

    return (
        <Button tabIndex={0} id={"foundUser_" + props.username} onMouseDown={pickUser}>
            <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row' }}>
                <Image source={props.icon ? props.icon : globals.getDefaultUserIcon(props.username)} style={{ ...globals.styles.listIcon, ...{ width: '1.25em', height: '1.25em', marginLeft: '.5em' } }} />
                <label htmlFor={"foundUser_" + props.username} style={{ fontSize: '1.25em', color: globals.COLOR_GRAY, paddingLeft: '.25em', cursor: 'pointer' }}>
                    {props.username}
                </label>
            </View>
        </Button>

    );
}

/**
 * Search for users given the username or email and populate the drop down display of found users
 * @param {React.MutableRefObject} userRef  A reference to the username input
 * @param {React.MutableRefObject} errorRef A reference to the error display element
 * @param {Function} setFoundUsers          A function to change the entries of the found users drop down menu
 */
async function searchUser(users, excludedUsers, userRef, errorRef, setFoundUsers) {

    let output = [];

    let foundUsers = users.filter((user) =>
        user.username.toLowerCase().indexOf(userRef.current.value.toLowerCase()) != -1 /* set to 0 to only include names that start with the search*/
        && !excludedUsers.includes(user.username)
    );

    if (foundUsers.length) {

        // remove error
        errorRef.current.innerText = "";
        userRef.current.removeAttribute("aria-invalid");
        userRef.current.removeAttribute("aria-errormessage");

        for (let i = 0; i < foundUsers.length && i < MAX_DISPLAYED; i++) {
            output.push(
                <FoundUser key={foundUsers[i].user_id} username={foundUsers[i].username} userRef={userRef} icon={foundUsers[i].icon_path} setFound={setFoundUsers} />

            );
        }
        setFoundUsers(output);
    } else {

        setFoundUsers([]);

        // set error acessability features
        errorRef.current.innerText = "No Users Found";
        userRef.current.setAttribute("aria-invalid", true);
        userRef.current.setAttribute("aria-errormessage", errorRef.current.id);

    }

    
}

const styles = {
    create: {
        zIndex: 1,
        height: 'auto',
        backgroundColor: globals.COLOR_WHITE,
        width: '26em',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1
    },
    logo: {
        marginTop: '.5em',
        height: '3em',
        width: '9em',
        minWidth: '2em',
        borderRadius: 1,
    },
    dropDown: {
        marginTop: '.5em',
        width: '75%',
        height: 'auto',
        minHeight: '10em',
        maxHeight: '27em',
        backgroundColor: globals.COLOR_WHITE,
        overflowY: 'auto',
        scrollbarWidth: 'thin'
    }

};
