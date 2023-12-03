import * as globals from '../utils/globals.js'
import { Text, View } from '../utils/globals.js';

export default function Contact() {
    return (
        <View style={styles.aboutContainer}>
            <Text style={{...globals.styles.h2, textAlign: 'center', color: globals.COLOR_GRAY}}>About</Text>
			<Text style={styles.aboutText}>
				Social Spending was created as a project for CMSC 447 at UMBC.
			</Text>
			<Text style={styles.aboutText}>
				Social Spending aims to improve upon other ledger software, such as Splitwise.
				These apps allow people to keep track of shared expenses between individuals or groups,
				then later pay back their creditors.
                Social Spending is different in the way that we allow users to pay their creditor's creditor directly.
                The effect this has is reducing the number of transactions for some individuals, as well as reducing the amount owed for others.
			</Text>
        </View>
    );
}

const styles = {
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
		padding: '1em'
	}
};
