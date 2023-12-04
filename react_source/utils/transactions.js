
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

// function that can be used to sort an array of transaction JSON
// each transaction must include nodes 'date' and 'transaction_id' and 'is_approved'
// returning negative means a will be displayed higher than b
// returning positive means a will be displayed lower than b
function transactionJSONComparator(a,b, date_key, transaction_id_key, is_approved_key)
{
    // pending transactions first
    if (a[is_approved_key] && !b[is_approved_key]) {
        return 1;
    }
    if (!a[is_approved_key] && b[is_approved_key]) {
        return -1;
    }

    // highest date toward the top
    let a_date = a[date_key].split('-');
    a_date.forEach((element, index, array) => {
        array[index] = parseInt(element);
    });
    let b_date = b[date_key].split('-');
    b_date.forEach((element, index, array) => {
        array[index] = parseInt(element);
    });
    // compare year
    if (a_date[0] < b_date[0]) {
        return 1;
    }
    if (a_date[0] > b_date[0]) {
        return -1;
    }
    // compare month
    if (a_date[1] < b_date[1]) {
        return 1;
    }
    if (a_date[1] > b_date[1]) {
        return -1;
    }
    // compare day
    if (a_date[2] < b_date[2]) {
        return 1;
    }
    if (a_date[2] > b_date[2]) {
        return -1;
    }

    // dates are equal; highest transaction_id first
    if (a[transaction_id_key] < b[transaction_id_key]) {
        return 1;
    }
    if (a[transaction_id_key] > b[transaction_id_key]) {
        return -1;
    }
    return 0;
}

// function to get the transactionJSONComparator allowing for different keys identifying the date and transaction_id in the JSON
export function getTransactionJSONComparator(date_key='date', transaction_id_key='transaction_id', is_approved_key='is_approved')
{
    return (a,b) => {return transactionJSONComparator(a, b, date_key, transaction_id_key, is_approved_key);};
}
