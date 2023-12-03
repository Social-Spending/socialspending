
// Return an array of this user's friends
// each friend object has "username" and "user_id" keys
export async function getFriends() {

    let payload = new URLSearchParams();
    payload.append('brief', true);

    // do the GET request
    try {
        let response = await fetch("/friendships.php", { method: 'GET', credentials: 'same-origin' });

        if (response.ok) {
            let json = await response.json();
            if (json !== null) {

                return json;
            }
        }
    }
    catch (error) {
        console.log("error in in GET request to friendships (/friendships.php)");
        console.log(error);
    }

    return null;

}

export async function getUserInfo(id=null, username=null) {
    // put user_id to search in URL param
    let payload = new URLSearchParams();
    if (id != null)
    {
        payload.append('user_id', id);
    }
    if (username != null)
    {
        payload.append('user', username);
    }

    // do the POST request
    try {
        let response = await fetch("/user_profile.php?" + payload, { method: 'GET', credentials: 'same-origin' });

        if (response.ok) {
            let json = await response.json();
            if (json != null)
                return json;

        }
    }
    catch (error) {
        console.log("error in in GET request to user_profile (/user_profile.php)");
        console.log(error);
    }

    return null;
}

export async function removeFriend(username, reRender = null) {
    // put username to search in request body
    let payload = {
        "operation": "remove",
        "username": username
    };

    // do the POST request
    try {
        let response = await fetch("/friendships.php", {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            let json = await response.json();
            if (json !== null) {
                // successfully removed friend
                // reload the window, because this will change the sidebar if on the /friends page
                if ( reRender) reRender();
                return json;
            }

        }
    }
    catch (error) {
        console.log("error in in POST request to friendships, operation: remove (/friendships.php)");
        console.log(error);
    }

    return null;
}

export async function addFriend(username) {
    // put username to search in request body
    let payload = {
        "operation": "add",
        "username": username
    };

    // do the POST request
    try {
        let response = await fetch("/friendships.php", {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            }
        });

        let json = await response.json();
        if (json != null)
            return json['message'];
    }
    catch (error) {
        console.log("error in in POST request to friendships, operation: remove (/friendships.php)");
        console.log(error);
    }

    return null;
}

/* accept or reject friend request sent to the current user
 * @param notification_id notification_id of the friend request
 * @param acceptNReject when true, accept friend request
 *                      when false, reject friend request
 * @return 0 on success; otherwise return the message explaining the error
*/
export async function acceptRejectFriendRequest(notification_id, acceptNReject)
{
    let payload = {
        'operation': (acceptNReject ? 'accept' : 'reject'),
        'notification_id': notification_id
    };

    // do the POST request
    try {
        let response = await fetch("/friendships.php", { method: 'POST', body: JSON.stringify(payload), credentials: 'same-origin' });

        if (response.ok) {
            return 0;
        } else {
            let responseJSON = await response.json();
            return responseJSON['message'];
        }
    }
    catch (error) {
        console.error("error in POST request to accept/reject friend request (/friendships.php)");
        console.error(error);
    }
    return 'Could not send POST request';
}

/* cancel a friend request sent from the current user
 * @param notification_id notification_id of the friend request
 * @return 0 on success; otherwise return the message explaining the error
*/
export async function cancelFriendRequest(notification_id)
{
    let payload = {
        'operation': 'cancel',
        'notification_id': notification_id
    };

    // do the POST request
    try {
        let response = await fetch("/friendships.php", { method: 'POST', body: JSON.stringify(payload), credentials: 'same-origin' });

        if (response.ok) {
            return 0;
        } else {
            let responseJSON = await response.json();
            return responseJSON['message'];
        }
    }
    catch (error) {
        console.error("error in POST request to accept/reject friend request (/friendships.php)");
        console.error(error);
    }
    return 'Could not send POST request';
}
