import * as globals from '../utils/globals.js'
import Base from '../components/Base.js';
import Contact from '../components/Contact.js';

export default function Page() {
    return (
        <Base style={globals.styles.container} >
            <Contact />
        </Base>
    );
}
