/*

###       ###      ###      #########   ####    ###  ###########  ####    ###   ########  
###       ###    ### ###    ###    ###  #####   ###      ###      #####   ###  ###    ### 
###       ###   ###   ###   ###    ###  ######  ###      ###      ######  ###  ###        
###  ###  ###  ###########  #########   ### ### ###      ###      ### ### ###  ###        
### ##### ###  ###     ###  ###    ###  ###  ######      ###      ###  ######  ###   #### 
 ##### #####   ###     ###  ###    ###  ###   #####      ###      ###   #####  ###    ### 
  ###   ###    ###     ###  ###    ###  ###    ####  ###########  ###    ####   ########  


 
 This file is more than it appears

 When loaded into webpack this file is significantly altered by route-loader

 Many of the `unused` imports are used at compile time and not safe to be removed

 The IMPORT PAGE ROUTES is replaced with imports for every file in the `/app` folder and a declaration of the `router` JSON object

 You are free to put anything inside the Main function as long as you dont alter the `router` prop of `RouterProvider`


 
###       ###      ###      #########   ####    ###  ###########  ####    ###   ########  
###       ###    ### ###    ###    ###  #####   ###      ###      #####   ###  ###    ### 
###       ###   ###   ###   ###    ###  ######  ###      ###      ######  ###  ###        
###  ###  ###  ###########  #########   ### ### ###      ###      ### ### ###  ###        
### ##### ###  ###     ###  ###    ###  ###  ######      ###      ###  ######  ###   #### 
 ##### #####   ###     ###  ###    ###  ###   #####      ###      ###   #####  ###    ### 
  ###   ###    ###     ###  ###    ###  ###    ####  ###########  ###    ####   ########  

*/




import React from 'react';
import { createRoot } from 'react-dom/client';

import { View } from "./utils/globals.js"

require("./utils/global.css");


import { Outlet, Route, RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom/dist/index.js';

_IMPORT_PAGE_ROUTES_ // DO NOT PUT THIS ANYWHERE ELSE IN THE APP EVEN IN QUOTES OR A COMMENT

document.body.innerHTML = `<div id="app" style="display: flex; flex: 1 1 0%;width: 100%; margin: 0px; padding: 0px; min-height: 100%"></div>`;
const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(<Main />);

export var navigate = 0;
function Main() {

    return (
        
        <View style={{flex: 1}}>
            <RouterProvider router={router}>
                <NavigateHandler/>

            </RouterProvider>
        </View>
        
    );
}

function NavigateHandler() {
    navigate = useNavigate();
    return (<></>)
}




