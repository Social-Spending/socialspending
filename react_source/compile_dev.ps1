npx expo export -p web

echo "Rerouting Link For Components"
dir ./dist/bundles/*.js | % { (Get-Content $_) -replace '"\.\/(?<filename>.*?)\.js":{enumerable:!0','"./dev/${filename}.js":{enumerable:!0' | Set-Content $_ }

echo "Rerouting Link For Assets"
dir ./dist/bundles/*.js | % { (Get-Content $_) -replace 'httpServerLocation:"/assets','httpServerLocation:"/dev/assets' | Set-Content $_ }


echo "Rerouting Bundles"
dir ./dist/index.html | % { (Get-Content $_) -replace '\/bundles\/web','./bundles/web' | Set-Content $_ }





$files = "login","signup","about","faq", "forgot", "groups", "friends"
foreach ($file in $files)
{
	echo "Rerouting Link For $file"
  	dir ./dist/bundles/*.js | % { (Get-Content $_) -replace "`"\/$([regex]::escape($file))`"","`"/dev/$([regex]::escape($file))`"" | Set-Content $_ }

}