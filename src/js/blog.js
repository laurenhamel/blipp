// Globals
var filters = {};
var methods = {

  getFiles: function( callback ){

    var data = {};
    
    $.when(
      
      // Get post data.
      $.get('php/feed.php').then(function(data){
        return JSON.parse(data);
      }),
      
      // Get router data.
      $.get('../router.json').then(function(data){
        return data;
      })
   
    ).then(function(files, router){
      
      data.files = files;
      data.router = router;
      
      // Fire the callback.
      if( $.isFunction(callback) ) callback(data);
      
    });

    return data;

  },
  
  getPosts: function( files, router, callback ){
    
    var deferreds = [], posts = [];
    
    for( var i = 0; i < files.length; i++ ){

      var file = files[i];

      deferreds.push(
        $.get(router.root + router.posts + file).then(function(data){
          posts.push( new Markdown(file, data) );
        })
      );

    }
    
    $.when.apply($, deferreds).then(function(){
      
      if($.isFunction(callback)) callback(posts);
      
    });
    
    return posts;

  },
  
  getPostByID: function( id, feed ){
    
    return feed.filter(function(post){ 
      return post.id == id;
    })[0];
    
  },
  
};

// Feed
var Feed = Vue.component('feed', {
  
  template: '#feed',
  
  props: ['count', 'sort'],
  
  data: function(){
    return {
      files: [],
      posts: [],
      router: {},
      more: true
    };
  },
  
  filters: $.extend({}, filters),
  
  methods: $.extend({
      
    newest: function( posts, date ) {
      
      return posts.slice(0).sort(function(a, b){
  
        if(a.meta[date] < b.meta[date]) return 1;
        if(a.meta[date] > b.meta[date]) return -1;
        return 0;
        
      });
      
    },
    
    oldest: function( posts, date ) {
      
      return posts.slice(0).sort(function(a, b){
  
        if(a.meta[date] < b.meta[date]) return -1;
        if(a.meta[date] > b.meta[date]) return 1;
        return 0;
        
      });
      
    }
    
  }, methods),
  
  created: function(){
    
    var self = this;
    
    self.getFiles(function(data){
      
      self.files = data.files;
      self.router = data.router;
      self.posts = self.getPosts( self.files, self.router );

    });
    
  }
  
});

// Snippet
var Snippet = Vue.component('snippet', {
  
  template: '#snippet',
  
  props: ['post'],
  
  data: function(){
    return {};
  },
  
  filters: $.extend({}, filters),
  
  methods: $.extend({}, methods)
  
});

// Post
var Post = Vue.component('post', {
  
  template: '#post',
  
  props: ['id'],
  
  data: function(){
    return {
      files: [],
      posts: [],
      router: {},
      post: {}
    };
  },
  
  methods: $.extend({}, methods),
  
  created: function(){
    
    var self = this; 
      
    self.getFiles(function(data){ 

      self.files = data.files;
      self.router = data.router;
      self.posts = self.getPosts( self.files, self.router );
      self.posts = self.getPosts( self.files, self.router, function(data){
        
        self.post = self.getPostByID( self.id, data );
        
      });

    });
    
  },
  
  beforeRouteUpdate: function(to, from, next){
    
    var self = this;
                      
    self.getFiles(function(data){ 

      self.files = data.files;
      self.router = data.router;
      self.posts = self.getPosts( self.files, self.router, function(data){
        
        self.post = self.getPostByID( to.id, data );
        
      });

    });
    
  }
  
});

// Router
var Router = new VueRouter({ 
  
  routes: [
    { 
      path: '/', 
      component: Feed, 
      props: { 
        count: 10, 
        sort: 'date-created'
      } 
    },
    { 
      path: '/post/:id', 
      component: Post, 
      props: true 
    }
  ]
  
});

// Blog
var Blog = new Vue({

  router: Router,
  
  el: '#blog',

});