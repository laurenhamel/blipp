<?php

class Feed {
  
  private $router = [];
  private $meta = [];
  
  private $feed = [
    "version"       => "https://jsonfeed.org/version/1",
    "title"         => null,
    "description"   => null,
    "author"        => [],
    "home_page_url" => API_ROOT,
    "feed_url"      => null,
    "items"         => []
  ];

  public function __construct( array $posts = [] ) {
    
    $this->router = json_decode(API_ROUTER);
    $this->meta = json_decode(API_META);
    $this->feed['title'] = $this->meta->title;
    $this->feed['description'] = $this->meta->description;
    $this->feed['feed_url'] = API_ROOT.$this->router->feed;
    $this->feed['author'] = array_merge(
      $this->feed['author'], $this->meta->owners
    );
    
    foreach( $this->meta->contributors as $contributor ) {
      $this->feed['author'][] = $contributor;
    }
    
    if( !empty($posts) ) $this->makeFeed( $posts );
    
  }
  
  public function makeFeed( array $posts ) {
    
    foreach( $posts as $post ) {
      
      $this->feed['items'][] = [
        "id"              => $post->id,
        "title"           => $post->meta['title'],
        "summary"         => $post->meta['description'],
        "image"           => $post->meta['feature'],
        "content_html"    => $post->html,
        "date_published"  => $post->meta['date-created']->format(),
        "date_modified"   => $post->meta['date-modified']->format(),
        "author"          => $post->meta['author'],
        "url"             => API_ROOT.$this->router->post.$post->id,
        "tags"            => $post->meta['tags']
      ];
      
    }
    
  }
  
  public function getFeed() {
    return $this->feed;
  }
  
}

?>