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

interface POST {}

interface PUT {}

interface DELETE {}

class API implements GET, POST, PUT, DELETE {
  
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
  protected $params = [];
  
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
  public function getParams() {
    return $this->params;
  }
  
  // Setters
  public function setMethod( $method ) {
    $this->method = $method;
  }
  public function setRequest( array $request ) {
    $this->request = $request;
  }
  public function setInput( $input ) {
    $this->input = $input;
  }
  public function setParams( array $params ) {
    $this->params = $params;
  }
  
  // Build response data.
  private function response( $status, array $data = [] ) {
    
    // Initialize response.
    $response['status'] = [
      'code'      => $status,
      'message'   => $this->status[$status]
    ];
    
    // Pass through data modifiers.
    $result = $this->modify($data);
    
    // Extract data.
    $data = $result['data'];
    
    // Keep any other data.
    unset($result['data']);
    
    // Add data.
    if( $status == 200 ) {
      
      // Save data.
      $response['data'] = $data;
      
      // Merge additional data.
      $response = array_merge($result, $response);
      
    }
    
    // Encode and return response.
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
  
  // Data Modifiers
  
  // Enable a modifier by adding it below.
  private $modifiers = [
    'paginate',
    'sort'
  ];
  
  // Handle data modifiers.
  private function modify( array $data ) {
    
    // Initialize result.
    $result['data'] = $data;
    
    // Modify data.
    foreach($this->modifiers as $index => $modifier) {

      if( method_exists($this, $modifier) ) {
        
        $result = array_merge($result, $this->$modifier($result));
                              
      }
      
    }
    
    // Return result.
    return $result;
    
  }
  
  // Define data modifiers.
  private function paginate( array $data ) {
    
    // Initialize result.
    $result = [];
    
    // Apply offset.
    $offset = $this->_offset( $data['data'] );
    
    // Apply limit.
    $limit = $this->_limit( $offset['data'] );
    
    // Set next.
    if( $limit['limit'] and $limit['offset'] ) {
        
      $result['next'] = [
        'offset'  => $limit['offset'],
        'limit'   => $limit['remaining'] >= $limit['limit'] ? $limit['limit'] : $limit['remaining']
      ];
      
    }

    // Set previous.
    if( $offset['offset'] ) {
      
      $result['prev'] = [
        'offset'  => $offset['start'] - $limit['limit'],
        'limit'   => $limit['limit']
      ];
      
    }
    
    // Merge results.
    $result['data'] = $limit['data'];
    
    // Return result.
    return $result;
    
  }
  private function sort( array $data ) {
    
    // Initialize result.
    $result = [];
    
    // Apply sort.
    $sort = $this->_sort( $data['data'] );
    
    // Merge data.
    $result['data'] = $sort['data'];
    
    // Return result.
    return $result;
    
  }
  
  // Define data modification tasks.
  private function _offset( array $data ) {
    
    // Get parameters.
    $params = $this->params;
    
    // Build result.
    $result = [
      'offset'  => ($offset = isset($params['offset']) ? +$params['offset'] : false),
      'length'  => ($length = count($data)),
      'data'    => ($subset = $offset !== false ? array_slice($data, $offset) : $data)
    ];
    
    // Capture start and end position in original data set.
    $result['start'] = array_search($subset[0], $data);
    $result['end'] = array_search($subset[count($subset)-1], $data);
    
    // Offset.
    return $result;
    
    
  }
  private function _limit( array $data ) {
    
    // Get parameters.
    $params = $this->params;
    
    // Build result.
    $result = [
      'limit'   => ($limit = isset($params['limit']) ? +$params['limit'] : false),
      'length'  => ($length = count($data)),
      'data'    => ($subset = $limit !== false ? array_slice($data, 0, $limit) : $data)
    ];

    // Capture the offset amount.
    if( $length > ($offset = array_search($subset[count($subset)-1], $data) + 1) ) {
      
      $result['offset'] = $offset;
      $result['remaining'] = $length - $offset;
      
    }
    
    // Limit.
    return $result;
    
  }
  private function _sort( array $data ) {
    
    // Get parameters.
    $params = $this->params;
    
    // Build result.
    $result = [
      'sort'    => ($sort = $params['sort']?: 'date-created'),
      'order'   => ($order = $params['order'] ?: 'newest'),
      'data'    => []
    ];
    
    // Make the data sortable.
    $sortable = [];
    
    foreach($data as $index => $post) {
      
      // Get the metadata.
      $meta = $post->meta[$sort];
 
      // Convert Moment objects to times.
      if( $meta instanceof Moment ) $meta = strtotime( $meta->format() );
      
      // Add it to the sortable array.
      $sortable[$index] = $post->meta[$sort];
      
    }
    
    // Sort the data.
    switch( $order ) {
      case 'newest': arsort($sortable); break;
      case 'oldest': asort($sortable); break;
    }
    
    // Capture sorted data.
    foreach( $sortable as $index => $value ) {
      $result['data'][] = $data[$index];
    }
    
    // Sort.
    return $result;
    
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