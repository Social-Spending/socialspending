@echo off

call npx expo export -p web

if errorlevel 0 goto move
echo !!An Error Occurred During Compile!!

:MOVE
	
rmdir /s /q "../assets"
rmdir /s /q "../bundles"

robocopy /e "./dist/" "../"
