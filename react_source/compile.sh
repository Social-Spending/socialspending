#! /bin/bash

npx --yes expo export -p web

if [ "$?" -eq "0" ]
then
    echo "Removing old files from htdocs"
    rm -rf ../assets ../bundles ../_expo

    echo "Copying dist folder"
    mv -f ./dist/* ../
fi
