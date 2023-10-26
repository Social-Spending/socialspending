#! /bin/bash

npx expo export -p web --yes

if [ "$?" -eq "0" ]
then
    echo "Removing old files from htdocs"
    rm -rf ../assets ../bundles

    echo "Copying dist folder"
    mv -f ./dist/* ../
fi
