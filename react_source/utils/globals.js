import { useState } from "react";


export const COLOR_BLUE = "#00B2C2";
export const COLOR_LIGHT_BLUE       = "#B5E2FA";
export const COLOR_ORANGE           = "#FF9F6B";
export const COLOR_LIGHT_ORANGE     = "#EDDEA4";
export const COLOR_BEIGE            = "#F9F7F3";
export const COLOR_DARK_BLUE        = "#2B2D42";
export const COLOR_WHITE            = "#FFF";
export const COLOR_BLACK            = "#000";
export const COLOR_GRAY             = "#777";
export const COLOR_LIGHT_GRAY       = "#CCC";
export const COLOR_RED              = "#F00";

export const COLOR_DISABLED         = '#66666633';
export const COLOR_HOVER            = '#cccccc55';
export const COLOR_MODAL = '#33333399';

export const View = React.forwardRef((props, ref) => (
    
    <div ref={ref} {...props} >
        {props.children}
    </div>
));


export const Text = React.forwardRef((props, ref) => (
    <div ref={ref} {...props} style={{ ...{fontSize: '.85em'}, ...props.style} }>
        {props.children}
    </div>
));

export const Image = React.forwardRef(function ImageType(props, ref) {
    const [imgStyle, setImgStyle] = useState({ height: 'auto', maxHeight: '100%' });
    function onImgLoad({ target: img }) {
        setImgStyle(img.naturalWidth > img.naturalHeight ? { height: 'auto', maxHeight: '100%' } : { width: 'auto', maxWidth: '100%' });
    }

    return (
        <div {...props} style={{ ...props.style, ...{ overflow: 'hidden', justifyContent: 'center', alignItems: 'center' } }} >
            <img ref={ref} src={props.source} onLoad={onImgLoad} style={imgStyle} />
        </div>

    );
});

export const Modal = React.forwardRef((props, ref) => (
    <div ref={ref} {...props}>
        {props.children}
    </div>
));


export function getDefaultGroupIcon(groupName) {
    // get array of first letter of each word in the group name
    let matches = groupName.match(/\b(\D)/g);

    // if there are no letters to present
    if (matches == null)
    {
        // no letters to present, just use a space
        return _getDummyImage([' ']);
    }

    // otherwise, get the first 2 letters
    // return url to this site which will create an image with the black initials on a white background
    return _getDummyImage(matches);
}

export function getDefaultUserIcon(username) {
    // get array of uppercase letters used in the username
    let matches = username.match(/[A-Z]/g);

    // if there are no uppercase letters
    if (matches == null)
    {
        return getDefaultGroupIcon(username);
    }

    // else, return url to this site which will create an image with the black initials on a white background
    return _getDummyImage(matches);
}

// helper function that returns a dummy image with the first 2 letters of the given 'initials' array
function _getDummyImage(initials)
{
    // stop after 2 letters or no more letters
    let acronym = '';
    for (let i = 0; i < initials.length && acronym.length < 2; i++)
    {
        if (initials[i] != ' ')
        {
            acronym = acronym + initials[i];
        }
    }
    return "https://dummyimage.com/50x50/ffffff/000000.gif&text=" + encodeURIComponent(acronym);
}

/** 
*   getCookieValue: Retrieves the value of a specific cookie
*       @param {string} name     - name of cookie to retrieve
*       @return {string}  - value of cookie or and empty string if not found
*/
export function getCookieValue(name) {
    const regex = new RegExp(`(^| )${name}=([^;]+)`)
    const match = document.cookie.match(regex)
    if (match) {
        return match[2]
    }
    return "";
}

