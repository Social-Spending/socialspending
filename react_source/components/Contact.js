import * as globals from '../utils/globals.js'
import { Text, View, Image } from '../utils/globals.js';

import { Link } from '../node_modules/react-router-dom/dist/index.js';

export default function Contact() {
	return (

        <View style={styles.contactContainer}>
			<Text style={{ ...globals.styles.h1, textAlign: 'center', color: globals.COLOR_GRAY }}>Contact Us</Text>
			<View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1em' }}>
				{generateContacts()}
			</View>
			
        </View>
    );
}

function generateContacts() {
	let contacts = [
		{
			"name": "Matthew Duphily",
			"github": "Roasted715Jr",
			"email": "fg53416@umbc.edu"
		},
		{
			"name": "Matthew Frances",
			"github": "francesmatthew",
			"email": "mfrance2@umbc.edu"
		},
		{
			"name": "Nick Jones",
			"github": "joneslnick",
			"email": "njones9@umbc.edu"
		},
		{
			"name": "Brandon Tenorio",
			"github": "brandonjtnoguera",
			"email": "is83652@umbc.edu"
		},
		{
			"name": "Ryder Reed",
			"github": "RyderReed15",
			"email": "rreed2@umbc.edu"
		}
	]   

	let elements = [];

	contacts.forEach((contact) => {
		elements.push(
			<View style={{ alignItems: 'center', flexDirection: 'column', width: 'auto' }}>
				<Link to={"https://github.com/" + contact.github}>
					<Image source={"https://github.com/" + contact.github + ".png"} style={{ ...globals.styles.listIcon, ...{ height: '10em', width: '10em' } }} />
				</Link>
				
				<Text style={{ ...globals.styles.h3, ...{ color: globals.COLOR_GRAY, padding: 0 } }}>{contact.name}</Text>
				<Link to={"mailto:" + contact.email} style={{ ...globals.styles.h3, ...{ color: globals.COLOR_ORANGE, marginBottom: '1em' } }}>{contact.email}</Link>
			</View>
		);
	});

	return elements;
}

const styles = {
    contactContainer: {
        width: '45em',
        minWidth: '25em',
        backgroundColor: globals.COLOR_WHITE,
        boxShadow: '0px 0px 5px 5px #eee',
		borderRadius: 18,
        justifyContent: 'center',
        alignSelf: 'flex-start',
        marginTop: '10vh',
        marginBottom: '10vh'
    }
};
