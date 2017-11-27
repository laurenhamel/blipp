<?php

class Markdown {
  
  public $path;
  public $filename;
  public $contents;
  public $config = [
    'date' => [
      'long'        => 'F j, Y',
      'short'       => 'm.d.Y',
      'created'     => 'date-created',
      'modified'    => 'date-modified',
    ],
    'icon'   => [
      'fontawesome' => 'fa',
      'ionicons'    => 'ion',
      'socicon'     => 'soci'
    ],
    'video' => [
      'youtube'     => '//www.youtube.com/embed/:id',
      'vimeo'       => '//player.vimeo.com/video/:id',
      'vevo'        => '//embed.vevo.com?isrc=:id'
    ]
  ];
  public $id;
  public $meta = [];
  public $frontmatter;
  public $markdown;
  public $html;
  
  function __construct( $path ) {
    
    $this->path = $path;
    $this->filename = basename($this->path);
    $this->id = filename_id( $this->filename );
    $this->contents = file_get_contents($this->path);
    $this->parse_frontmatter();
    $this->parse_markdown();
    
  }
  
  private function mustache_methods() {
    
    return [
      'date'         => [
        'long'        => [
          'created'   => function(){
            
            if( !($date = $this->meta[$this->config['date']['created']]) ) return;
            
            else return $date->format($this->config['date']['long']);
            
          },
          'modified'  => function(){

            if( !($date = $this->meta[$this->config['date']['modified']]) ) return;
            
            else return $date->format($this->config['date']['long']);
            
          },
        ],
        'short'       => [
          'created'   => function(){
            
            if( !($date = $this->meta[$this->config['date']['created']]) ) return;
            
            else return $date->format($this->config['date']['short']);

          },
          'modified'  => function(){
            
            if( !($date = $this->meta[$this->config['date']['modified']]) ) return;
            
            else return $date->format($this->config['date']['short']);

          },
        ]
      ]
    ];
    
  }
  
  private function frontmatter_type( $string ) {
    
    // Handle strings only
    if( gettype($string) !== 'string' ) return $string;

    // Array types
    if( preg_match('/^\[(.+?)\]$/', $string) ) {

      $string = array_map('trim', explode(',', preg_replace('/\[|\]/', '', $string)));

      foreach( $string as $key => &$value ) {

        $string[$key] = $this->frontmatter_type( $value );

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
        
        $string[$array[0]] = $this->frontmatter_type( $array[1] );
        
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
  
  private function markdown_extended( $string ) {
    
    $config = $this->config;
    
    $extensions = [
      
      // Icon: ${prefix}-{icon}
      'icon'    => function( $data ) use ( $config ) {
     
        $template = '<span class=":prefix-:icon"></span>';
 
        foreach( $config['icon'] as $set => $prefix ) {

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
        
      },
      
      // Videos: ![{alt}]({source}:{id})
      'video'   => function( $data ) use( $config ) {
        
        $template = '<iframe src=":src" width=":width" height=":height" '.
                    'allowfullscreen frameborder="0">:alt</iframe>';
 
        foreach( $config['video'] as $source => $src ) {

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
      
    ];
    
    foreach( $extensions as $type => $function ){
      
      $string = $function( $string );
     
    }
    
    return $string;
    
  }
  
  private function parse_frontmatter(){
    
    // Extract
    preg_match('/---(?:\S|\s)*---/', $this->contents, $match);
    
    // Save
    $this->frontmatter = $frontmatter = $match[0];
    
    // Reformat
    $frontmatter = array_map(function($pair){
      
      $array = array_map('trim', preg_split('/:/', $pair, 2));

      return $array;
      
    }, array_filter( preg_split(
      
        '/\r*\n+|\r+/', trim( preg_replace('/---/', '', $frontmatter) )
      
      ), function($item){
      
      return isset($item);
      
    }));
    
    // Typeify
    foreach( $frontmatter as &$meta ) { 
      
      $meta[1] = $this->frontmatter_type( $meta[1] );
  
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
      $this->mustache_methods()
    );
    $this->slug = slug_id( $this->meta['title'] );

  }
  
  private function parse_markdown(){
    
    // Extract
    $this->markdown = preg_replace('/---(?:\S|\s)*---/', '', $this->contents);
    
    // Parse
    $Parsedown = new Parsedown();
    $Mustache = new Mustache();
    $this->html = $Parsedown->text( 
      $this->markdown_extended(
        $Mustache->render($this->markdown, $this->meta) 
      )
    );
    
  }
  
}

?>