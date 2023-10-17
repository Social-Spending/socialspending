 ## Requirements:

 - Node.js - v14 or higher - Most recent LTS preferred
 - Expo
 - Expo Router v2
 - React

 ## Developing
 - Use command `npx expo start --web` in the react_source directory to start the live test environment. 
 - Any changes will automatically be reflected in the website
 - Unable to use outside files (php) in this mode

 ## Compile/Running:
 - Compile using `npx expo export -p web` this will output files to ./dist
 - Run Compiled version without XAMPP using `npx serve dist --single`

 ## Running on XAMPP
 - Move all files from ./dist to XAMPP's htdocs directory
 - Make sure everything is in the htdocs directory and not a subfolder
 - Add the following code to .htaccess if not already there
```
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

 ## Compiling Using Scripts
 - Compile scripts assume main directory is setup as a the main directory for XAMPP
 - Scripts are formatted to automatically move results to the main server file directory
 - Should require no extra setup beside the one-time change to .htaccess

 ## Installing Expo and All Node.js Dependencies:
 - Run `npm install` within react_source to install all dependencies