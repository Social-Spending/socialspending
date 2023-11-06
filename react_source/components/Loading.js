// component to be displayed while waiting for data to load
import * as globals from '../utils/globals.js';

import { View, Image } from 'react-native';

const LoadingGif = require('../assets/images/loading/loading-blue-block-64.gif');

export default function Loading(props) {
    return (
        <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, props.style]}>
            <Image source={LoadingGif} style={globals.styles.loading} />
        </View>
    )
}