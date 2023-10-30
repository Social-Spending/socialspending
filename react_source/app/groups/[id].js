import * as globals from '../../utils/globals.js'

import { useLocalSearchParams } from 'expo-router';

import Base from '../../components/Base.js';
import GroupInfo from '../../components/GroupInfo.js';



export default function Page() {

    const slug = useLocalSearchParams();



    return (
        <Base style={[globals.styles.container, { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
            
            <GroupInfo id={slug.id} />
        </Base>
    );
}




