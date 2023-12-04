import * as globals from '../utils/globals.js'
import Base from '../components/Base.js';
import FAQ from '../components/FAQ.js';

export default function Page() {
    return (
        <Base style={globals.styles.container} >
            <FAQ />
        </Base>
    );
}