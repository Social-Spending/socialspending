import * as globals from '../utils/globals.js'

import { View, Text } from '../utils/globals.js'

import { useEffect, useRef, useState } from 'react';
import { debounce } from '../utils/userSearch.js';
import useWindowDimensions from '../utils/windowSize.js';



export default function Tooltip(props) {

    const { windowHeight } = useWindowDimensions();

    const textRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [below, setBelow] = useState(true);

    const onHover = debounce((event) => {
        setVisible(event.type === "mouseover");
        let rect = event.target.getBoundingClientRect();
        setBelow(!(rect.bottom + rect.height > windowHeight));
    });
    
    useEffect(() => {
        textRef.current.parentNode.addEventListener("mouseover", onHover);
        textRef.current.parentNode.addEventListener("mouseout", onHover);
        return () => {
            if (textRef.current && textRef.current.parentNode) textRef.current.parentNode.removeEventListener("mouseover", onHover);
            if (textRef.current && textRef.current.parentNode) textRef.current.parentNode.removeEventListener("mouseout", onHover);
        }
    }, [windowHeight])

    return (

        <Text ref={textRef} style={{ ...styles.tooltip, ...{ top: below ? 'calc(.5em + 100%)' : "calc(-.5em - 100%)", display: visible ? "inherit" : "none"}}} >
            {props.children}
        </Text>
                
                

    );
}

const styles = {
    tooltip: {
        ...globals.styles.text,

        position: 'absolute',
        width: 'max-content',
        zIndex: 10,

        backgroundColor: globals.COLOR_WHITE,
        borderRadius: '.25em',
        padding: '0 .25em',

    }
};
