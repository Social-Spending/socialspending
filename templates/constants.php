<?php

// 30 days, in seconds
const COOKIE_EXPIRY_TIME = 60*60*24*30;
// 1 day, in seconds
const TRANSIENT_COOKIE_EXPIRY_TIME = 60*60*24;

const HTTP_OK = 200;

const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;

const HTTP_INTERNAL_SERVER_ERROR = 500;

// max size of image uploads, in bytes
// 1MB
const MAX_ICON_SIZE = 1024 * 1024;

// directory where group icon files will be placed
const GROUP_ICON_DIR = 'group_icons/';
// allowed size for group icons, in pixels
const GROUP_ICON_WIDTH = 64;
const GROUP_ICON_HEIGHT = 64;

// directory where user icon files will be placed
const USER_ICON_DIR = 'user_icons/';
// allowed size for user icons, in pixels
const USER_ICON_WIDTH = 64;
const USER_ICON_HEIGHT = 64;

//Directory where transaction receipts will be placed
const TRANSACTION_RECEIPT_DIR = 'transaction_receipts/';
//Allowed size for receipts, in pixels

?>