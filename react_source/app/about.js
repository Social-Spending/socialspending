import * as globals from '../utils/globals.js'
import Base from '../components/Base.js';
import About from '../components/About.js';

export default function Page() {
    return (
        <Base style={globals.styles.container} >
            <About />
        </Base>
    );
}