export const styles = {
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: COLOR_BEIGE,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    darkContainer: {
        width: '100%',
        flex: 1,
        backgroundColor: COLOR_DARK_BLUE,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: COLOR_GRAY,
        fontSize: '.83em',
        fontWeight: 600
    },
    loading: {
        height: '4em',
        width: '4em',
        minWidth: '2em',
        borderRadius: 1,
    },
    input: {
        width: '75%',
        height: '2.5em',
        fontSize: '.86em',
        color: COLOR_GRAY,
      
        borderColor: COLOR_LIGHT_GRAY,
        borderWidth: 2,
        borderRadius: 2,
        borderStyle: 'none',
        borderBottomStyle: 'solid'
    },
    textarea: {
        minWidth: '75%',
        maxWidth: '75%',
        height: '6em',
        fontSize: '.86em',
        color: COLOR_GRAY,

        borderStyle: 'none',
        borderBottomStyle: 'solid',
        fontFamily: 'Segoe UI'
    },
    error: {
        padding: '0em',
        fontSize: '.83em',
        color: COLOR_RED
    },
    disabled: {
        backgroundColor: COLOR_DISABLED,
    },
    hover: {
        backgroundColor: COLOR_HOVER
    },
    labelContainer: {
        paddingTop: '1.5em',
        paddingBottom: '.5em',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '77%'
    },
    label: {
        padding: '0em',
        fontSize: '.83em',
        fontWeight: 'bolder',
        color: COLOR_GRAY
    },
    formButton: {
        width: '75%',
        height: '1.75em',
        fontSize: '1.17em',
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '1em',
        backgroundColor: COLOR_ORANGE,
        borderRadius: 4,
        boxShadow: '3px 3px 3px #aaa',
    },
    transparentButton: {
        width: '75%',
        fontSize: '1.17em',
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    showPassword: {
        fontSize: '1.2em',
        height: '100%',
        width: 'auto',
        paddingLeft: '.5em'
    },
    list: {
        flex: 1,
        width: '92%',

        marginTop: '1em',
        marginBottom: '1em',

        justifyContent: 'flex-start',
        alignItems: 'left',
        alignSelf: 'center',

        backgroundColor: COLOR_WHITE,

        overflowY: 'auto',
        scrollbarWidth: 'thin',


    },
    listItem: {
        flex: 1,
        height: 'auto',
        paddingTop: '.5em',
        paddingBottom: '.5em',
        paddingLeft: '1em',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'

    },
    listIconAndTextContainer: {
        flex: 'auto',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center'
    },
    listText: {
        fontSize: '1.17em',
        paddingTop: 0,
        paddingLeft: '2%',
        paddingRight: '2%',
        paddingBottom: 0,
        color: COLOR_GRAY,
        height:'auto',
    },
    listIcon: {
        flex: '0 0 auto',
        aspectRatio: 1,
        borderRadius: '50%'
    },
    listItemSeperator: {
        flex: 1,
        height:'auto',
        paddingTop: '.5em',
        paddingBottom: '.5em',
        paddingLeft: '1em',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderStyle: 'none',
        borderTopStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#eee'

    },
    listLabel: {
        minHeight: 'auto',
        padding: 0,
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backgroundColor: COLOR_WHITE,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    h1: {
        padding: '1em',
        fontSize: '2em',
        fontWeight: 'bolder'
    },
    h2: {
        padding: '.75em',
        fontSize: '1.5em',
        fontWeight: 'bolder'
    },
    h3: {
        padding: '.566em',
        fontSize: '1.17em',
        fontWeight: 'bolder'
    },
    h4: {
        padding: '.5em',
        fontSize: '1em',
        fontWeight: 'bolder'
    },
    h5: {
        padding: '.416em',
        fontSize: '.83em',
        fontWeight: 'bolder'
    },
    h6: {
        padding: '.33em',
        fontSize: '.67em',
        fontWeight: 'bolder'
    },
    modalBackground: {
        height: '100vh',
        width: '100%',
        backgroundColor: COLOR_MODAL,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0
    },
    summaryList: {
        width: '35vw',
        minHeight: '20em',
        //height: '55vh',
        backgroundColor: COLOR_WHITE,
        minWidth: '25em',
        boxShadow: '0px 0px 5px 5px #eee',

        justifyContent: 'flex-start',
        alignItems: 'left',
        overflow: 'hidden'
    },
    summaryLabel: {
        marginLeft: '3%',
        paddingLeft: ' .5em',
        paddingTop: '2em',
        paddingBottom: '0em',
        color: COLOR_GRAY,
    },
    newGroupOrFriendButton: {
        marginRight: '3%',
        marginTop: '2em',
        paddingBottom: '0em',
        color: COLOR_ORANGE,
        alignSelf: 'flex-end',
        width: '10em'
    }

};