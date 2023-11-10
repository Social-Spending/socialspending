import { addFriend } from '../utils/friends.js';

import { router } from "expo-router";

import UserSearch from './UserSearch.js';

const Logo = require('../assets/images/logo/logo-name-64.png');

export default function NewFriend(props) {

    return (
        <UserSearch
            title="ADD FRIEND"
            label="Enter the username or email to send a friend request"
            onSubmit={onSubmit}
            style={props.style}
            exit={props.exit}
            submitLabel="Add Friend"
        />
    );
}


async function onSubmit(user, setErrorMsg, setModal, reRender)
{
    let responseMessage = await addFriend(user);
    if (responseMessage !== null)
    {
        if (responseMessage == 'Success')
        {
            setModal(null);
            router.replace("/friends");
        }
        else
        {
            setErrorMsg(responseMessage);
        }
    }
}
