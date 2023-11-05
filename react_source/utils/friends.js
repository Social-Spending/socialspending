// Return an array of this user's friends

import { ModalContext } from "../modals/ModalContext";

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

export async function getUserInfo(id) {
    // put user_id to search in URL param
    let payload = new URLSearchParams();
    payload.append('user_id', id);

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

export async function removeFriend(username, reRender) {
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
                reRender();
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
