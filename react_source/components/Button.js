import { StyleSheet, View, Pressable, Text, Image } from 'react-native';

import { useState } from 'react';

import { HeaderLink, HeaderText } from './TextComponents.js'



export default function Button({ label, style, icon, svg, iconStyle, onClick, disabled }) {
    const [hover, setHover] = useState(false);

    return (
        <View style={style}>
            <Pressable style={[styles.button, disabled ? styles.disabled : (hover ? styles.hover : {})]} onPress={onClick} disabled={disabled} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                <Icon svg={svg} style={iconStyle} icon={icon} />
                <ButtonText disabled={disabled} label={label} />
            </Pressable>
        </View>
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
            <HeaderText size={5} style={props.disabled ? styles.buttonLabelDisabled : styles.buttonLabel }>{props.label}</HeaderText>
        );
    } else {
        return;
    }
}

const styles = StyleSheet.create({
    disabled: {
        backgroundColor: "#66666633",
        borderRadius: 10,
    },
    hover: {
        backgroundColor: "#cccccc55",
        borderRadius: 10,
    },
    button: {
        borderRadius: 10,
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
        color: '#FFF',
    },
    buttonLabelDisabled: {
        color: '#ccc',
    },
    icon: {
        aspectRatio: 1,
        justifyContent: 'flex-start',
        height: '100%',
        borderRadius: 18,
    },
});
