import * as globals from '../utils/globals.js'

import { View } from '../utils/globals.js'

import { useState } from 'react';



export default function Button(props) {
    const [hover, setHover] = useState(false);
    const { hoverStyle, ...otherProps } = props;
    return (
        
        <button {...otherProps} tabIndex={props.tabIndex ? props.tabIndex : -1} style={{...styles.button, ...props.style, ...{ cursor: props.disabled ? 'default' : 'pointer' }}} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <View style={{ ...styles.button, ...hoverStyle, ...{zIndex: 1}, ...(props.disabled ? globals.styles.disabled : (hover ? globals.styles.hover : {}))}} >
            
                {props.children}
            </View>
           
        </button>
        
    );
}

const styles = {
    button: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: '.25em',
    },
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabelDisabled: {
        color: '#dfdfdf',
    },
    icon: {
        aspectRatio: 1,
        height: '100%',
    },
};
