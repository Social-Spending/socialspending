import * as globals from '../utils/globals.js'

import { Redirect } from "expo-router";

import "../utils/global.css"

export default function Page() {


    return (
        <Redirect href='/login' />
    );
}


