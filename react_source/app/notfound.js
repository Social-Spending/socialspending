import * as globals from '../utils/globals.js'
import Base from '../components/Base.js';
import { Text, Image, View } from '../utils/globals.js';
import { useNavigate } from '../node_modules/react-router-dom/dist/index.js';
import Button from '../components/Button.js';

import NotFound from '../assets/images/404.png';

export default function Page() {
	let navigate = useNavigate();

	return (
		<Base style={globals.styles.container} defaultDisplayNotif={false}>
			<View style={styles.notFound}>
				<Image source={NotFound} style={{heigth: '30em', width: '30em'}} />
				<Text style={{ ...globals.styles.h1, ...{ color: globals.COLOR_ORANGE, padding: 0 } }}>Error 404 - Page Not Found</Text>
				<Text style={{ ...globals.styles.h3, ...{ color: globals.COLOR_GRAY, padding: '.5em', fontWeight: '600' } }}>The page you requested could not be found</Text>

				<Button id="notFound_return" tabIndex={0} style={{...globals.styles.formButton, ...{width: '15em'}} } onClick={() => navigate("/")} >
					<label htmlFor="notFound_return" style={globals.styles.buttonLabel}>
						Return Home
					</label>
				</Button>

			</View>
			
			
		</Base>
	);
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
	}
};
