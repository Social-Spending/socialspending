
export async function getGroups() {

    let payload = new URLSearchParams();
    payload.append('brief', true);

    // do the POST request
    try {
        let response = await fetch("/groups.php?" + payload, { method: 'GET', credentials: 'same-origin' });

        if (response.ok) {
            let json = await response.json();
            if (json !== null && json['groups'] !== null) {

                return json['groups'];
            }
        } 
       
    }
    catch (error) {
        console.log("error in in GET request to groups (/groups.php)");
        console.log(error);
    }

    return null;

}
export async function getGroupInfo(id, navigate) {


    // pul username and password in form data for a POST request
    let payload = new URLSearchParams();
    payload.append('brief', false);
    payload.append('groupID', id);

    // do the POST request
    try {
        let response = await fetch("/groups.php?" + payload, { method: 'GET', credentials: 'same-origin' });

        if (response.ok) {
            let json = await response.json();
            if (json != null)
                return json

        }
        else {
            console.log(response.json()['message']);
            navigate("/groups_error", {replace: true});
            return null;
        }
    }
    catch (error) {
        console.log("error in in GET request to groups (/groups.php)");
        console.log(error);
    }

    return null;

}

export async function leaveGroup(id, navigate) {
    let payload = `{
                        "operation": "leave",
                        "group_id": ` + id + `
                    }`;

    // do the POST request
    try {
        let response = await fetch("/groups.php", {
            method: 'POST',
            body: payload,
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (await response.ok) {
            // redirect
            navigate("/groups", { replace: true });
        }
        else {
            // failed, display error message returned by server
            console.log("Error while leaving group");
            console.log(error);
        }
    }
    catch (error) {
        console.log("error in POST request to groups (/groups.php)");
        console.log(error);
    }
}

export async function kickMemberFromGroup(user_id, group_id, popModal, reRender) {
    let payload = {
        'operation': 'kick_user',
        'group_id': group_id,
        'user_id': user_id
    };

    // do the POST request
    try {
        let response = await fetch("/groups.php", {
            method: 'POST',
            body: JSON.stringify(payload),
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (await response.ok) {
            // close modal and re-render the group page
            popModal();
            reRender();
        }
        else {
            // failed, display error message returned by server
            console.log("Error while kicking user with id "+user_id+" from group");
            console.log(error);
        }
    }
    catch (error) {
        console.log("error in kick_user operation (POST request) to /groups.php");
        console.log(error);
    }
}

export async function revokeInvitation(user_id, group_id, popModal, reRender) {
    let payload = {
        'operation': 'cancel_invite',
        'group_id': group_id,
        'user_id': user_id
    };

    // do the POST request
    try {
        let response = await fetch("/groups.php", {
            method: 'POST',
            body: JSON.stringify(payload),
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (await response.ok) {
            // close modal and re-render the group page
            popModal();
            reRender();
        }
        else {
            // failed, display error message returned by server
            console.log("Error while revoking group invitation from user with id "+user_id);
            console.log(error);
        }
    }
    catch (error) {
        console.log("error in cancel_invite operation (POST request) to /groups.php");
        console.log(error);
    }
}

export async function sendGroupInvitation(username, group_id, popModal, reRender, setErrorMsg) {
    let payload = {
        'operation': 'invite_user',
        'group_id': group_id,
        'user': username
    };

    // do the POST request
    try {
        let response = await fetch("/groups.php", {
            method: 'POST',
            body: JSON.stringify(payload),
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (await response.ok) {
            // close modal and re-render the group page
            popModal();
            reRender();
        }
        else {
            // failed, display error message returned by server
            let responseJSON = await response.json();
            setErrorMsg(responseJSON['message']);
        }
    }
    catch (error) {
        console.log("error in invite_user operation (POST request) to /groups.php");
        console.log(error);
    }
}
