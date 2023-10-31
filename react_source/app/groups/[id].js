import * as globals from '../../utils/globals.js'

import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';

import Base from '../../components/Base.js';
import GroupInfo from '../../components/GroupInfo.js';
import VerifyAction from '../../components/VerifyAction.js';



export default function Page() {

    const slug = useLocalSearchParams();

    let json = null;

    useEffect(() => {
        // React advises to declare the async function directly inside useEffect
        // On load asynchronously request group
        async function getGroup() {

            //Add group id and set brief to false to get full info
            let payload = new URLSearchParams();
            payload.append('brief', false);
            payload.append('groupID', slug.id);

            // do the GEt request
            try {
                let response = await fetch("/groups.php?" + payload, { method: 'GET', credentials: 'same-origin' });

                if (response.ok) {
                    json = response.json();
                }
                else {
                    router.replace("/groups");
                }
            }
            catch (error) {
                console.log("error in in GET request to groups (/groups.php)");
                console.log(error);
            }
        }
        getGroup();

    }, []);

    const [modal, setModal] = useState(null);

    const verifyLeave = () => {
        setModal(<VerifyAction label="Are you sure you want to leave this group?" accept={() => leaveGroup(slug.id)} reject={() => setModal(null)} exit={() => setModal(null)} />)
    }

    return (
        <>
            <Base style={[globals.styles.container, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
            
                <GroupInfo id={slug.id} json={json} leave={verifyLeave} />
            </Base>
            {modal}
        </>
    );
}

async function leaveGroup(id) {
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
            let responseJSON = await response.json();
            errorRef.current.innerText = responseJSON['message'];
            errorRef.current.classList.remove('hidden');
        }
    }
    catch (error) {
        console.log("error in POST request to groups (/groups.php)");
        console.log(error);
    }
}




