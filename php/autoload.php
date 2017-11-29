<?php

spl_autoload_register(function($class){

  if( file_exists($path = "classes/$class.class.php") ) {
  
    require_once "classes/$class.class.php";
    
  }
  
  else {
    
    $files = flattendir( scandir_deep( 'classes/' ), 'classes/' );
    
    foreach( $files as $index => $path ) {
      
      $file = str_replace('_', '/', $class);
      
      if( strpos($path, $name) or strpos($path, $file) ) {
        
        require_once "$path";
        
      }
      
    }
    
  }
  
});

?>