<?php

// Load libraries.
require 'libraries/helper.functions.php';

// Load autoloader.
require 'autoload.php';

// Set timezone.
date_default_timezone_set('America/New_York');

// Configure API.
define( 'API_ROOT', dirname(dirname(__FILE__)).'/' );
define( 'API_ROUTER', file_get_contents(API_ROOT.'router.json') );
define( 'API_META', file_get_contents(API_ROOT.'meta.json') );

// Capture request.
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);
$params = array_consolidate(array_map(function($q){
  return explode('=', $q);
}, explode('&', trim($_SERVER['QUERY_STRING'], '/'))));
$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));

// Initialize the API.
$API = new API();

// Send the method and request.
$API->setMethod( $method );
$API->setRequest( $request );
$API->setInput( $input );
$API->setParams( $params );

// Get API response.
$response = $API->getResponse();

// Return response.
echo $response;

?>