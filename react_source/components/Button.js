import { StyleSheet, View, Pressable, Text, Image } from 'react-native';

import { HeaderLink, HeaderText } from './TextComponents.js'



export default function Button({ label, style, icon, svg, iconStyle, onClick, disabled }) {
    return (
        <View style={style}>
            <Pressable style={styles.button} onPress={onClick} disabled={disabled}>
                <Icon svg={svg} style={iconStyle} icon={icon} />
                <ButtonText label={label} />
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
            <HeaderText size={5} style={styles.buttonLabel}>{props.label}</HeaderText>
        );
    } else {
        return;
    }
}

const styles = StyleSheet.create({
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
    icon: {
        aspectRatio: 1,
        justifyContent: 'flex-start',
        height: '100%',
        borderRadius: 18,
    },
});
