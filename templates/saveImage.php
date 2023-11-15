<?php

// Helper function for importing images, then saving them on the filesystem
// $file            is object returned from indexing the super global $_FILES
// $maxSize         is the maximum allowed image size, in bytes
// $allowedWidth    is the allowed width, in pixels. If 0 or negative, then the original width will be kept
// $allowedHeight   is the allowed height, in pixels. If 0 or negative, then the original height will be kept
// $dir             is a path on the filesystem where the image will be saved
// on success, returns the relative directory (in the filesystem) of the saved image
//      ie. 'directory/image.gif' (note there is no leading backslash)
// on failure, returns false and sets the global variable $_VALIDATE_IMAGE_FAILURE_MESSAGE with...
//      a string message explaining why validation failed
$_VALIDATE_IMAGE_FAILURE_MESSAGE = '';
function validateAndSaveImage($file, $maxSize, $allowedWidth, $allowedHeight, $dir)
{
    global $_VALIDATE_IMAGE_FAILURE_MESSAGE;
    // check that file size is smaller than 1 MB
    if ($file['size'] > $maxSize)
    {
        $_VALIDATE_IMAGE_FAILURE_MESSAGE = 'Cannot upload images exceeding '.$maxSize.' bytes';
        return false;
    }

    // check that file is a valid MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE); // MIME type will be something like image/gif, image/jpeg
    $imageFileType = $finfo->file($file['tmp_name']);
    //$imageFileTypes = explode('/', $imageFileType);

    // parse the file into an image
    $image = null;
    if ($imageFileType == 'image/png')
    {
        $image = imagecreatefrompng($file['tmp_name']);
    }
    elseif ($imageFileType == 'image/jpeg')
    {
        $image = imagecreatefromjpeg($file['tmp_name']);
    }
    elseif ($imageFileType == 'image/gif')
    {
        $image = imagecreatefromgif($file['tmp_name']);
    }
    // image will be null if MIME type was not recognized or false if imagecreatefromX failed
    if ($image == null || !$image)
    {
        $_VALIDATE_IMAGE_FAILURE_MESSAGE = 'Image is not valid image type. Must be gif, png, or jpeg';
        return false;
    }

    // check image size
    $actualWidth = imagesx($image);
    $actualHeight = imagesy($image);

    //Determine the new size for the image
    $xSize = min($actualWidth, $actualHeight);
    $ySize = $xSize;

    //Determine if we want to keep origina dimensions
    if ($allowedWidth <= 0)
        $xSize = $actualWidth;

    if ($allowedHeight <= 0)
        $ySize = $actualHeight;

    $image = imagecrop($image, ['x' => $actualWidth / 2 - $xSize / 2, 'y' => $actualHeight / 2 - $ySize / 2, 'width' => $xSize, 'height' => $ySize]);

    imagecopyresized($image, $image, 0, 0, 0, 0, $xSize, $ySize, $actualWidth, $actualHeight);

    // make sure this destination folder exists
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
    }
    // generate random name for the file and save
    do
    {
        $imageID = bin2hex(random_bytes(20));
        $serverFileName = $dir.$imageID.'.gif';
    }
    while (file_exists($serverFileName));
    if (!imagegif($image, $serverFileName))
    {
        $_VALIDATE_IMAGE_FAILURE_MESSAGE = 'Failed to save image';
        return false;
    }
    imagedestroy($image);

    // result is path to image file on server
    return $serverFileName;
}

?>
