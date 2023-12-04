import * as globals from '../utils/globals.js'
import { Text, View } from '../utils/globals.js';

import { useEffect, useState } from 'react';

import DownChevron from '../assets/images/bx-chevron-down.svg';
import Button from './Button.js';
import SVGIcon from './SVGIcon.js';

export default function Contact() {
    return (
        <View style={styles.contactContainer}>
            <Text style={{...globals.styles.h2, textAlign: 'center', color: globals.COLOR_GRAY}}>Contact</Text>

			{generateContacts()}
        </View>
    );
}

function generateContacts() {
	let contacts = [
		{
			"name": "Matthew Duphily",
			"email": "fg53416@umbc.edu"
		},
		{
			"name": "Matthew Frances",
			"email": "mfrance2@umbc.edu"
		},
		{
			"name": "Nick Jones",
			"email": "njones9@umbc.edu"
		},
		{
			"name": "Brandon Tenorio",
			"email": "is83652@umbc.edu"
		},
		{
			"name": "Ryder Reed",
			"email": "rreed2@umbc.edu"
		}
	]   

	let elements = [];

	contacts.forEach((contact) => {
		elements.push(
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
				<Text style={globals.styles.h3}>{contact.name}</Text>
				<a style={globals.styles.h3} href={"mailto:" + contact.email}>{contact.email}</a>
			</View>
		);
	});

	return elements;
}

const styles = {
    contactContainer: {
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
    }
};
