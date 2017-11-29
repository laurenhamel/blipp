<?php

// Icon: ${prefix}-{icon}
return function( $data ) {
  
  $config = [
    'fontawesome' => 'fa',
    'ionicons'    => 'ion',
    'socicon'     => 'soci'
  ];
     
  $template = '<span class=":prefix-:icon"></span>';

  foreach( $config as $set => $prefix ) {

    if( preg_match("/\\$($prefix)-([a-z-]+)/i", $data, $match) ) {

      $data = str_replace(
        $match[0], 
        str_replace(
          [':prefix', ':icon'], 
          [$match[1], $match[2]], 
          $template
        ),
        $data
      );

    }

  }

  return $data;

}

?>