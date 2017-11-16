// Constants
const API_PATH = '/markdown-blog/api/';

// Classes
class API {
  
  constructor( options ) {
    this.params = $.extend({}, options);
    this.src = API_PATH;
  }
  
  // Posts
  getPosts(options) {
    
    return $.getJSON( this.src + '/posts/?' + $.param(this.params) );
    
  }
  getPostsByTag(tag) {
    
    return $.getJSON( this.src + '/posts/tag/' + tag + '/?' + $.param(this.params) );
    
  }
  getPostsByCategory(category) {
    
    return $.getJSON( this.src + '/posts/category/' + category + '/?' + $.param(this.params) );
    
  }
  getPostById(id) {
    
    return $.getJSON( this.src + '/posts/id/' + id + '/' );
    
  }
  
  // Tags
  getTags() {
    
    return $.getJSON( this.src + '/tags/?' + $.param(this.params) );
    
  }
  
  // Categories
  getCategories() {
    
    return $.getJSON( this.src + '/categories/?' + $.param(this.params) );
    
  }
  
}

// Globals
const filters = {
  
  id( value, delimiter = '-' ) {
    
    if( typeof value != 'string' ) return value;
    
    return value.replace(/ /g, delimiter).toLowerCase();
    
  }
  
};
const methods = {};

// Feed
let Feed = Vue.component('feed', {
  
  template: '#feed',
  
  props: ['limit', 'sort', 'order'],
  
  data() {
    return {
      posts: [],
      next: {},
      more: false,
      loading: false
    };
  },
  
  filters: $.extend({}, filters),
  
  methods: $.extend({
    
    loadMore( delay ) {
      
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
      api.getPosts().then((response) => {

        setTimeout(function(){
          
          self.posts = [...self.posts, ...response.data];
          self.loading = false;
          
        }, delay);

        if( response.next ) {

          self.more = true;
          self.next = response.next;

        }

      });
      
    }
    
  }, methods),
  
  created() {
    
    var self = this,
        api = new API({
          sort: this.sort,
          order: this.order,
          limit: this.limit
        });
    
    // Get posts.
    api.getPosts().then((response) => {
    
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
  
  data() {
    return {};
  },
  
  filters: $.extend({}, filters),
  
  methods: $.extend({}, methods)
  
});

// Post
var Post = Vue.component('post', {
  
  template: '#post',
  
  props: ['id'],
  
  data() {
    return {
      post: {}
    };
  },
  
  filters: $.extend({}, filters),
  
  methods: $.extend({}, methods),
  
  created() {
    
    var self = this,
        api = new API(); 
    
    // Get post by ID.
    api.getPostById( self.$route.params.id ).then((response) => {
    
      self.post = response.data;
      
    });
    
  },
  
  beforeRouteUpdate(to, from, next) {
    
    var self = this,
        api = new API();
    
    // Get post by ID.
    api.getPostById( to.$route.params.id ).then((response) => {
      
      self.post = response.data;
      
      next();
      
    });
    
  }
  
});

// Category
var Category = Vue.component('category', {
  
  template: '#category',
  
  props: ['category', 'limit', 'sort', 'order'],
  
  data() {
    return {
      posts: []
    };
  },
  
  methods: $.extend({}, methods),
  
  filters: $.extend({}, filters),
  
  created() {
    
    let self = this,
        api = new API({
          limit: this.limit,
          sort: this.sort,
          order: this.order
        });
    
    // Get posts by category.
    api.getPostsByCategory( self.$route.params.category ).then((response) => {
      
      self.posts = response.data; console.log(response);
      
    });
    
  },
  
  beforeRouteUpdate(to, from, next) {
    
    let self = this,
        api = new API({
          limit: this.limit,
          sort: this.sort,
          order: this.order
        });
    
    // Get posts by Category.
    api.getPostsByCategory( to.$route.params.category ).then((response) => {
      
      self.posts = response.data;
      
      next();
      
    });
    
  }
  
});

// Router
var router = new VueRouter({ 
  
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

  router,
  
  el: '#blog',

});