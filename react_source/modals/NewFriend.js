import { useNavigate } from 'react-router-dom/dist/index.js';
import { addFriend } from '../utils/friends.js';


import UserSearch from './UserSearch.js';

let navigate = 0;
export default function NewFriend(props) {

    navigate = useNavigate();

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


async function onSubmit(user, setErrorMsg, popModal, reRender)
{
    let responseMessage = await addFriend(user);
    if (responseMessage !== null)
    {
        if (responseMessage == 'Success')
        {
            popModal();
            navigate("/friends", { replace: true });
            navigate(0);
        }
        else
        {
            setErrorMsg(responseMessage);
        }
    }
}
