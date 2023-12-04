import { useEffect, useState } from "react";


export const COLOR_BLUE             = "#00B2C2";
export const COLOR_LIGHT_BLUE       = "#B5E2FA";
export const COLOR_ORANGE           = "#FF9F6B";
export const COLOR_LIGHT_ORANGE     = "#EDDEA4";
export const COLOR_BEIGE            = "#F9F7F3";
export const COLOR_DARK_BLUE        = "#2B2D42";
export const COLOR_WHITE            = "#FFF";
export const COLOR_BLACK            = "#000";
export const COLOR_GRAY             = "#777";
export const COLOR_LIGHT_GRAY       = "#CCC";
export const COLOR_OFF_WHITE        = "#EEE";
export const COLOR_RED              = "#F00";

export const COLOR_DISABLED         = '#66666633';
export const COLOR_HOVER            = '#cccccc55';
export const COLOR_MODAL            = '#33333399';


export const View = React.forwardRef((props, ref) => (
    
    <div tabIndex={props.tabIndex ? props.tabIndex : -1} ref={ref} {...props} >
        {props.children}
    </div>
));


export const Text = React.forwardRef((props, ref) => (
    <div tabIndex={props.tabIndex ? props.tabIndex : -1} ref={ref} {...props} style={{ ...{fontSize: '.85em'}, ...props.style} }>
        {props.children}
    </div>
));

export const Image = React.forwardRef(function ImageType(props, ref) {
    const [imgStyle, setImgStyle] = useState({ height: 'auto', maxHeight: '100%' });

    const [divStyle, setDivStyle] = useState(props.style);
    function onImgLoad({ target: img }) {
        if (props.useimagesize) {
            setDivStyle({...props.style, ...{ height: img.naturalHeight, aspectRatio: img.naturalWidth / img.naturalHeight }});

        } else {
            setImgStyle(img.naturalWidth > img.naturalHeight ? { height: 'auto', maxHeight: '100%' } : { width: 'auto', maxWidth: '100%' });
        }
        
    }

    return (
        <div tabIndex={props.tabIndex ? props.tabIndex : -1} {...props} style={{ ...divStyle, ...{ overflow: 'hidden', justifyContent: 'center', alignItems: 'center' } }} >
            <img ref={ref} src={props.source} onLoad={onImgLoad} style={imgStyle} />
        </div>

    );
});

var msg = document.getElementById('state-msg');



export const Modal = React.forwardRef(function ModalType(props, ref) {

    const { onRequestClose, transparent, visible, ...otherProps } = props;

    useEffect(() => {

        const handleKeyDown = (e) => {

            if (e.key == "Escape") {
                onRequestClose();
            }
        };
        document.body.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.removeEventListener('keydown', handleKeyDown);
        }

    }, []);
    

    return (
        <div {...otherProps} tabIndex={props.tabIndex ? props.tabIndex : -1} ref={ref}>
            {props.children}
        </div>
    )
});


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
    return "https://dummyimage.com/50x50/ffffff/777777.gif&text=" + encodeURIComponent(acronym);
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
        boxShadow: '3px 3px 3px #aaa',
    },
    buttonLabel: {
        padding: '.5em',
        fontWeight: 'bolder',
        fontSize: '1.05em',
        color: COLOR_WHITE,
        cursor: 'inherit'
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
        marginLeft: '.5em'
    },
    list: {
        flex: 1,
        height: 'auto',
        display: 'grid',
        width: '90%',
        gridTemplateColumns: '80% 20%',
        gridAutoRows: 'min-content',

        alignSelf: 'center',
        margin: '.25em 0',

        overflowY: 'auto',
        scrollbarWidth: 'thin',
    },
    listContainer: {
        height: 'auto',
        marginTop: '2em',
        boxShadow: '0px 0px 5px 5px #eee',
        borderRadius: '1em',
        backgroundColor: COLOR_WHITE,
    },
    sidebarListItem: {
        flex: 'auto',
        height: 'auto',
        padding: '.5em 1em',

        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',

    },
    listItemRow: {
        flex: 'auto',
        height: 'auto',
        padding: '.5em 1em',

        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',

        backgroundColor: COLOR_WHITE,

        borderStyle: 'solid none none',
        borderColor: COLOR_OFF_WHITE,
        borderWidth: '1px'

    },
    listItemColumn: {
        flex: 'auto',
        height: 'auto',
        width: 'auto',
        padding: '.5em 1em',

        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',

        backgroundColor: COLOR_WHITE,

        borderStyle: 'solid none none',
        borderColor: COLOR_OFF_WHITE,
        borderWidth: '1px'

    },

    listText: {
        fontSize: '1.17em',
        paddingTop: 0,
        paddingBottom: 0,
        color: COLOR_GRAY,
        height:'auto',
    },
    listTitle: {
        color: COLOR_GRAY,
        fontWeight: 600,
        padding: '.566em',
        paddingLeft: '1em',
        paddingBottom: '1.5em',
        fontSize: '1.17em',
    },
    listHeader: {
        position: 'sticky',
        zIndex: 1,
        top: 0,
        height: 'auto',
        minHeight: '1.25em',

        margin: '-1px 0',
        padding: '0 .566em',

        fontSize: '1.17em',
        fontWeight: 'bolder',
        color: COLOR_GRAY,
        backgroundColor: COLOR_WHITE,  
    },
    smallListHeader: {
        position: 'sticky',
        zIndex: 1,
        top: 0,
        height: 'auto',
        minHeight: '1em',
        padding: '0 1em .5em',

        fontSize: '.85em',
        color: COLOR_GRAY,
        backgroundColor: COLOR_WHITE,
    },
    listIcon: {
        flex: '0 0 auto',
        aspectRatio: 1,
        borderRadius: '50%',
        boxShadow: '0px 0px 2px 2px #eee',
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
        minHeight: '100vh',
        height: 'auto',
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
    },
    settleUp: {
        height: '2em',
        width: '10em',
        margin: 0,
        marginRight: '1em',
        borderRadius: '2em',
        color: COLOR_ORANGE,
    },
    profileAndGroupNameText: {
        color: COLOR_GRAY,
        borderRadius: 2,
        padding: 0,
        margin: '0 .5em',
        fontWeight: 500
    }
};
