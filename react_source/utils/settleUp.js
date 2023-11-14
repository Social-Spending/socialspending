
export async function getSettleUpCandidatesList(user_id) {

    let payload = new URLSearchParams();
    payload.append('user_id', user_id);

    // do the GET request
    try {
        let response = await fetch("/settle_up.php?" + payload, { method: 'GET', credentials: 'same-origin' });

        if (response.ok) {
            return await response.json();
        } 
       
    }
    catch (error) {
        console.log("error in in GET request to candidates (/settle_up.php)");
        console.log(error);
    }

    return null;

}
