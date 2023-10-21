import * as globals from '../utils/globals.js'

import { StyleSheet, View, Pressable, Text, Image } from 'react-native';

import { useState } from 'react';



export default function Button({ label, style, hoverStyle, iconStyle, icon, svg, onClick, disabled }) {
    const [hover, setHover] = useState(false);

    return (
        
        <Pressable style={[styles.button, style]} onPress={onClick} disabled={disabled} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <View style={[styles.button, hoverStyle, disabled ? globals.styles.disabled : (hover ? globals.styles.hover : {})]} >
            
                <Icon svg={svg} style={iconStyle} icon={icon} />
                <ButtonText disabled={disabled} label={label} />
            </View>
           
        </Pressable>
        
    );
}

function Icon(props) {
    if (props.svg) {
        return (
            <props.svg style={[styles.icon, props.style]} />
        );
    }
    else if (props.icon) {
        return (
            <Image source={props.icon} style={[styles.icon, props.style]} />
        );
    } else {
        return;
    }
}

function ButtonText(props) {
    if (props.label) {
        return (
            <Text style={[globals.styles.h5, props.disabled ? styles.buttonLabelDisabled : styles.buttonLabel ]} >{props.label}</Text>
        );
    } else {
        return;
    }
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        color: globals.COLOR_WHITE,
    },
    buttonLabelDisabled: {
        color: '#dfdfdf',
    },
    icon: {
        aspectRatio: 1,
        justifyContent: 'flex-start',
        height: '100%',
    },
});
