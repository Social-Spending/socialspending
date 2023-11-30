
/**
 * Gets a Json array of all transactions for a current user
 * @param {number} currUserID user id of current signed in user
 * @returns {promise<JSON Array>}
 */
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
/**
 * Approves of rejects a transaction
 * @param {number} trans_id id of the transaction to approved/reject
 * @param {boolean} approved if the transaction is being approved or rejected
 * @returns if the action was successful or not
 */
export async function approveRejectTransaction(trans_id, approved) {

    let payload = `{
        "transaction_id": ` + trans_id + `
    }`;

    if (approved) {
        try {
            let response = await fetch("/transaction_approval.php", { method: 'PUT', body: payload, credentials: 'same-origin' });

            if (response.ok) {
                return true;
            } else {
                return false;
            }
        }
        catch (error) {
            console.error("error in PUT request to transaction_approval (/transaction_approval.php)");
            console.error(error);
        }
    } else {
        try {
            let response = await fetch("/transactions.php", { method: 'DELETE', body: payload, credentials: 'same-origin' });

            if (response.ok) {
                return true;
            } else {
                return false;
            }
        }
        catch (error) {
            console.error("error in DELETE request to transactions (/transactions.php)");
            console.error(error);
        }
    }
    return false;
}