<?php

// Load libraries.
require 'libraries/helper.functions.php';

// Load autoloader.
require 'autoload.php';

// Set timezone.
date_default_timezone_set('America/New_York');

// Configure API.
define( 'API_ROOT', $_SERVER['DOCUMENT_ROOT'].'/markdown-blog/' );
define( 'API_ROUTER', file_get_contents(API_ROOT.'router.json') );

// Capture request.
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));

// Initialize the API.
$API = new API();

// Send the method and request.
$API->setMethod( $method );
$API->setRequest( $request );
$API->setInput( $input );

// Get API response.
$response = $API->getResponse();

// Return response.
echo $response;

?>