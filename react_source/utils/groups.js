import { router } from 'expo-router';


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
export async function getGroupInfo(id) {


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
            router.replace("/groups");
            return null;
        }
    }
    catch (error) {
        console.log("error in in GET request to groups (/groups.php)");
        console.log(error);
    }

    return null;

}

export async function leaveGroup(id) {
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
            router.replace("/groups");
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