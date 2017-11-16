// Constants
var API_PATH = '/markdown-blog/api/';

// Constructors
var API = function( options ) {
  
  this.src = API_PATH;
  this.params = $.extend({}, options);
  
  // Posts
  this.getPosts = function( options ){
    
    return $.getJSON( this.src + '/posts/?' + $.param(this.params) );
    
  };
  this.getPostsByTag = function( tag ){
    
    return $.getJSON( this.src + '/posts/tag/' + tag + '/?' + $.param(this.params) );
    
  };
  this.getPostsByCategory = function( category ){
    
    return $.getJSON( this.src + '/posts/category/' + category + '/?' + $.param(this.params) );
    
  };
  this.getPostById = function( id ){
    
    return $.getJSON( this.src + '/posts/id/' + id + '/' );
    
  };
  
  // Tags
  this.getTags = function(){
    
    return $.getJSON( this.src + '/tags/?' + $.param(this.params) );
    
  };
  
  // Categories
  this.getCategories = function(){
    
    return $.getJSON( this.src + '/categories/?' + $.param(this.params) );
    
  };
  
};

// Globals
var filters = {};
var methods = {};

// Feed
var Feed = Vue.component('feed', {
  
  template: '#feed',
  
  props: ['limit', 'sort', 'order'],
  
  data: function(){
    return {
      posts: [],
      next: {},
      more: false,
      loading: false
    };
  },
  
  filters: $.extend({}, filters),
  
  methods: $.extend({
    
    loadMore: function( delay ){
      
      delay = delay || 0;
      
      var self = this,
          api = new API({
            sort: this.sort,
            order: this.order,
            limit: this.next.limit,
            offset: this.next.offset
          });
      
      self.next = {};
      self.more = false;
      self.loading = true;
    
      // Get posts.
      api.getPosts().then(function(response){

        setTimeout(function(){
          
          self.posts = self.posts.concat(response.data);
          self.loading = false;
          
        }, delay);

        if( response.next ) {

          self.more = true;
          self.next = response.next;

        }

      });
      
    }
    
  }, methods),
  
  created: function(){
    
    var self = this,
        api = new API({
          sort: this.sort,
          order: this.order,
          limit: this.limit
        });
    
    // Get posts.
    api.getPosts().then(function(response){
    
      self.posts = response.data;
      
      if( response.next ) {
        
        self.more = true;
        self.next = response.next;
        
      }
      
    });
    
  }
  
});

// Snippet
var Snippet = Vue.component('snippet', {
  
  template: '#snippet',
  
  props: ['post', 'link'],
  
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
      post: {}
    };
  },
  
  filters: $.extend({}, filters),
  
  methods: $.extend({}, methods),
  
  created: function(){
    
    var self = this,
        api = new API();
    
    // Get post by ID.
    api.getPostById( this.$route.params.id ).then(function(response){
      
      self.post = response.data;
      
    });
    
  },
  
  beforeRouteUpdate: function(to, from, next){
    
    var self = this,
        api = new API();
    
    // Get post by ID.
    api.getPostById( to.$route.params.id ).then(function(response){
      
      self.post = response.data;
      
      next();
      
    });
    
  }
  
});

// Category
var Category = Vue.component('category', {
  
  template: '#category',
  
  props: ['category', 'limit', 'sort', 'order'],
  
  data: function(){
    return {
      posts: []
    };
  },
  
  methods: $.extend({}, methods),
  
  filters: $.extend({}, filters),
  
  created: function(){
    
    var self = this,
        api = new API({
          limit: this.limit,
          sort: this.sort,
          order: this.order
        });
    
    // Get posts by category.
    api.getPostsByCategory( this.$route.params.category ).then(function(response){
      
      self.posts = response.data; console.log(response);
      
    });
    
  },
  
  beforeRouteUpdate: function(to, from, next){
    
    var self = this,
        api = new API({
          limit: this.limit,
          sort: this.sort,
          order: this.order
        });
    
    // Get posts by Category.
    api.getPostsByCategory( to.$route.params.category ).then(function(response){
      
      self.posts = response.data;
      
      next();
      
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
        limit: 10, 
        sort: 'date-created',
        order: 'newest'
      } 
    },
    { 
      path: '/post/:id', 
      component: Post
    },
    { 
      path: '/category/:category', 
      component: Category, 
      props: { 
        limit: 10, 
        sort: 'date-created',
        order: 'newest'
      }
    }
  ]
  
});

// Blog
var Blog = new Vue({

  router: Router,
  
  el: '#blog',

});