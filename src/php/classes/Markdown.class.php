<?php

class Markdown {
  
  public $path;
  public $filename;
  public $contents;
  public $config = [
    'date' => [
      'long'        => 'F j, Y',
      'short'       => 'm.d.Y',
    ]
  ];
  public $id;
  public $meta = [];
  public $frontmatter;
  public $markdown;
  public $html;
  public $extensions = [];
  
  function __construct( $path ) {

    $this->path = $path;
    $this->filename = basename($this->path);
    $this->id = filename_id( $this->filename );
    $this->contents = file_get_contents($this->path);
    $this->registerExtensions();
    $this->parseFrontmatter();
    $this->parseMarkdown();
    
  }
  
  private function getDatesFromMeta( $meta ) {
    
    $dates = [];
    
    foreach($meta as $key => $value) {
      
      if( $value instanceof Moment ) $dates[$key] = $value;
      
    }
    
    return $dates;
    
  }
  
  private function newDateMethod( $date, $format ) {
    return function() use ( $date, $format ) {
      
      if( !$date ) return;
      else return $date->format($format);
        
    };
  }
  
  private function setDateMethods( $dates ) {
    
    $methods = [];
    
    foreach($this->config['date'] as $name => $format) {
      
      $result = [];
      
      foreach($dates as $key => $date) {
      
        $result[$key] = $this->newDateMethod( $date, $format );
        
      }
      
      $methods[$name] = $result;
      
    }
    
    return $methods;
    
  }
  
  private function setMustacheMethods( $meta ) {
    
    return [
      'date'    => $this->setDateMethods( $this->getDatesFromMeta( $meta ) ) 
    ];
    
  }
  
  private function formatFrontmatter( $string ) {
    
    // Handle strings only
    if( gettype($string) !== 'string' ) return $string;

    // Array types
    if( preg_match('/^\[(.+?)\]$/', $string) ) {

      $string = array_map('trim', explode(',', preg_replace('/\[|\]/', '', $string)));

      foreach( $string as $key => &$value ) {

        $string[$key] = $this->formatFrontmatter( $value );

      }

    }
    
    // Object types
    elseif( preg_match('/^\{ *(.+?) *\}$/', $string) ) {

      $string = array_map(function($meta){
        return array_map('trim', preg_split('/:/', $meta, 2));
      }, array_map('trim', preg_split(
        '/,(?=[^\]]*(?:[\[]|$))/', preg_replace('/\{|\}/', '', $string)
      )));

      foreach( $string as $index => $array ) {
        
        $string[$array[0]] = $this->formatFrontmatter( $array[1] );
        
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
  
  private function registerExtensions() {
    
    $path = API_PATH.'/extensions/';
    
    $extensions = array_values(array_filter(scandir($path), function( $item ){
      return !preg_match('/^\.+$/', $item);
    }));
    
    foreach($extensions as $extension){
      
      $name = str_replace('.php', '', $extension);
      
      $this->extensions[$name] = include $path.$extension;
      
    }
    
  }
  
  private function applyExtensions( $string ) {
    
    foreach( $this->extensions as $type => $function ){
      
      $string = $function( $string );
     
    }
   
    return $string;
    
  }
  
  private function parseFrontmatter(){
    
    // Define some regular expressions.
    $regex = [
      'frontmatter' => '/---(?:\S|\s)*---/',
      'linebreak'   => '/\r*\n+|\r+/',
      'delimiter'   => '/---/',
      'separator'   => '/:/'
    ];
    
    // Extract
    preg_match($regex['frontmatter'], $this->contents, $match);
    
    // Save
    $this->frontmatter = $frontmatter = $match[0];
    
    // Interpret
    $frontmatter = array_map(function($pair) use ($regex){
      
      $array = array_map('trim', preg_split($regex['separator'], $pair, 2));

      return $array;
      
    }, array_filter( preg_split(
      
        $regex['linebreak'], trim( preg_replace($regex['delimiter'], '', $frontmatter) )
      
      ), function($item){
      
      return isset($item);
      
    }));
    
    // Format
    foreach( $frontmatter as &$meta ) { 
      
      $meta[1] = $this->formatFrontmatter( $meta[1] );
  
    }
    
    // Reduce
    for( $i = count($frontmatter) - 1; $i > -1; $i-- ) { 
      
      $meta = $frontmatter[$i];
      
      $frontmatter[$meta[0]] = $meta[1];
      
      unset($frontmatter[$i]);
      
    }

    // Save
    $this->meta = array_merge(
      $frontmatter, 
      $this->setMustacheMethods( $frontmatter )
    );
    $this->slug = slug_id( $this->meta['title'] );

  }
  
  private function parseMarkdown(){
    
    // Extract
    $this->markdown = preg_replace('/---(?:\S|\s)*---/', '', $this->contents);
    
    // Parse
    $Parsedown = new Parsedown();
    $Mustache = new Mustache();
    $this->html = $Parsedown->text( 
      $this->applyExtensions(
        $Mustache->render($this->markdown, $this->meta) 
      )
    );
    
  }
  
}

?>