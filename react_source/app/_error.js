import * as globals from '../utils/globals.js'
import Base from '../components/Base.js';
import { Text, Image, View } from '../utils/globals.js';
import { useNavigate, useRouteError } from '../node_modules/react-router-dom/dist/index.js';
import Button from '../components/Button.js';

import { GlobalContextProvider } from '../components/GlobalContext.js';

import NotFound from '../assets/images/404.png';
import { useEffect, useRef } from 'react';

export default function Page() {
	let navigate = useNavigate();
	let error = useRouteError();
	if (error.status) {
		return (
			<GlobalContextProvider>
				<Base style={globals.styles.container} defaultDisplayNotif={false}>
					<View style={styles.notFound}>
						<Image source={NotFound} style={{ heigth: '30em', width: '30em' }} />
						<Text style={{ ...globals.styles.h1, ...{ color: globals.COLOR_ORANGE, padding: 0 } }}>Error 404 - Page Not Found</Text>
						<Text style={{ ...globals.styles.h3, ...{ color: globals.COLOR_GRAY, padding: '.5em', fontWeight: '600' } }}>The page you requested could not be found</Text>

						<Button id="notFound_return" tabIndex={0} style={{ ...globals.styles.formButton, ...{ width: '15em' } }} onClick={() => navigate("/")} >
							<label htmlFor="notFound_return" style={globals.styles.buttonLabel}>
								Return Home
							</label>
						</Button>

					</View>

				</Base>
			</GlobalContextProvider>
		);
	} else {
		const ref = useRef(null);
		useEffect(() => {
			ref.current.innerHTML = ref.current.innerHTML.replaceAll("\n", "<br/>");

		}, []);
		return (
			<>
				<div style={styles.devError}>
					<h1 style={{ padding: '0 0', color: 'red' }}>Error in {error.fileName} at {error.lineNumber}:{error.columnNumber}</h1>
					<h2 style={{ padding: '0 0', color: 'red' }}>{error.message}</h2>
					<div style={{ backgroundColor: "#333", width: 'min-content', padding: '1em' }}>
						<h2 style={{ color: 'white', width: 'max-content', padding: '0 ' }}>Stack Trace</h2>
						<p style={{color: 'white', width:'max-content'}} ref={ref}>{error.stack}</p>
					</div>
					
				</div>
				
			</>
		);
	}

	
}

const styles = {
	notFound: {
		width: '60em',
		minWidth: '25em',
		backgroundColor: globals.COLOR_WHITE,
		boxShadow: '0px 0px 5px 5px #eee',
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: '10vh',
		marginBottom: '10vh',
		padding: '1em'
	},
	devError: {
		backgroundColor: 'black',
		width: '100%',
		height: '100%',
		padding: '1em'
	}
};
