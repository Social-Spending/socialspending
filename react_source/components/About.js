import { Link } from '../node_modules/react-router-dom/dist/index.js';
import * as globals from '../utils/globals.js'
import { Text, View, Image } from '../utils/globals.js';

export default function Contact() {
    return (
        <View style={styles.aboutContainer}>
            <Text style={{...globals.styles.h1, textAlign: 'center', color: globals.COLOR_GRAY}}>About</Text>
			<Text style={styles.aboutText}>
				Social Spending was created by a team of five students as a school project at the University of Maryland: Baltimore County.
			</Text>
			<Text style={styles.aboutText}>
				Social Spending is a place to organize all your shared expenses in one location.
				We make it easy to keep track of debts between individuals or groups in any scenario,
				whether it be a dinner between friends, a girl's weekend, or simply paying someone back.
				We know that keeping track of a large group of people and how much they owe can get very complex when paying them back, even with software to help.
				This is why we added our expense reduction algorithm to automatically reduce the amount of transactions required to pay your debts and simply your life.
			</Text>
			<Text style={{ ...globals.styles.h1, textAlign: 'center', color: globals.COLOR_GRAY }}>Meet The Team</Text>
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
			"title": "Database Engineer"
		},
		{
			"name": "Matthew Frances",
			"github": "francesmatthew",
			"title": "Lead Back-End Developer"
		},
		{
			"name": "Nick Jones",
			"github": "joneslnick",
			"title": "Security Engineer"
		},
		{
			"name": "Brandon Tenorio",
			"github": "brandonjtnoguera",
			"title": "Developer"
		},
		{
			"name": "Ryder Reed",
			"github": "RyderReed15",
			"title": "Lead Front-End Developer"
		}
	]

	let elements = [];

	contacts.forEach((contact) => {
		elements.push(
			<View style={{ alignItems: 'center', flexDirection: 'column', width: 'auto' }}>
				<Link to={"https://github.com/" + contact.github}>
					<Image source={"https://github.com/" + contact.github + ".png"} style={{ ...globals.styles.listIcon, ...{ margin: '1em',height: '10em', width: '10em' } }} />
				</Link>
				<Text style={{ ...globals.styles.h3, ...{ color: globals.COLOR_GRAY, padding: 0 } }}>{contact.title}</Text>
				<Text style={{ ...globals.styles.h4, ...{ color: globals.COLOR_GRAY, padding: 0 } }}>{contact.name}</Text>
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
		justifyContent: 'space-between',
		alignSelf: 'flex-start',
		marginTop: '10vh',
		marginBottom: '10vh'
	},
    aboutContainer: {
        width: '80vh',
        minWidth: '25em',
        backgroundColor: '#FFF',
        boxShadow: '0px 0px 5px 5px #eee',
        borderRadius: 18,
        justifyContent: 'stretch',
        alignItems: 'stretch',
        alignSelf: 'flex-start',
        marginTop: '10vh',
        marginBottom: '10vh'
    },
	aboutText: {
		...globals.styles.text,
		fontSize: '1em',
        padding: '1em',
        textAlign: 'center'
	}
};
