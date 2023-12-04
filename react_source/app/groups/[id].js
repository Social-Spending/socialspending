import * as globals from '../../utils/globals.js'

import Base from '../../components/Base.js';
import GroupInfo from '../../components/GroupInfo.js';

import WaitForAuth from '../../components/WaitForAuth.js';
import { useParams } from 'react-router-dom/dist/index.js';


export default function Page() {
    const slug = useParams();

    return (
        <Base style={{ ...globals.styles.container, ...{ justifyContent: 'flex-start', alignItems: 'flex-start' } }}>
           <WaitForAuth redirectOnNotLoggedIn={'/login?origin=groups/' + slug.id}>
                <GroupInfo id={slug.id} />
           </WaitForAuth>
        </Base>
    );
}






