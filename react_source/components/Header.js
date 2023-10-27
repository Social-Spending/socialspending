import * as globals from '../utils/globals.js'

import { StyleSheet, View, Image, Text } from 'react-native';
import { Link } from "expo-router";
import { useState } from 'react';

import Button from './Button.js'

const Logo = require('../assets/images/logo/logo-64.png');
import Bell from '../assets/images/bxs-bell.svg';


export default function Header({ loggedIn, showNotif }) {
    return (
        <View style={styles.header}>

            <View style={styles.container}>
                <Link href="/" asChild>
                    <Image source={Logo} style={styles.logo} />
                </Link>

                <Links loggedIn={loggedIn} />

            </View>
            <Account loggedIn={loggedIn} showNotif={showNotif} />
        </View>
    );
}

function Links({ loggedIn }) {
    if (loggedIn) {
        return (
            <View style={styles.container}>

                <HeaderLink href="/groups" style={[globals.styles.h3, styles.text]}> Groups </HeaderLink>
                <HeaderLink href="/friends" style={[globals.styles.h3, styles.text]}> Friends </HeaderLink>

                <HeaderLink href="/faq" style={[globals.styles.h3, styles.text]}> FAQ </HeaderLink>
                <HeaderLink href="/about" style={[globals.styles.h3, styles.text]}> About </HeaderLink>

            </View>
        );
    } else {
        return (
            <View style={styles.container}>

                <HeaderLink href="/faq" style={[globals.styles.h3, styles.text]}> FAQ </HeaderLink>
                <HeaderLink href="/about" style={[globals.styles.h3, styles.text]}> About </HeaderLink>

            </View>
        );
    }
}

function Account({ loggedIn, showNotif }) {
    if (loggedIn) {
        return (
            <View style={styles.container}>
                <Button style={styles.notif} hoverStyle={styles.notif} svg={Bell} iconStyle={styles.bell} onClick={showNotif} />
                <HeaderText style={[globals.styles.h3, styles.text, { paddingLeft: '1em' }]}>$AccountName</HeaderText>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <HeaderLink href="/login" style={[globals.styles.h3, styles.text]}>Login</HeaderLink>
                <Text style={[ styles.text, { color: globals.COLOR_BEIGE }]}>|</Text>
                <HeaderLink href="/signup" style={[globals.styles.h3, styles.text]}>Signup</HeaderLink>
            </View>
        );
    }
}

function HeaderText(props) {
    const [hover, setHover] = useState(false);

    return (
        <Text style={[props.style, hover ? globals.styles.hover : {}]} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>{props.children}</Text>
    );
}

function HeaderLink(props) {
    const [hover, setHover] = useState(false);

    return (
        <Link style={[props.style, hover ? globals.styles.hover : {}]} href={props.href} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            {props.children}
        </Link>
    );
}



const styles = StyleSheet.create({
    header: {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        height: '5vh',
        minHeight: '2em',
        width: '100%',
        backgroundColor: globals.COLOR_BLUE,
        alignSelf: 'top',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',

        borderWidth: 1.5,
        borderTopStyle: 'none',
        borderRightStyle: 'none',
        borderLeftStyle: 'none',
        
    },
    container: {
        width: 'auto',
        height: '100%',
        paddingLeft: '1em',
        flexDirection: 'row',
        alignItems: 'center',

    },
    logo: {
        justifyContent: 'flex-start',
        height: '4.5vh',
        width: '4.5vh',
        minWidth: '2em',
        minHeight: '2em',
        borderRadius: 18,
    },
    text: {
        fontSize: '1.1em',
        fontWeight: '600',
        color: globals.COLOR_BEIGE,
        
        paddingRight: '.5em',
        paddingLeft: '.5em',

        paddingTop: '.275em',
        height: '2em',
        borderRadius: '2em',
    },
    notif: {
        width: '2em',
        minWidth: '2em',
        height: '2em',
        minHeight: '2em',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
    },
    bell: {
        width: '1.5em',
        minWidth: '1.5em',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        fill: globals.COLOR_BEIGE
    },
});
