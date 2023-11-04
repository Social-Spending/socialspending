import { StyleSheet } from 'react-native';

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
export const COLOR_RED              = "#F00";

export function getDefaultGroupIcon(groupName) {
    // get array of first letter of each word in the group name
    let matches = groupName.match(/\b(\D)/g);
    // get the first 2 letters
    let acronym = '';
    for (let i = 0; i < matches.length && acronym.length < 2; i++)
    {
        if (matches[i] != ' ')
        {
            acronym = acronym + matches[i];
        }
    }

    // return url to this site which will create an image with the black initials on a white background
    return "https://dummyimage.com/50x50/ffffff/000000.gif&text=" + acronym;
}

export const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        flex: 1,
        backgroundColor: COLOR_BEIGE,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    darkContainer: {
        position: 'relative',
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
    error: {
        padding: '0em',
        fontSize: '.83em',
        color: COLOR_RED
    },
    disabled: {
        backgroundColor: "#66666633",
    },
    hover: {
        backgroundColor: "#cccccc55"
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
        marginTop: '1em',
        paddingBottom: '1em',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'

    },
    listIconAndTextContainer: {
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
        flexShrink: 0
    },
    listIcon: {
        paddingTop: 0,
        paddingLeft: '2%',
        paddingRight: '2%',
        paddingBottom: 0
    },
    listItemSeperator: {
        paddingTop: '1em',
        backgroundColor: COLOR_WHITE,
        paddingBottom: '1em',
        justifyContent: 'space-between',
        alignItems: 'left',
        flexDirection: 'row',
        borderStyle: 'none',
        borderTopStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#eee'

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
        backgroundColor: '#33333399',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0
    },


});