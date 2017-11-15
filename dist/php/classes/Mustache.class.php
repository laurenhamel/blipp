<?php

require 'Mustache/Engine.php';

class Mustache extends Mustache_Engine {
  
  
  function __construct(array $options = array()){
    
    parent::__construct($options);
    
  }
  
}

?>