<?php

// Get the document root.
$root = $_SERVER['DOCUMENT_ROOT'];

// Get router data.
$router = json_decode(file_get_contents('../../router.json'));

// Scan the posts directory for markdown files.
$posts = array_filter(scandir( "$root{$router->root}{$router->posts}" ), function($value, $key){
  
  return strpos($value, '.md') !== false;
  
}, ARRAY_FILTER_USE_BOTH);

// Return the list of posts.
echo json_encode(array_values($posts));

?>