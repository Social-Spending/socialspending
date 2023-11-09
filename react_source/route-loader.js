
const { globSync } = require('glob');


function generateRoutes(routePath, path, keys, json, useLayout = "_layout.js" in keys) {
    let routerJson = [];
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] === "index.js") {
            if (!useLayout) {
                let tempJson = routerJson;
                routerJson = [];
                routerJson.push({
                    path: routePath,
                    element: "/*__PURE__*/React.createElement(_app" + path + "_" + "index, null)",
                    children: generateRoutes(routePath, path, keys.slice(i + 1), json).concat(tempJson)
                });
                break;
            } else {
                routerJson.push({
                    path: "",
                    element: "/*__PURE__*/React.createElement(_app" + path + "_" + "index, null)"
                });
            }
        }
        else if (keys[i] === "_layout.js") {
            let tempJson = routerJson;
            routerJson = [];
            routerJson.push({
                path: routePath,
                element: "/*__PURE__*/React.createElement(_app" + path + "_" + "_layout, null)",
                children: generateRoutes(routePath, path, keys.slice(i + 1), json, true).concat(tempJson)
            });
            break;
        } else if (keys[i][0] === "[") {
            routerJson.push({
                path: routePath + "/:" + keys[i].slice(1).substring(0, keys[i].length - 5),
                element: "/*__PURE__*/React.createElement(_app" + path + "_" + keys[i].slice(1).substring(0, keys[i].length - 5) + ", null)"
            });
        } else if (keys[i].substr(-3) === ".js") {
            routerJson.push({
                path: routePath + "/" + keys[i].substring(0, keys[i].length - 3),
                element: "/*__PURE__*/React.createElement(_app" + path + "_" + keys[i].substring(0, keys[i].length - 3) + ", null)"
            });
        } else {
            routerJson = routerJson.concat(generateRoutes(routePath + "/" + keys[i], path + "_" + keys[i], Object.keys(json[keys[i]]), json[keys[i]]));
        }
    }
    return routerJson;
}
function generateImports(imports) {
    let out = "";
    for (let i = 0; i < imports.length; i++) {
        let splits = imports[i].split('\\');
        let component = "";
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
        ///* harmony import */ var _app_1_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/1.js */ "./app/1.js");
        out += "import " + component + " from \'./" + imports[i].replaceAll("\\", "/") + "\';\n";
    }
    return out;
}

function generateRouter() {
    const imports = globSync('./app/**/*.js', { ignore: 'node_modules/**' });

    let routeJson = {};
    for (let i = 0; i < imports.length; i++) {

        temp = routeJson;
        let splits = imports[i].split('\\');
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

    let routes = generateRoutes("", "", Object.keys(routeJson.app), routeJson.app);

    let parsedImports = generateImports(imports);

    return parsedImports + 'var router = createBrowserRouter(' + JSON.stringify(routes).replaceAll("\"", "").replaceAll("path:", "path:\'").replaceAll(",element", "\',element") + ');'
}


module.exports = function (source) {
    if (source.includes("_IMPORT_PAGE_ROUTES_")) {
        source = source.replace("_IMPORT_PAGE_ROUTES_", generateRouter());
    }
    

	return source;
}