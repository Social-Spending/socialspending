import * as globals from '../utils/globals.js'

import { View, Text, Image } from '../utils/globals.js'

import { ReactSVG } from 'react-svg';

import { useState } from 'react';



export default function Button({ label, style, hoverStyle, iconStyle, textStyle, icon, svg, onClick, disabled }) {
    const [hover, setHover] = useState(false);

    return (
        
        <button style={{ ...styles.button, ...style}} onClick={onClick} disabled={disabled} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <View style={{ ...styles.button, ...hoverStyle, ...(disabled ? globals.styles.disabled : (hover ? globals.styles.hover : {}))}} >
            
                <Icon svg={svg} style={iconStyle} icon={icon} />
                <ButtonText disabled={disabled} label={label} style={textStyle} />
            </View>
           
        </button>
        
    );
}

function Icon(props) {
    if (props.svg) {
        return (
            <ReactSVG
                beforeInjection={(svg) => {
                    svg.setAttribute('fill', 'current');
                    svg.setAttribute('height', '100%');
                    svg.setAttribute('width', '100%');
                }}
                src={props.svg}
                style={{ ...styles.icon, ...props.style }} />
        );
    }
    else if (props.icon) {
        return (
            <Image source={props.icon} style={{ ...styles.icon, ...props.style}} />
        );
    } else {
        return;
    }
}

function ButtonText(props) {
    if (props.label) {
        return (
            <Text style={{ ...globals.styles.h4, ...(props.disabled ? styles.buttonLabelDisabled : styles.buttonLabel), ...props.style}} >{props.label}</Text>
        );
    } else {
        return;
    }
}

const styles = {
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
};
