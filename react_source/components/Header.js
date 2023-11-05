import * as globals from '../utils/globals.js'

import { StyleSheet, View, Image, Text } from 'react-native';
import { Link } from "expo-router";
import { useState, useContext } from 'react';

import Button from './Button.js'

const Logo = require('../assets/images/logo/logo-64.png');
import Bell from '../assets/images/bxs-bell.svg';

import {GlobalContext} from './GlobalContext.js';
import { ModalContext } from '../modals/ModalContext.js';

import NewExpense from '../modals/NewExpense.js';

export default function Header({showNotif }) {
    return (
        <View style={styles.header}>

            <View style={styles.container}>
                <Link href="/" asChild>
                    <Image source={Logo} style={styles.logo} />
                </Link>

                <Links />

            </View>
            <Account showNotif={showNotif} />
        </View>
    );
}

function Links(props) {
    const {isLoggedIn} = useContext(GlobalContext);
    if (isLoggedIn) {
        return (
            <View style={styles.container}>

                <HeaderLink href="/groups" style={[globals.styles.h3, styles.text]}> Groups </HeaderLink>
                <HeaderLink href="/friends" style={[globals.styles.h3, styles.text]}> Friends </HeaderLink>

            </View>
        );
    } else {
        return (
            <View style={styles.container}>

            </View>
        );
    }
}

function Account({ showNotif }) {
    const { isLoggedIn, currUsername, doSignout } = useContext(GlobalContext);
    const setModal = useContext(ModalContext);

    if (isLoggedIn) {
        return (
            <View style={styles.container}>
                <Button style={styles.newExpense} hoverStyle={styles.newExpense} textStyle={globals.styles.h4} label="+ NEW EXPENSE" onClick={() => setModal(<NewExpense/>)} />
                <Button style={styles.notif} hoverStyle={styles.notif} svg={Bell} iconStyle={styles.bell} onClick={showNotif} />
                <HeaderText style={[globals.styles.h3, styles.text, { marginLeft: '1em' }]}>{currUsername}</HeaderText>
                <Text style={[styles.text, { paddingHorizontal: '0', color: globals.COLOR_BEIGE }]}>|</Text>
                <HeaderText style={[globals.styles.h3, styles.text, {cursor: 'pointer'}]} onClick={doSignout}>Signout</HeaderText>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <HeaderLink href="/login" style={[globals.styles.h3, styles.text]}>Login</HeaderLink>
                <Text style={[styles.text, { paddingHorizontal: '0', color: globals.COLOR_BEIGE }]}>|</Text>
                <HeaderLink href="/signup" style={[globals.styles.h3, styles.text]}>Signup</HeaderLink>
            </View>
        );
    }
}

function HeaderText(props) {
    const [hover, setHover] = useState(false);

    return (
        <Text style={[props.style, hover ? globals.styles.hover : {}]} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={props.onClick}>{props.children}</Text>
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
        paddingHorizontal: '1em',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

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

        paddingHorizontal: '.5em',
        paddingVertical: '.25em',
        
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
    newExpense: {
        height: '2em',
        width: '10em',
        margin: 0,
        marginRight: '1em',
        borderRadius: '2em'
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
