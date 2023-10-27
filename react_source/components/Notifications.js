import * as globals from '../utils/globals.js'

import { StyleSheet, View } from 'react-native';
import { useState } from 'react';

export default function Notifications() {
	return (
		<View>
			<h1 style={styles.header}>Friend Requests</h1>
			<p>Friend request from x</p>
			<h1 style={styles.header}>Awaiting Approval</h1>
			<p>Transaction name</p>
			<button>View</button>
			<button>Accept</button>
			<button>Reject</button>
			<h1 style={styles.header}>Completed Transactions</h1>
			<p>Transaction name</p>
			<button>View</button>
		</View>
	);
}

let button_style = globals.styles.formButton;

const styles = StyleSheet.create({
	header: {
        padding: '0.2em',
        fontSize: '2em',
        fontWeight: 'bolder',
		color: globals.COLOR_WHITE
	},
	body: {
		color: globals.COLOR_WHITE
	},
	button: {

	}
});
