import * as globals from '../utils/globals.js'
import Base from '../components/Base.js';
import ForgotPassword from '../components/ForgotPassword.js';

export default function Page() {
    return (
        <Base style={globals.styles.container} >
            <ForgotPassword />
        </Base>
    );
}