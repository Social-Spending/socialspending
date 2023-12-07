import * as globals from '../utils/globals.js'

import { View, Text } from '../utils/globals.js'

import { useEffect, useRef, useState } from 'react';
import { debounce } from '../utils/userSearch.js';
import useWindowDimensions from '../utils/windowSize.js';
import { createPortal } from 'react-dom';



export default function Tooltip(props) {

    const { windowHeight } = useWindowDimensions();

    const parentRef = useRef(null);
    const childRef = useRef(null);

    const [visible, setVisible] = useState(false);
    const [width, setWidth] = useState(0);

    const onHover = debounce((event) => {
        
        setVisible(event.type === "mouseover");
    });

    
    useEffect(() => {
        //Only update if parent changes states (becomes visible) and width is not set
        if (childRef.current && width == 0) {
            let w = childRef.current.getBoundingClientRect().width;
            if (w) {
                setWidth(w);
            }
        }  
    });

    useEffect(() => {
        //Force a width remeasure 
        //This is so inefficient but I dont know if there is another way
        if(!childRef.current) setWidth(0);
    }, [props.children]);

    useEffect(() => {
        if (childRef.current) parentRef.current = childRef.current.parentNode;

        // Only add event listeners when width has changed ie. parent is not null and is visible
        if (parentRef.current) {
            parentRef.current.addEventListener("mouseover", onHover);
            parentRef.current.addEventListener("mouseout", onHover);
            return () => {
                parentRef.current.removeEventListener("mouseover", onHover);
                parentRef.current.removeEventListener("mouseout", onHover);
            }
        }

    }, [width]);

    if (parentRef.current && width) {

        if (visible) {

            let rect = parentRef.current.getBoundingClientRect();
            let below = !(rect.bottom + rect.height > windowHeight);

            //Add position of parent minus half length of text plus padding
            let x = `max(1em, min(100vw - ${width}px - 1em, ${rect.left + rect.width / 2}px - ${width / 2}px))`;
            let y = below ? `calc(${rect.bottom}px + .5em)` : `calc(${ rect.top }px - 2em)`;

            return createPortal(

                <Text style={{ ...styles.tooltip, ...{ top: y, left: x } }} >
                    {props.children}
                </Text >,

                document.body);
        } else {

            return (<></>);
        }
        
    } else {
        return (

            <Text ref={childRef} style={styles.tooltipTemp} >
                {props.children}
            </Text >
        );
    }
}

const styles = {
    tooltip: {
        ...globals.styles.text,
        position: 'fixed',
        width: 'max-content',
        zIndex: 10,

        backgroundColor: globals.COLOR_WHITE,
        borderRadius: '.25em',
        padding: '0 .25em',

    },
    tooltipTemp: {
        ...globals.styles.text,
        color: '#00000000',
        position: 'fixed',
        width: 'max-content',
        zIndex: 10,

        backgroundColor: '#00000000',
        padding: '0 .25em',
        display: 'block !important'

    }
};
