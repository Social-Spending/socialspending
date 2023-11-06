export async function getTransactions(currUserID) {

    let payload = new URLSearchParams();
    payload.append('user_id', currUserID);

    // do the GET request
    try {
        let response = await fetch("/transactions.php?" + payload, { method: 'GET', credentials: 'same-origin' });

        if (response.ok) {
            let json = await response.json();
            if (json !== null) {

                return json;
            }
        }
    }
    catch (error) {
        console.log("error in in GET request to transactions (/transactions.php)");
        console.log(error);
    }

    return null;

}