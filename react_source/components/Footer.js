import * as globals from '../utils/globals.js'

import { StyleSheet, Text, View } from 'react-native';

export default function Footer() {
    return (

        <View style={styles.footer}>

            <Text style={{ color: globals.COLOR_BEIGE }}>Copyright SocialSpending© 2023</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
        width: '100%',
        height: '4vh',
        minHeight: '1.75em',
        backgroundColor: '#00000099',
        alignSelf: 'top',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: .8
    },
    

});