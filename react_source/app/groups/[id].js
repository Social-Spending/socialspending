import * as globals from '../../utils/globals.js'

import { useLocalSearchParams, router } from 'expo-router';

import Base from '../../components/Base.js';
import GroupInfo from '../../components/GroupInfo.js';

import { getGroupInfo, leaveGroup } from "../../utils/groups.js"

import LoggedInRedirect from '../../components/LoggedInRedirect.js';


export default function Page() {
    const slug = useLocalSearchParams();

    return (
        <Base style={[globals.styles.container, { justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
            <LoggedInRedirect onLoggedIn={false} target={'/login'} />
            <GroupInfo id={slug.id} />
        </Base>
    );
}






