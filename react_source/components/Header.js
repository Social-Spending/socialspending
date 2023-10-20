

import { StyleSheet, Text, View, Image } from 'react-native';
import { Link } from "expo-router";


import Button from './Button.js'

import { HeaderLink, HeaderText } from './TextComponents.js'


const Logo = require('../assets/images/logo/logo-64.png');
import Bell from '../assets/images/bxs-bell.svg';


export default function Header({ loggedIn, showNotif }) {
    return (
        <View style={styles.header}>

            <View style={styles.leftContainer}>
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
            <View style={styles.links}>

                <HeaderLink size={3} href="/groups" style={styles.text}> Groups </HeaderLink>
                <HeaderLink size={3} href="/friends" style={styles.text}> Friends </HeaderLink>

                <HeaderLink size={3} href="/faq" style={styles.text}> FAQ </HeaderLink>
                <HeaderLink size={3} href="/about" style={styles.text}> About </HeaderLink>

            </View>
        );
    } else {
        return (
            <View style={styles.links}>

                <HeaderLink size={3} href="/faq" style={styles.text}> FAQ </HeaderLink>
                <HeaderLink size={3} href="/about" style={styles.text}> About </HeaderLink>

            </View>
        );
    }
}

function Account({ loggedIn, showNotif }) {
    if (loggedIn) {
        return (
            <View style={styles.rightContainer}>
                <Button svg={Bell} iconStyle={styles.notif} onClick={showNotif} />
                <HeaderText size={3} style={[styles.text, { paddingLeft: '1em' }]}>$AccountName</HeaderText>
            </View>
        );
    } else {
        return (
            <View style={styles.rightContainer}>
                <HeaderLink size={3} href="/login" style={styles.text}>Login</HeaderLink>
                <HeaderText size={3} style={{ color: '#f9f7f3' }}>|</HeaderText>
                <HeaderLink size={3} href="/signup" style={styles.text}>Signup</HeaderLink>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    header: {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        height: '5vh',
        minHeight: '2em',
        width: '100%',
        backgroundColor: '#0FA3B1',
        alignSelf: 'top',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',

        borderWidth: 1.5,
        borderTopStyle: 'none',
        borderRightStyle: 'none',
        borderLeftStyle: 'none',
        
    },
    leftContainer: {
        width: 'auto',
        height: '100%',
        paddingLeft: '1em',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    rightContainer: {
        width: 'auto',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    logo: {
        justifyContent: 'flex-start',
        height: '4.5vh',
        width: '4.5vh',
        minWidth: '2em',
        borderRadius: 18,
    },
    links: {
        flex: 1,
        height: '100%',
        width: 'auto',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

        paddingLeft: '1em',
    },
    text: {
        fontSize: '1.1em',
        fontWeight: '600',
        color: '#f9f7f3',
        paddingRight: '.5em',
        paddingLeft: '.5em'
    },
    notif: {
        width: '3vh',
        minWidth: '1.5em',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        fill: '#f9f7f3'
    },
});