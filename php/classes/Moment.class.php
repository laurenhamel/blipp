<?php

require 'Moment/Moment.php';

class Moment extends Moment\Moment_Engine {
    
  function __construct($dateTime = 'now', $timezone = 'UTC') {

    parent::__construct($dateTime, $timezone);

  }
  
}

?>