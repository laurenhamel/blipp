<?php

interface GET {
  
  // Posts
  public function getPosts();
  public function getPostsByCategory( $category );
  public function getPostsByTag( $tag );
  public function getPostById( $id );
  
  // Categories
  public function getCategories();
  
  // Tags
  public function getTags();
  
}

class API implements GET {
  
  private $status = [
    200 => 'OK',
    201 => 'Created',
    304 => 'Not Modified',
    400 => 'Bad Request',
    403 => 'Forbidden',
    404 => 'Not Found',
    409 => 'Conflict',
    500 => 'Internal Server Error'
  ];
  
  protected $method = 'GET';
  protected $request = [];
  protected $input = [];
  
  // Getters
  public function getMethod() {
    return $this->method;
  }
  public function getRequest() {
    return $this->request;
  }
  public function getInput() {
    return $this->input;
  }
  
  // Setters
  public function setMethod( $method ) {
    $this->method = $method;
  }
  public function setRequest( $request ) {
    $this->request = $request;
  }
  public function setInput( $input ) {
    $this->input = $input;
  }
  
  // Build response data.
  private function response( $status, $data = [] ) {
    
    $response['status'] = [
      'code'      => $status,
      'message'   => $this->status[$status]
    ];
    
    if( $status == 200 ) $response['data'] = $data;
    
    return json_encode($response);
    
  }
  
  // Respond to requests.
  public function getResponse() {
    
    $method = $this->method;
    $request = $this->request;
    
    // Invalid requests.
    if( !$method and !$request ) {
      
      return $this->response( 400 );
      
    }
    
    // Valid requests.
    else {
      
      // GET Requests
      if( $method == 'GET' ) {

        $endpoint = array_shift($request);
        
        switch($endpoint) {
            
          // Posts
          case 'posts': 
            
            if( $request[0] ) {
              
              switch($request[0]) {
                case 'id': return $this->getPostById($request[1]);
                case 'category': return $this->getPostsByCategory($request[1]);
                case 'tag': return $this->getPostsByTag($request[1]);
              }
              
            }
            
            else {
              
              return $this->getPosts();
              
            }
            
            break;
        
          // Categories
          case 'categories':
            
            return $this->getCategories();
            
            break;
            
          // Tags
          case 'tags':
            
            return $this->getTags();
            
            break;
            
          default:
            
            return $this->response( 400 );
            
        }
        
      }
      
      // POST Requests
      elseif( $method == 'POST' ) {
        
      }
      
      // PUT Requests
      elseif( $method == 'PUT' ) {
        
      }
      
      // DELETE Requests
      elseif( $method == 'DELETE' ) {
        
      }
      
    }
    
    // Default response.
    return $this->response( 400 );
    
  }
  
  // GET Methods
  
  // Posts
  public function getPosts() {
    
    // Get path to posts.
    $path = API_ROOT.json_decode(API_ROUTER)->posts;

    // Retrieve all posts.
    $data = array_map(function($post) use ($path){ 
      return new Markdown( "{$path}{$post}" );
    }, array_values( 
      array_filter(
        scandir( $path ), 
        function($post) {
          return strpos($post, '.md') == (strlen($post) - strlen('.md'));
        }
      )
    ));
    
    return $this->response( 200, $data );
    
  }
  public function getPostsByCategory( $category ) {
    
    // Get path to posts.
    $path = API_ROOT.json_decode(API_ROUTER)->posts;
    
    // Retrieve the posts with the given category.
    $data = array_filter(
      array_map(function($post) use ($path){ 
        return new Markdown( "{$path}{$post}" );
      }, array_values( 
        array_filter(
          array_filter(
            scandir( $path ), 
            function($post) {
              return strpos($post, '.md') == (strlen($post) - strlen('.md'));
            }
          )
        )
      )),
      function($post) use ($category) {
        if( !($cat = $post->meta['category']) ) return false;
        else return $cat == $category;
      }
    );

    return $this->response( 200, $data );
    
  }
  public function getPostsByTag( $tag ) {
    
    // Get path to posts.
    $path = API_ROOT.json_decode(API_ROUTER)->posts;
    
    // Retrieve the posts with the given tag.
    $data = array_filter(
      array_map(function($post) use ($path){ 
        return new Markdown( "{$path}{$post}" );
      }, array_values( 
        array_filter(
          array_filter(
            scandir( $path ), 
            function($post) {
              return strpos($post, '.md') == (strlen($post) - strlen('.md'));
            }
          )
        )
      )),
      function($post) use ($tag) { 
        if( !($tags = $post->meta['tags']) ) return false;
        else return in_array($tag, $tags);
      }
    );

    return $this->response( 200, $data );
    
  }
  public function getPostById( $id ) {

    // Get path to posts.
    $path = API_ROOT.json_decode(API_ROUTER)->posts;

    // Retrieve the post with the given ID.
    $data = array_map(function($post) use ($path){ 
      return new Markdown( "{$path}{$post}" );
    }, array_values( 
      array_filter(
        array_filter(
          scandir( $path ), 
          function($post) {
            return strpos($post, '.md') == (strlen($post) - strlen('.md'));
          }
        ),
        function($post) use ($id) {
          return filename_id($post) == $id;
        }
      )
    ));
    
    if( $data ) return $this->response( 200, $data[0] );
    
    return $this->response( 404 );
    
  }
  
  // Categories
  public function getCategories() {
    
    // Get path to posts.
    $path = API_ROOT.json_decode(API_ROUTER)->posts;
    
    // Capture the post categories.
    $data = [];
    
    // Retrieve the post.
    $posts = array_map(function($post) use ($path){
      return new Markdown( "{$path}{$post}" );
    }, array_filter( scandir( $path ), function($post) {
      return strpos($post, '.md') == (strlen($post) - strlen('.md'));
    }));
    
    foreach( $posts as $index => $post ) {
      
      if( ($category = $post->meta['category']) ) {
        
        if( is_array($category) ) {
          
          $data = array_merge($data, $category);
          
        }
        
        else {
          
          $data[] = $category; 
          
        }
        
      }
      
    }

    return $this->response( 200, array_unique($data) );
    
  }
  
  // Tags
  public function getTags() {
    
    // Get path to posts.
    $path = API_ROOT.json_decode(API_ROUTER)->posts;
    
    // Capture the post categories.
    $data = [];
    
    // Retrieve the post.
    $posts = array_map(function($post) use ($path){
      return new Markdown( "{$path}{$post}" );
    }, array_filter( scandir( $path ), function($post) {
      return strpos($post, '.md') == (strlen($post) - strlen('.md'));
    }));
    
    foreach( $posts as $index => $post ) {
      
      if( ($tag = $post->meta['tags']) ) {
        
        if( is_array($tags) ) {
          
          $data = array_merge($data, $tags);
          
        }
        
        else {
          
          $data[] = $tag; 
          
        }
        
      }
      
    }

    return $this->response( 200, array_unique($data) );
    
  }
  
}

?>