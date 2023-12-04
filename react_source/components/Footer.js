import * as globals from '../utils/globals.js'

import { Text, View } from '../utils/globals.js';
import { Link } from "react-router-dom/dist/index.js";

export default function Footer() {
    return (

        <View style={styles.footer}>

            <Text style={styles.footerText}>Copyright ©2023 SocialSpending. All Rights Reserved.</Text>
            <View style={{flexDirection: 'row'}}>
                <Link to="/faq" style={styles.footerText}> FAQ </Link>
                <Link to="/about" style={styles.footerText}> About </Link>
                <Link to="/contact" style={styles.footerText}> Contact Us </Link>
            </View>

        </View>
    );
}

const styles = {
    footerText: {
        padding: '0em .5em',
        fontSize: '.85em',
        color: globals.COLOR_BEIGE
    },
    footer: {
        bottom: 0,
        zIndex: 1,
        width: '100%',
        height: '4vh',
        minHeight: '1.75em',
        backgroundColor: '#00000099',
        alignSelf: 'top',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: .8,
        flexDirection: 'row',
        paddingLeft: '1em',
        paddingRight: '1em'
    },
    

};