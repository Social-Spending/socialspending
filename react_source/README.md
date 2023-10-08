 ## Requirements:

 - Node.js - Most Recent
 - Expo
 - Expo Router v2
 - React

 ## Compile/Running:
 - Use command 'npx expo start' in the source directory to start the live test environment. Any changes will automatically be compiled and reflect in the website
 - Compile using 'npx expo export -p web' this will output files to ./dist
 - Run Compiled version without XAMPP using 'npx serve dist --single'

 ## Running on XAMPP
 - Move all files from ./dist to XAMPP's htdocs directory
 - Make sure bundles folder is in the htdocs directory and not a subdirectory
 - Add the following code to .htaccess changing index.html as needed if files were placed in subdirectory
```
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

 ## Installing Expo and Expo Router:
 - To install expo use 'npm install expo'
 - Expo Router: https://docs.expo.dev/routing/installation/#install-dependencies
 - Or run npm install within the dir to install all dependencies