<?php

// Videos: ![{alt}]({source}:{id})
return function( $data ) {
  
  $config = [
    'youtube'     => '//www.youtube.com/embed/:id',
    'vimeo'       => '//player.vimeo.com/video/:id',
    'vevo'        => '//embed.vevo.com?isrc=:id'
  ];
        
  $template = '<iframe src=":src" width=":width" height=":height" '.
              'allowfullscreen frameborder="0">:alt</iframe>';

  foreach( $config as $source => $src ) {

    if( preg_match("/!\[(.*)\]\($source:(.+?)(?: (\d+)x(\d+))?\)/i", $data, $match) ) {

      $width = $match[3] ?: 560;
      $height = $match[4] ?: 315;

      $data = str_replace(
        $match[0], 
        str_replace(
          [':src', ':width', ':height', ':alt'], 
          [str_replace(':id', $match[2], $src), $width, $height, $match[1]], 
          $template
        ),
        $data
      );

    }

  }

  return $data;

}

?>