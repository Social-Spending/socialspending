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