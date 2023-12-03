import * as globals from '../utils/globals.js'
import { Text, View } from '../utils/globals.js';

export default function Contact() {
    return (
        <View style={styles.aboutContainer}>
            <Text style={{...globals.styles.h2, textAlign: 'center', color: globals.COLOR_GRAY}}>About</Text>
			<Text style={styles.aboutText}>
				Social Spending was created as a project for CMSC 447 at UMBC.
			</Text>
			<Text style={styles.aboutText}>Test</Text>
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
