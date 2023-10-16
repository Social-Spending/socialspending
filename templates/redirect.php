<?php

function getRedirectURI($target)
{
    if (!empty($_SERVER['HTTPS']) && ('on' == $_SERVER['HTTPS'])) {
		$uri = 'https://';
	} else {
		$uri = 'http://';
	}
	$uri .= $_SERVER['HTTP_HOST'] . $target;
    return $uri;

}

function redirect($target)
{
    $uri = getRedirectURI($target);
	header('Location: ' . $uri);
	exit(0);
}

?>
