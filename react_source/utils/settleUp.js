
export async function getSettleUpCandidatesList(user_id, setErrorMsg) {

    let payload = new URLSearchParams();
    payload.append('user_id', user_id);

    // do the GET request
    try {
        let response = await fetch("/settle_up.php?" + payload, { method: 'GET', credentials: 'same-origin' });

        let responseJSON = await response.json();
        if (response.ok) {
            return responseJSON;
        }
        else if (responseJSON) {
            setErrorMsg(responseJSON['message']);
        }

    }
    catch (error) {
        console.log("error in in GET request to settle_up.php");
        console.log(error);
    }

    return null;
}

// get a string to display for a given candidate settle-up json object
export function getDisplayStringForCandidate(candidate) {
    /* example candidate:
    {
        "amount" => 13,
        "length" => 2,
        "chain" => [
            {
                "user_id" => 4,
                "username" => "user4"
            },
            {
                "user_id" => 9,
                "username" => "user9"
            },
        ]
    }
    */

    let retStr = "";
    retStr += '$' + (candidate.amount / 100).toFixed(2) + ' to ' + candidate.chain[candidate.length - 1].username;

    return retStr;
}
