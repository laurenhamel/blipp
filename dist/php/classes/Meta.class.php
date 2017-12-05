<?php

class Meta {
  
  private $regex = [
    'meta'    => '/---(?:\S|\s)*---/',
    'break'   => '/\r*\n+|\r+/',
    'bound'   => '/---/',
    'data'    => '/:/'
  ];
  private $raw = [];
  private $meta = [];
  
  public function __construct( $data ) {
    $this->meta = $this->parseMeta( $data );
  }
  
  public function __get( $value ) {
    return $this->meta[$value];
  }
  
  public function __set( $keys, $value ) {
    
    $keys = explode('.', $keys);
    $meta = &$this->meta;
    
    foreach( $keys as $key ) {
      
      if( !array_key_exists($key, $meta) ) return false;
      
      $meta = &$meta[$key];
      
    }
    
    $meta = $value;
    
    return true;
    
  }
  
  public function getMeta( $raw = false ) {
    return $raw === true ? $this->raw : $this->meta;
  }
  
  private function formatMeta( $string ) {
    
    // Handle strings only
    if( gettype($string) !== 'string' ) return $string;
    
    // Array types
    if( preg_match('/^\[(.+?)\]$/', $string) ) {

      $string = array_map('trim', explode(',', preg_replace('/\[|\]/', '', $string)));

      foreach( $string as $key => &$value ) {

        $string[$key] = $this->formatMeta( $value );

      }

    }
    
    // Lists
    elseif( preg_match('/^.+?([,;|])(?: *.+?\1)+( *.+)$/', $string, $match) ) {
      
      $string = array_map('trim', explode($match[1], $match[0]));
      
    }
    
    // Object types
    elseif( preg_match('/^\{ *(.+?) *\}$/', $string) ) {

      $string = array_map(function($meta){
        return array_map('trim', preg_split('/:/', $meta, 2));
      }, array_map('trim', preg_split(
        '/,(?=[^\]]*(?:[\[]|$))/', preg_replace('/\{|\}/', '', $string)
      )));

      foreach( $string as $index => $array ) {
        
        $string[$array[0]] = $this->formatMeta( $array[1] );
        
        unset($string[$index]);
        
      }
      
    }
    
    // Date types
    elseif( (bool) strtotime($string) ) {
      
      $string = new Moment($string);
      
    }
    
    // Number types
    elseif( is_numeric($string) ) {
      
      $string = (float) $string;
      
    }
    
    // Boolean types
    elseif( $string == 'true' or $string == 'false' ) {
      
      $string = $string == 'true' ? true : false;
      
    }
 
    return $string;
    
  }
  
  private function parseMeta( $data ) {
    
    // Get the regular expressions.
    $regex = $this->regex;
    
    // Extract
    preg_match($regex['meta'], $data, $match);
    
    // Save the raw data.
    $this->raw = $raw = $match[0];
    
    // Remove data boundaries, and create a basic array from the data.
    $raw = preg_split($regex['break'], trim(preg_replace($regex['bound'], '', $raw)));
    
    // Interpret the raw data.
    $raw = array_map(function($pair) use ($regex){
      
      $array = array_map('trim', preg_split($regex['data'], $pair, 2));

      return $array;
      
    }, array_filter($raw, function($item){
      
      return isset($item);
      
    }));
    
    // Format the raw data.
    foreach( $raw as &$meta ) { 
      
      $meta[1] = $this->formatMeta( $meta[1] );
  
    }
    
    // Reduce the raw data.
    for( $i = count($raw) - 1; $i > -1; $i-- ) { 
      
      $meta = $raw[$i];
      
      $raw[$meta[0]] = $meta[1];
      
      unset($raw[$i]);
      
    }

    // Return the real meta data.
    return array_merge( $raw );
    
  }
  
}

?>