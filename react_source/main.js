//DO NOT TOUCH ANYTHING IN THIS FILE - IT WILL BREAK

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Route } from 'react-router-dom';

import { View } from "./utils/globals.js"

import "./utils/global.css"

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

_IMPORT_PAGE_ROUTES_ // DO NOT PUT THIS ANYWHERE ELSE IN THE APP EVEN IN QUOTES OR A COMMENT

document.body.innerHTML = `<div id="app" style="display: flex; flex: 1 1 0%;width: 100%; margin: 0px; padding: 0px; min-height: 100%"></div>`;
const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(<Main />);



function Main() {


    return (
        <View style={{flex: 1}}>
            <RouterProvider router={router} />
        </View>
        
    );
}




