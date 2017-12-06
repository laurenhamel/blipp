<?php

trait EXTENSIBLE {
  
  public $extensions = [];
  
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
  
}

class Markdown {
  
  use EXTENSIBLE;
  
  public $path;
  public $filename;
  public $contents;
  public $id;
  public $meta = [];
  public $frontmatter;
  public $markdown;
  public $html;
  public $config;
  
  function __construct( $path ) {

    $this->path = $path;
    $this->filename = basename($this->path);
    $this->id = filename_id( $this->filename );
    $this->contents = file_get_contents($this->path);
    $this->config = json_decode(API_META, true);
    $this->registerExtensions();
    $this->parseMeta();
    $this->parseMarkdown();
    
  }
  
  private function getDatesFromMeta( $meta ) { 
    
    $dates = [];
    
    foreach($meta->getMeta() as $key => $value) {
      
      if( $value instanceof Moment ) $dates[$key] = $value;
      
    }

    return $dates;
    
  }
  
  private function newDateMethod( $date, $format ) {
    return function() use ( $date, $format ) {
      
      if( !$date ) return;
      else return $date->format($format, new Moment\CustomFormats\MomentJs());
        
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
  
  private function parseMeta(){
    
    // Parse meta data.
    $meta = new Meta( $this->contents );
    
    // Create mustache methods.
    $methods = $this->setMustacheMethods( $meta );
    
    // Save meta data.
    $this->frontmatter = $meta->getMeta(true);
    $this->meta = array_merge($meta->getMeta(), $methods);
    
    // Set the slug.
    $this->slug = slug_id( $meta->title );

  }
  
  private function parseMarkdown(){
    
    // Extract markdown.
    $this->markdown = $markdown = preg_replace('/---(?:\S|\s)*---/', '', $this->contents);
    
    // Extract meta data.
    $meta = $this->meta;
    
    // Create parsers.
    $Parsedown = new Parsedown();
    $Mustache = new Mustache();
    
    // Build HTML.
    $this->html = $Parsedown->text( $this->applyExtensions($Mustache->render($markdown, $meta)));
    
  }
  
}

?>