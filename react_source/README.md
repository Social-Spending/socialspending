 ## Requirements:

 - Node.js - v14 or higher - Most recent LTS preferred
 - React

 ## Developing
 - Use command `npm run start` in the react_source directory to start the live test environment. 
 - All dev files will be build in the main directory (the one that contains the react_source folder)
 - Any changes will automatically be reflected in the website
 - Requries a third party server to be setup, int this case XAMPP

 ## Compile/Running:
 - Compile using `npm run export` this will output files to ./dist
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
	
 ## Viewing the Bundle Map
 - Running the command `npm run map` will build the bundle as well as a map file
 - This map file is automatically opened in your browser and displays a visual breakdown of the bundle

 ## Installing React and All Node.js Dependencies:
 - Run `npm install` within react_source to install all dependencies