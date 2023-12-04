
const { globSync } = require('glob');

//Recursive function to generate a json object in the following format
/*
    [
        {
            path: "/path",
            element: React.createElement(_app_[subfolder]_{element}, null),
            children: [
                {
                    path: "/path/path2",
                    element: React.createElement(_app_[subfolder]_{element}, null),
                    children:
                },
                ...
            ]
        },
        ...
    ]
*/
function generateRoutes(routePath, path, keys, json, useLayout = keys.includes("_layout.js")) {
    let isError = keys.includes("_error.js");
    keys = keys.filter((key) => key != "_error.js");
    let routerJson = [];
    for (let i = 0; i < keys.length; i++) {

        // if index.js can either be a root node or a pathless child of the root node if there is a layout
        if (keys[i] === "index.js") {
            if (!useLayout) {
                //generate a node that does nothing but act as a parent move all nodes in the directory as a child
                //Index is set to a path of "" to indicate its the desired node for the path
               
                routerJson.push({
                    path: "",
                    element: "/*__PURE__*/React.createElement(_app" + path + "_" + "index, null)"
                });
                let tempJson = routerJson;

                routerJson = [];
                if (isError) {
                    routerJson.push({
                        path: routePath,
                        element: "/*__PURE__*/React.createElement(Outlet, null)", // Creates an element in format <_app_[subfolder]_{element} /> but as a function
                        errorElement: "/*__PURE__*/React.createElement(_app" + path + "__error, null)", // Creates an error handler element in format <_app_[subfolder]__error /> but as a function
                        children: generateRoutes(routePath, path, keys.slice(i + 1), json).concat(tempJson)
                    });
                } else {
                    routerJson.push({
                        path: routePath,
                        element: "/*__PURE__*/React.createElement(Outlet, null)", // Creates an element in format <_app_[subfolder]_{element} /> but as a function
                        children: generateRoutes(routePath, path, keys.slice(i + 1), json).concat(tempJson)
                    });
                }
                

                break;
            } else {
                //pathless node - do nothing special
                routerJson.push({
                    path: "",
                    element: "/*__PURE__*/React.createElement(_app" + path + "_" + "index, null)"
                });
            }
        }
        // If layout exists we must make it the sub-directory root node to ensure its applied to every child
        else if (keys[i] === "_layout.js") {
            //generate this node and move all other nodes in the directory as a child
            let tempJson = routerJson;
            routerJson = [];
            if (isError) {
                routerJson.push({
                    path: routePath,
                    element: "/*__PURE__*/React.createElement(_app" + path + "_" + "_layout, null)",
                    errorElement: "/*__PURE__*/React.createElement(_app" + path + "__error, null)", // Creates an error handler element in format <_app_[subfolder]__error /> but as a function
                    children: generateRoutes(routePath, path, keys.slice(i + 1), json, true).concat(tempJson)
                });
               
            } else {
                routerJson.push({
                    path: routePath,
                    element: "/*__PURE__*/React.createElement(_app" + path + "_" + "_layout, null)",
                    children: generateRoutes(routePath, path, keys.slice(i + 1), json, true).concat(tempJson)
                });
            }
            
            break;
        }
        // Handle urls with slugs in format `[slug].js`
        // converts to  :slug to work with react router
        else if (keys[i][0] === "[") {
            routerJson.push({
                path: routePath + "/:" + keys[i].slice(1).substring(0, keys[i].length - 5),
                element: "/*__PURE__*/React.createElement(_app" + path + "_" + keys[i].slice(1).substring(0, keys[i].length - 5) + ", null)"
            });
        }
        //Handle normal js files
        else if (keys[i].substr(-3) === ".js") {
            routerJson.push({
                path: routePath + "/" + keys[i].substring(0, keys[i].length - 3),
                element: "/*__PURE__*/React.createElement(_app" + path + "_" + keys[i].substring(0, keys[i].length - 3) + ", null)"
            });
        }
        //Handle folder entries
        else {
            //Nothing to add move to sub keys
            routerJson = routerJson.concat(generateRoutes(routePath + "/" + keys[i], path + "_" + keys[i], Object.keys(json[keys[i]]), json[keys[i]]));
        }
    }

    return routerJson;
}
//Generates import statements for a list of files in the given format:
/*
    import _{topleveldir}_[subfolder]_{element} from "./{topleveldir}/[subfolder]/{element}.js";
    ...

*/
function generateImports(imports) {
    let out = "";
    for (let i = 0; i < imports.length; i++) {
        let splits = imports[i].split(/\\|\//);
        let component = "";

        //build a unique component name starting in the format _{toplevelfolder}_[subfolder]_name
        for (let j = 0; j < splits.length; j++) {
            if (splits[j][0] === "[") {
                component += "_" + splits[j].slice(1).substring(0, splits[j].length - 5);
            }
            else if (splits[j].substr(-3) === ".js") {
                component += "_" + splits[j].substring(0, splits[j].length - 3);
            } else {
                component += "_" + splits[j];
            }

        }
        //import unique component names from files
        out += "import " + component + " from \'./" + imports[i].replaceAll("\\", "/") + "\';\n";
    }
    return out;
}

function generateRouter() {
    //Get all files in the app directory with a .js ending
    const imports = globSync('./app/**/*.js', { ignore: 'node_modules/**' });

    let routeJson = {};
    for (let i = 0; i < imports.length; i++) {

        temp = routeJson;
        //split by \ to get each folder as a string
        //form json data in format:
        /* base: {
            app: {
                page1 : {}, // /page1
                page2 : {}, // /page2
                subfolder : {
                    page3 : {} // /subfolder/page3
                }
            }
        }*/
        let splits = imports[i].split(/\\|\//);
        for (let j = 0; j < splits.length; j++) {
            if (temp[splits[j]]) {
                temp = temp[splits[j]];
            }
            else {
                temp[splits[j]] = {};
                temp = temp[splits[j]];
            }
        }
    }
    //Gets generated json containing all routes
    let routes = generateRoutes("", "", Object.keys(routeJson.app), routeJson.app);

    //Gets string of imports
    let parsedImports = generateImports(imports);

    //Converts json to a string removing quotes to turn it into "code" prepends imports
    return parsedImports + 'var router = createBrowserRouter(' + JSON.stringify(routes).replaceAll("\"", "").replaceAll("path:", "path:\'").replaceAll(",element", "\',element") + ');'
}

function stringifyRoutes(routes) {
    strRoutes = [];
    for (let i = 0; i < routes.length; i++) {
        strRouteObject = {};
        strRouteObject.path = String(routes[i].path);
        strRouteObject.element = String(routes[i].element);
        strRouteObject.children = stringifyRoutes(routes[i].children);
        strRoutes.push(strRouteObject);
    }
    return strRoutes;
}


module.exports = function (source) {

    // Replace key with the generated router function 
    // Do not use this anywhere in your app other than the main file
    if (source.includes("_IMPORT_PAGE_ROUTES_")) {
        source = source.replace("_IMPORT_PAGE_ROUTES_", generateRouter());
    }
    

	return source;
}