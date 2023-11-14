# Front End Rework Changes
Built bundle is now about 1/5th the size and uses a custom file based routing system
With the smaller bundle size comes a few changes and improvements


## Development 
Use `npm run start` to start a live development environment with hot patching

Development is now done directly on a local XAMPP instance and all external files will be accessible with near instant hot patching for easier testing

## Basic Components
Basic Components like `<View/>`, `<Image/>`, or `<Text/>` are now imported from `'/utils/globals.js'` instead of `'react-native'`

They are for the most part aliases of `<div>` or `<img>`

## Routing
Routing has quite a few changes in how it is implemented including:
- A change to programatically redirecting
- A change in how links and similar React components function
- A change in how URL Parameters are fetched
- File based routing may be buggy and not work as expected

### Programatic Redirection
Previous implementation:
```
import {router} from 'expo-router';

router.push(url);	// Leave a history of this page
router.replace(url);	// Don't a history of this page

```
New implementation:
```
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate(); 
// Can only be called in a React element so navigate must be passed to 
// functions that need it or set as a global file variable


navigate(url, options); 
// options can be found here https://reactrouter.com/en/main/hooks/use-navigate
// Main one to worry about is the replace option which can be used like so { replace : true } which acts the same as router.replace

```

### Links and React Components
 - All imported from `'react-router-dom'` rather than `'expo-router'`
 - All link/navigation components now use the prop `to` instead of `href` to determine destination
 - `<Redirect/>` has become `<Navigate/>`
 - `<Slot/>` has become `<Outlet/>`

### URL Parameters
 - Basic URL parameters like `/groups/[group_id]` remain the same the function has just changed to `useParams()`
 - Search URL parameters like `/groups/?id={value}` have changed to be as follows
```
const [searchParams, setSearchParams] = useSearchParams();

var idSearchParam = searchParams.get('id');
```

## Styles
Styling has not changed much but involves a few syntax changes:
 - Stylesheets are declared differently
 - Inline styles are merged using a different syntax
	
### Declaring a Stylesheet
Old: `const styles = new StyleSheet.create({...});`

New: `const styles = {...};`

### Combining Inline Styles
Old method uses an array of StyleSheet objects as such `style={[style1, style2, {inlineStyling : 1}]}`

New method utilizes JSON objects and the `...` operator as such `style={{...style1, ...style2, ...{inlineStyling: 1}}}`

New method never encounters an error while merging styles!




