import * as globals from "../utils/globals.js";

import { Text } from 'react-native';
import { Link } from "expo-router";


export function HeaderText(props) {
    return (
        <Text style={[pickStyle(props.size), props.style]}>{props.children}</Text>
    );
}

export function HeaderLink(props) {



    return (
        <Link style={[pickStyle(props.size), props.style]} href={props.href} >
            {props.children}
        </Link>
    );
}


function pickStyle(styleId) {
    switch (styleId) {
        case 1:
            return globals.styles.h1;
        case 2:
            return globals.styles.h2;
        case 3:
            return globals.styles.h3;
        case 4:
            return globals.styles.h4;
        case 5:
            return globals.styles.h5;
        case 6:
            return globals.styles.h6;
        default:
            return globals.styles.h4;
            break;

    }

}



