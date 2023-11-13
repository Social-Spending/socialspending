import * as globals from "../utils/globals.js";

import { Text, View } from '../utils/globals.js';
import { useState } from 'react';

import Button from './Button.js';


import LeftChevron from '../assets/images/bx-chevrons-left.svg';
import RightChevron from '../assets/images/bx-chevrons-right.svg';
import SVGIcon from "./SVGIcon.js";

export default function Sidebar(props) {

    const [open, setOpen] = useState(true);
    
    return (
        <View style={{ ...styles.sidebar, ...{ width: open ? '15em' : '2em' }}} >
            <View style={{ flexDirection: 'row', width: '100%'}}>
                <Text style={{ ...globals.styles.h3, ...styles.title, ...open ? {} : { display: 'none' }}}>{props.title}</Text>
                <Button style={styles.button} onClick={() => setOpen(!open)} >
                    <SVGIcon src={LeftChevron} style={{ ...styles.buttonIcon, ...{ transform: open ? '' : 'rotate(180deg)' } }}/>
                </Button>
            </View>
            <View style={{ ...{ width: '15em' }, ...{ display: open ? 'block' : 'none' }}}>

                {props.children}
            </View>

        </View>
    );

}

const styles = {
    sidebar: {
        height: '100%',
        zIndex: 1,
        top: 0,
        left: 0,
        width: '15em',
        backgroundColor: globals.COLOR_BEIGE,
        overflowX: 'hidden',
        alignSelf: 'flex-start',
        transition: '500ms',
        scrollbarWidth: 'thin',
        borderStyle: 'none',
        borderRightStyle: 'solid',
        borderWidth: 2,
        borderColor: globals.COLOR_LIGHT_GRAY
    },
    button: {
        width: '2em',
        height: '2em',
        right: 0,
        position: 'absolute'
    },
    buttonIcon: {
        transition: '500ms',
        fill: globals.COLOR_GRAY,

    },
    title: {
        color: globals.COLOR_GRAY,
        paddingTop: 0,
        marginTop: '.05em',
    }
};