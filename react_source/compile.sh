#! /bin/bash

npm --yes run export
RV=$?
if [ "${RV}" -eq "0" ]
then
    echo "Removing old files from htdocs"
    rm -rf ../assets ../bundles ../_expo

    echo "Copying dist folder"
    mv -f ./dist/* ../
else
    exit $RV
fi
