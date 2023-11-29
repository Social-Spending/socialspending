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

    $exif = exif_read_data($file['tmp_name']);
    
    //Reorient image if necessary

    if (!empty($exif['Orientation'])) {
        switch ($exif['Orientation']) {
            case 1:
                // No change
                break;
            case 2:
                //Image is mirrored
                $image = imageflip($image, IMG_FLIP_HORIZONTAL);
                break;
            case 3:
                //Image is rotated 180deg
                $image = imagerotate($image, 180, 0);
                break;
            case 4:
                //Image is mirrored and rotated 180deg
                $image = imagerotate($image, 180, 0);
                $image = imageflip($image, IMG_FLIP_HORIZONTAL);
                break;
            case 5:
                //Image is mirrored and rotated 90deg
                $image = imagerotate($image, -90, 0);
                $image = imageflip($image, IMG_FLIP_HORIZONTAL);
                break;
            case 6:
                //Image is rotated 90 deg
                $image = imagerotate($image, -90, 0);
                break;
            case 7:
                //Image is mirrored and rotated 270 deg
                $image = imagerotate($image, 90, 0);
                $image = imageflip($image, IMG_FLIP_HORIZONTAL);
                break;
            case 8:
                //Image is rotated 270 deg
                $image = imagerotate($image, 90, 0);
                break;
        }
    }

    // check image size
    $actualWidth = imagesx($image);
    $actualHeight = imagesy($image);

    //Get original dimensions
    $xSize = $actualWidth;
    $ySize = $actualHeight;

    //Determine the new size for the image
    if ($allowedWidth && $allowedHeight){
        //Find ratio between aspect ratios
        $aspectRatio = $actualHeight / $actualWidth;
        $desiredRatio = $allowedHeight / $allowedWidth;

        $change = $aspectRatio / $desiredRatio;
        //Adjust dimensions to meet new aspect ratio
        if ($change > 1){
            $ySize /= $change;
        }else{
            $xSize *= $change;
        }
    }

    //Determine if we want to keep original dimensions
    if ($allowedWidth <= 0) $allowedWidth = $actualWidth;
    if ($allowedHeight <= 0) $allowedHeight = $actualHeight;
    
    $resizedImage = imagecreate($allowedWidth, $allowedHeight);
    //This should cut out an image matching the desired dimensions 
    imagecopyresized($resizedImage, $image, 0, 0, $actualWidth / 2 - $xSize / 2, $actualHeight / 2 - $ySize / 2, $allowedWidth, $allowedHeight, $xSize, $ySize);
    
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
    if (!imagegif($resizedImage, $serverFileName))
    {
        $_VALIDATE_IMAGE_FAILURE_MESSAGE = 'Failed to save image';
        return false;
    }
    
    //Cleanup images from memory
    imagedestroy($image);
    imagedestroy($resizedImage);

    // result is path to image file on server
    return $serverFileName;
}

?>
