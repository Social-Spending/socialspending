
// given a partial string of username or email, return a list of user objects, ...
//  where each user object has keys 'user_id' and 'username'
// if no matches were found or an error occurred, return an empty array
export async function userSearch(partialUser) {
    let payload = '{"search_term": "'+partialUser+'"}';

    // do the POST request
    try {
        let response = await fetch("/search_users.php", {
            method: 'POST',
            body: payload,
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (await response.ok) {
            // parse response JSON
            let responseJSON = await response.json();
            return responseJSON['users'];
        }
        else {
            // failed, print error message returned by server
            console.log("Error while leaving group");
            console.log(error);
            // return empty array
            return [];
        }
    }
    catch (error) {
        console.log("error in POST request to user search (/search_users.php)");
        console.log(error);
        // return empty array
        return [];
    }
}