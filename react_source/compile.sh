#! /bin/bash

# if NPX environment variable is not set, just use npx and hope it's in the PATH
if [ -z "${NPX}" ]
then
    NPX=npx
fi

"${NPX}" --yes expo export -p web

if [ "$?" -eq "0" ]
then
    echo "Removing old files from htdocs"
    rm -rf ../assets ../bundles

    echo "Copying dist folder"
    mv -f ./dist/* ../
fi
