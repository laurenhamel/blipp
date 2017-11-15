// Constants
var API_PATH = '/markdown-blog/api/';

// Constructors
var API = function() {
  
  this.src = API_PATH;
  
  // Posts
  this.getPosts = function(){
    
    return $.getJSON( this.src + '/posts/' );
    
  };
  this.getPostsByTag = function( tag ){
    
    return $.getJSON( this.src + '/posts/tag/' + tag + '/' );
    
  };
  this.getPostsByCategory = function( category ){
    
    return $.getJSON( this.src + '/posts/category/' + category + '/' );
    
  };
  this.getPostById = function( id ){
    
    return $.getJSON( this.src + '/posts/id/' + id + '/' );
    
  };
  
  // Tags
  this.getTags = function(){
    
    return $.getJSON( this.src + '/tags/' );
    
  };
  
  // Categories
  this.getCategories = function(){
    
    return $.getJSON( this.src + '/categories/' );
    
  };
  
};

// Globals
var filters = {};
var methods = {};

// Feed
var Feed = Vue.component('feed', {
  
  template: '#feed',
  
  props: ['count', 'sort'],
  
  data: function(){
    return {
      posts: [],
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
    
    var self = this,
        api = new API();
    
    // Get files.
    api.getPosts().then(function(response){
      
      self.posts = response.data;
      
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
      
    // Get post by ID.
    
  },
  
  beforeRouteUpdate: function(to, from, next){
    
    var self = this;
                      
    // Get post by ID.
    
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