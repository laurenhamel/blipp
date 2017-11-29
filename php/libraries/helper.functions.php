<?php

function filename_id ( $path ) {
  
  return strtolower( str_replace(['.md', ' '], ['', '-'], basename($path)) );
  
}

function slug_id ( $name ) {
  
  $find = [ "/[^A-Za-z0-9 ]/", " " ];
  $replace = [ "", "-" ];
  
  return strtolower( str_replace($find, $replace, $name) );
  
}

function scandir_deep( $dir ) {
      
  $files = array_filter(scandir($dir), function($file){
    
    return !preg_match('/^\.+$/', $file);
    
  });

  foreach($files as $index => $name){

    if( is_dir(($path = "{$dir}{$name}")) ) {

      $files[$name] = scandir_deep( "$path/" );

      unset($files[$index]);

    }

  }

  return $files;
  
}

function flattendir( array $dir, $prefix = '' ) {
  
  $result = [];
      
  foreach( $dir as $key => $value ) {

    if( is_array($value) ){

      $result = array_merge($result, flattendir( $value, "{$prefix}{$key}/" ));

    }

    else {

      $result[] = "{$prefix}{$value}";

    }

  }

  return $result;
  
}

function array_consolidate( array $array ) {
  
  $result = [];
  
  foreach( $array as $pair ) {
    
    $result[$pair[0]] = $pair[1];
    
  }
  
  return $result;
  
}

?>