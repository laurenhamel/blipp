<?php

interface GET {
  
  // Feed
  public function getFeed();
  
  // Posts
  public function getPosts();
  public function getPostsByCategory( $category );
  public function getPostsByTag( $tag );
  public function getPostsByAuthor( $author );
  public function getPostById( $id );
  public function getPostBySlug( $slug );
  public function getPostsByKeywords( array $keywords );
  
  // Categories
  public function getCategories();
  
  // Tags
  public function getTags();
  
  // Authors
  public function getAuthors();
  public function getAuthorByName( $name );
  
}

interface POST {}

interface PUT {}

interface DELETE {}

class API implements GET, POST, PUT, DELETE {
  
  private $status = [
    200 => 'OK',
    201 => 'Created',
    204 => 'No Content',
    304 => 'Not Modified',
    400 => 'Bad Request',
    401 => 'Unauthorized',
    403 => 'Forbidden',
    404 => 'Not Found',
    405 => 'Method Not Allowed',
    406 => 'Not Acceptable',
    409 => 'Conflict',
    415 => 'Unsupported Media Type',
    500 => 'Internal Server Error',
    501 => 'Not Implemented'
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
  private function response( $status, $data = [], array $extra = [] ) {
    
    // Initialize response.
    $response['status'] = [
      'code'      => $status,
      'message'   => $this->status[$status]
    ];
    
    // Add data.
    if( $status == 200 ) {
      
      $response['data'] = $data;
      $response = array_merge($response, $extra);
      
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
            
          // Feed
          case 'feed':
            
            return $this->getFeed();
            
          // Posts
          case 'posts': 
            
            if( $request[0] ) {
              
              switch($request[0]) {
                case 'id': 
                  return $this->getPostById($request[1]);
                case 'slug': 
                  return $this->getPostBySlug($request[1]);
                case 'category': 
                  return $this->getPostsByCategory($request[1]);
                case 'tag': 
                  return $this->getPostsByTag($request[1]);
                case 'author': 
                  return $this->getPostsByAuthor($request[1]);
                case 'keywords': 
                  array_shift($request); 
                  return $this->getPostsByKeywords($request);
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
            
          // Authors
          case 'authors': 
            
            if( $request[0] ) {
              
              switch($request[0]) {
                case 'name': return $this->getAuthorByName($request[1]);
              }
              
            }
            
            else {
              
              return $this->getAuthors();
              
            }
            
            break;
            
          default:
            
            return $this->response( 400 );
            
        }
        
      }
      
      // POST Requests
      elseif( $method == 'POST' ) {
        
        $this->reponse( 501 );
        
      }
      
      // PUT Requests
      elseif( $method == 'PUT' ) {
        
        $this->reponse( 501 );
        
      }
      
      // DELETE Requests
      elseif( $method == 'DELETE' ) {
        
        $this->reponse( 501 );
        
      }
      
    }
    
    // Default response.
    return $this->response( 400 );
    
  }
  
  // Data Modifiers
  
  // Enable a modifier by adding it below. Order matters.
  private $modifiers = [
    'sort',
    'paginate'
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
        'total'  => $limit['length'],
        'offset'  => $limit['offset'],
        'limit'   => $limit['remaining'] >= $limit['limit'] ? $limit['limit'] : $limit['remaining']
      ];
      
    }

    // Set previous.
    if( $offset['offset'] ) {
      
      $result['prev'] = [
        'total'   => $limit['length'],
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
  
  // Feed
  public function getFeed() {
    
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
    
    // Pass through data modifier.
    $result = $this->modify( $data ); 
    
    // Extract data.
    $data = $result['data'];
    
    // Create a feed from the post data.
    $feed = new Feed( $data );
    
    // Return response.
    return json_encode($feed->getFeed());
    
  }
  
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
    
    // Pass through data modifier.
    $result = $this->modify( $data ); 
    
    // Extract data.
    $data = $result['data'];
    
    // Preserve other data.
    unset($result['data']);
    
    // Return response.
    return $this->response( 200, $data, $result );
    
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
        
        $normalized = strtolower(str_replace(' ', '-', $category));
        
        if( !($_category = $post->meta['category']) ) return false;
        
        else return  $normalized == strtolower(str_replace(' ', '-', $_category));
        
      }
    );
    
    // Pass through data modifier.
    $result = $this->modify( $data ); 
    
    // Extract data.
    $data = $result['data'];
    
    // Preserve other data.
    unset($result['data']);
    
    // Return response.
    return $this->response( 200, $data, $result );
    
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
        
        $normalized = strtolower(str_replace(' ', '-', $tag));
        
