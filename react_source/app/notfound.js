import * as globals from '../utils/globals.js'

import { useContext } from 'react';
import { Navigate } from "react-router-dom";

import { GlobalContext } from '../components/GlobalContext.js';

import "../utils/global.css"
import Loading from '../components/Loading.js';



export default function Page() {
	return (
        // <Base style={globals.styles.container} defaultDisplayNotif={true}>
			<h1>404</h1>
		// </Base>
	);
}

const styles = {
    summaryContainer: {
        width: '100%',
        flex: 1,
        backgroundColor: globals.COLOR_BEIGE,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryComponentSeparator: {
        marginTop: '4vh'
    }

};
