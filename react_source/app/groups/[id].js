import * as globals from '../../utils/globals.js'

import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';

import Base from '../../components/Base.js';
import GroupInfo from '../../components/GroupInfo.js';



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

    return (
        <Base style={[globals.styles.container, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
            
            <GroupInfo id={slug.id} json={json} />
        </Base>
    );
}




