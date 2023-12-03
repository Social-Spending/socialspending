import * as globals from '../utils/globals.js'
import Base from '../components/Base.js';
import Button from '../components/Button.js';
import { Text, View, Modal } from '../utils/globals.js';

export default function Page() {
	return (
        <Base style={globals.styles.container} defaultDisplayNotif={false}>
			<Text style={globals.styles.h1}>Page Not Found</Text>
			{/* <Button style={globals.styles.formButton} onclick={history.back()}>Go Back</Button> */}
		</Base>
	);
}