        if( !($tags = $post->meta['tags']) ) return false;
        else {
          
          if( gettype($tags) == 'string' ) {
            
            $tags = explode(',', $tags);
            
          }
          
          $tags = array_map(function($tag){
              
            return strtolower(str_replace(' ', '-', $tag));

          }, $tags);

          return in_array($normalized, $tags);
          
        }
        
      }
    );
    
    // Pass through data modifier.
    $result = $this->modify( $data ); 
    
    // Extract data.
    $data = $result['data'];
    
    // Preserve other data.
    unset($result['data']);
    
    // Return response.
    return $this->response( 200, $data, $result );
    
  }
  public function getPostsByAuthor( $author ) {
    
    // Get path to posts.
    $path = API_ROOT.json_decode(API_ROUTER)->posts;
    
    // Retrieve the posts with the given author.
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
      function($post) use ($author) {
        
        $normalized = strtolower(str_replace(' ', '-', $author));
        
        if( !($_author = $post->meta['author']) ) return false;
        
        elseif ( is_array($_author) ) {
          
          $_author = array_map(function($a){
            return strtolower(str_replace(' ', '-', $a));
          }, $_author);
          
          return in_array($normalized, $_author);
          
        }
        
        else return $normalized == strtolower(str_replace(' ', '-', $_author));
        
      }
    );
    
    // Pass through data modifier.
    $result = $this->modify( $data ); 
    
    // Extract data.
    $data = $result['data'];
    
    // Preserve other data.
    unset($result['data']);
    
    // Return response.
    return $this->response( 200, $data, $result );
    
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
          return filename_id($post) == filename_id($id);
        }
      )
    ));
    
    if( $data ) return $this->response( 200, $data[0] );
    
    return $this->response( 404 );
    
  }
  public function getPostBySlug( $slug ) {
    
    // Get path to posts.
    $path = API_ROOT.json_decode(API_ROUTER)->posts;

    // Retrieve the post with the given slug.
    $data = array_values(array_filter(
      array_map(function($post) use ($path){
        return new Markdown( "{$path}{$post}" );
      }, array_filter(
          scandir( $path ), 
          function($post) {
            return strpos($post, '.md') == (strlen($post) - strlen('.md'));
          }
        )
      ),
      function( $post ) use ($slug){
        return slug_id($post->slug) == slug_id($slug);
      }
    ));

    if( $data ) return $this->response( 200, $data[0] );
    
    return $this->response( 404 );
    
  }
  public function getPostsByKeywords( array $keywords ) {
    
    // Get path to posts.
    $path = API_ROOT.json_decode(API_ROUTER)->posts;
    
    // Clean up keywords.
    foreach($keywords as $index => $keyword) {
      
      // Handle commas separated lists.
      $keywords[$index] = array_map('strtolower', explode(',', $keyword));
      
    }
    
    // Retrieve the posts with the given keyword(s).
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
      function($post) use ($keywords) { 
        
        // Use raw post contents.
        $contents = strtolower($post->contents);
        
        foreach($keywords as $index => $keyword) {
    
          $result = [];
            
          foreach($keyword as $word) {

            $result[$word] = strpos($contents, $word);
            
          }

          if( empty($result) ) return false;
          elseif ( min($result) > 0 ) return true;
          else return false;
          
        }
        
      }
    );
  
    // Pass through data modifier.
    $result = $this->modify( $data ); 
    
    // Extract data.
    $data = $result['data'];
    
    // Preserve other data.
    unset($result['data']);
    
    // Return response.
    return $this->response( 200, $data, $result );
    
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

    // Pass through data modifier.
    $result = $this->modify( $data ); 
    
    // Extract data.
    $data = $result['data'];
    
    // Preserve other data.
    unset($result['data']);
    
    // Return response.
    return $this->response( 200, array_unique($data), $result );
    
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

    // Pass through data modifier.
    $result = $this->modify( $data ); 
    
    // Extract data.
    $data = $result['data'];
    
    // Preserve other data.
    unset($result['data']);
    
    // Return response.
    return $this->response( 200, array_unique($data), $result );
    
  }
  
  // Authors
  public function getAuthors() {
    
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
      
      if( ($author = $post->meta['author']) ) {
        
        if( is_array($author) ) {
          
          $data = array_merge($data, $author);
          
        }
        
        else {
          
          $data[] = $author; 
          
        }
        
      }
      
    }

    // Pass through data modifier.
    $result = $this->modify( $data ); 
    
    // Extract data.
    $data = $result['data'];
    
    // Preserve other data.
    unset($result['data']);
    
    // Return response.
    return $this->response( 200, array_unique($data), $result );
    
  }
  public function getAuthorByName( $name ) {
    
    // Get path to authors.
    $path = API_ROOT.json_decode(API_ROUTER)->authors;
    
    // Retrieve the author info with the given name.
    $data = array_filter(
      array_map(function($author) use ($path){ 
        return new Markdown( "{$path}{$author}" );
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
      function($post) use ($name) {
        
        $normalized = strtolower(str_replace(' ', '-', $name));
        
        if( !($_name = $post->meta['name']) ) return false;
        
        else return  $normalized == strtolower(str_replace(' ', '-', $_name));
        
      }
    );

    // Pass through data modifier.
    $result = $this->modify( $data ); 
    
    // Extract data.
    $data = $result['data'];
    
    // Preserve other data.
    unset($result['data']);
    
    // Return response.
    return $this->response( 200, $data[0], $result );
    
  }
  
}

?>