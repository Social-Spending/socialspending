import * as globals from '../utils/globals.js'

import { View, Image, Text } from '../utils/globals.js';
import { Link } from "react-router-dom/dist/index.js";
import { useState, useContext } from 'react';

import Button from './Button.js'

import RingingBell from '../assets/images/bxs-bell-ring.svg';
import Logo from '../assets/images/logo/logo-64.png';
import Bell from '../assets/images/bxs-bell.svg';

import {GlobalContext} from './GlobalContext.js';
import { ModalContext } from '../modals/ModalContext.js';
import NewExpense from '../modals/NewExpense.js';
import SVGIcon from './SVGIcon.js';

export default function Header({showNotif, isNotifShown, areNotifs }) {
    return (
        <View style={styles.header}>

            <View style={styles.container}>
                <Link to="/">
                    <Image source={Logo} style={styles.logo} />
                </Link>

                <Links />

            </View>
            <Account showNotif={showNotif} isNotifShown={isNotifShown} areNotifs={areNotifs} />
        </View>
    );
}

function Links(props) {
    const {isLoggedIn} = useContext(GlobalContext);
    if (isLoggedIn) {
        return (
            <View style={styles.container}>

                <HeaderLink href="/groups" style={{ ...globals.styles.h3, ...styles.text}}> Groups </HeaderLink>
                <HeaderLink href="/friends" style={{ ...globals.styles.h3, ...styles.text}}> Friends </HeaderLink>

            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <HeaderLink href="/about" style={{ ...globals.styles.h3, ...styles.text}}> About </HeaderLink>
                <HeaderLink href="/faq" style={{ ...globals.styles.h3, ...styles.text}}> FAQ </HeaderLink>
            </View>
        );
    }
}

function Account({ showNotif, isNotifShown, areNotifs }) {
    const { isLoggedIn, currUsername, currUserIconPath, doSignout } = useContext(GlobalContext);
    const { pushModal, popModal } = useContext(ModalContext);
    if (isLoggedIn) {
        return (
            <View style={styles.container}>
                <Button id="header_newExpense" style={styles.newExpense} hoverStyle={styles.newExpense} onClick={() => pushModal(<NewExpense />)} >
                    <label htmlFor="header_newExpense" style={globals.styles.buttonLabel }>
                        + NEW EXPENSE
                    </label>
                </Button>
                <Button aria-label="Show/Hide Notifications" style={styles.notif} hoverStyle={styles.notif} onClick={showNotif} >
                    <SVGIcon src={Bell} style={styles.bell} />
                    {areNotifs ? <Text style={styles.notifBadge}>!</Text> : <></>}
                </Button>
                <HeaderLink aria-label="Profile" href="/profile/" style={{marginLeft: '1em'}} >
                    <View style={styles.headerIconAndUsernameContainer} >
                        <Image
                            style={styles.headerUserIcon}
                            source={currUserIconPath !== null ? decodeURI(currUserIconPath) : globals.getDefaultUserIcon(currUsername)}
                        />
                        <Text style={{ ...styles.text, ...{marginLeft: '.5em'}}} >{currUsername}</Text>
                    </View>
                </HeaderLink>
                <Text style={{ ...styles.text, ...{ padding: '0', color: globals.COLOR_BEIGE } }}>|</Text>
                <Button id="header_signout" style={{ width: 'auto', padding: 0 }} hoverStyle={{...{ width: 'auto', padding:0}}} onClick={doSignout} >
                    <label htmlFor="header_signout" style={{ ...globals.styles.buttonLabel, ...{ fontWeight: '600', fontSize: '1.05em' } }}>
                        Signout
                    </label>
                </Button>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <HeaderLink href="/login" style={{ ...globals.styles.h3, ...styles.text}}>Login</HeaderLink>
                <Text style={{ ...styles.text, ...{ paddingHorizontal: '0', color: globals.COLOR_BEIGE }}}>|</Text>
                <HeaderLink href="/signup" style={{ ...globals.styles.h3, ...styles.text}}>Signup</HeaderLink>
            </View>
        );
    }
}

function HeaderText(props) {
    const [hover, setHover] = useState(false);

    return (
        <Text {...props} style={{ ...props.style, ...hover ? globals.styles.hover : {}}} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={props.onClick}>{props.children}</Text>
    );
}

function HeaderLink(props) {
    const [hover, setHover] = useState(false);

    return (
        <Link {...props} style={{ ...props.style, ...hover ? globals.styles.hover : {}}} to={props.href} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            {props.children}
        </Link>
    );
}


const styles = {
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
        paddingRight: '1em',
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
        borderRadius: '50%',
    },
    text: {
        fontSize: '1.1em',
        fontWeight: '600',
        color: globals.COLOR_BEIGE,

        padding: '.25em .5em',
        
        borderRadius: '2em',
    },
    notif: {
        width: '2em',
        minWidth: '2em',
        height: '2em',
        minHeight: '2em',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%'
    },
    notifBadge: {
        backgroundColor: globals.COLOR_ORANGE,
        width: '60%',
        height: '60%',
        borderRadius: '50%',
        borderWidth: '1px',
        borderColor: globals.COLOR_BLUE,
        position: 'absolute',
        top: '0%',
        left: '40%',
        color: globals.COLOR_WHITE,
        fontSize: '.75em',
        fontWeight: 'bolder',
        fontFamily: 'Segoe UI',
        textAlign: 'center'
    },
    newExpense: {
        height: '2em',
        width: '13em',
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
    headerIconAndUsernameContainer: {
        padding: '.25em .5em',
        flexDirection: 'row',
        justifyContent: 'right',
        alignItems: 'center'
    },
    headerUserIcon: {
        padding: 0,
        borderRadius: '50%',
        width: '1.85em',
        height: '1.85em'
    }
};
