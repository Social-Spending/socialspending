import * as globals from '../utils/globals.js'

import { StyleSheet, Text, View } from 'react-native';
import { Link, router } from "expo-router";

export default function Footer() {
    return (

        <View style={styles.footer}>

            <Text style={{ color: globals.COLOR_BEIGE }}>Copyright SocialSpending© 2023</Text>
            <View style={{flexDirection: 'row'}}>
                <Link href="/faq" style={{color: globals.COLOR_BEIGE}}> FAQ </Link>
                <Link href="/about" style={{color: globals.COLOR_BEIGE}}> About </Link>
                <Link href="/contact" style={{color: globals.COLOR_BEIGE}}> Contact Us </Link>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
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
    

});