import * as globals from '../utils/globals.js'

import Base from '../components/Base.js';
import Friends from "../components/Friends.js"

export default function Page() {
  return (
    <Base style={globals.styles.container}>
      <Friends />
    </Base>
  );
}
