import * as globals from "../utils/globals.js";

import {  View, Image } from '../utils/globals.js';
import { useState, useContext } from 'react';

import { ModalContext } from '../modals/ModalContext.js';

import UploadIcon from "../modals/UploadIcon.js";

import Upload from '../assets/images/bx-upload.svg';
import SVGIcon from "./SVGIcon.js";
export default function ChangeableIcon({ iconPath, name, groupID }) {

    const [hover, setHover] = useState(false);
    const setModal = useContext(ModalContext);

    const upload = () => {
        setModal(<UploadIcon groupID={groupID} />);
    }

    return (
        <View onClick={upload} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <Image
                style={{ ...globals.styles.listIcon, ...{ width: '3em', height: '3em' } }}
                source={iconPath !== null ? decodeURI(iconPath) : (groupID ? globals.getDefaultGroupIcon(name) : globals.getDefaultUserIcon(name))}
            />
            <View style={{ ...{ display: hover ? 'inherit' : 'none' }, ...styles.uploadContainer }}>

                <SVGIcon src={Upload} style={{ fill: globals.COLOR_WHITE, height: '2em', width: '2em' }} />
                
            </View>

        </View>

    );
}

const styles = {
    uploadContainer: {
        cursor: 'pointer',
        position: 'absolute',
        width: '3em',
        height: '3em',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: globals.COLOR_MODAL
    }
}