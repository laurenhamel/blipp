// Constants
const API_PATH = '/markdown-blog/api/';

// Classes
class API {
  
  constructor( options ) {
    this.params = $.extend({}, options);
    this.src = API_PATH;
  }
  
  // Posts
  getPosts() {
    
    return $.getJSON( this.src + '/posts/?' + $.param(this.params) );
    
  }
  getPostsByTag( tag ) {
    
    return $.getJSON( this.src + '/posts/tag/' + tag + '/?' + $.param(this.params) );
    
  }
  getPostsByCategory( category ) {
    
    return $.getJSON( this.src + '/posts/category/' + category + '/?' + $.param(this.params) );
    
  }
  getPostsByAuthor( author ) {
    
    return $.getJSON( this.src + '/posts/author/' + author + '/?' + $.param(this.params) );
    
  }
  getPostById( id ) {
    
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
  
  // Authors
  getAuthors() {
    
    return $.getJSON( this.src + '/authors/?' + $.param(this.params) );
    
  }
  getAuthorByName( name ){
    
    return $.getJSON( this.src + '/authors/name/' + name + '/?' + $.param(this.params) );
    
  }
  
}
class Facebook {
  
  constructor( options ) {
    this.params = $.extend({}, options);
    this.src = '//graph.facebook.com';
    this.version = 'v2.11';
  }
  
  // User
  getUserProfileImage( id ) {
    
    return this.src + '/' + this.version + '/' + id + '/picture/?' + $.param(this.params);
    
  }
  
}

// Globals
const filters = {
  
  id( value, delimiter = '-' ) {
    
    if( typeof value != 'string' ) return value;
    
    return value.replace(/ /g, delimiter).toLowerCase();
    
  },
  
  date( value, format = 'MMMM d, YYYY' ) {
    
    var date = moment( value );
    
    return date.isValid() ? date.format( format ) : value;
    
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
let Snippet = Vue.component('snippet', {
  
  template: '#snippet',
  
  props: ['post'],
  
  data() {
    return {};
  },
  
  filters: $.extend({}, filters),
  
  methods: $.extend({}, methods)
  
});

// Post
let Post = Vue.component('post', {
  
  template: '#post',
  
  props: ['id'],
  
  data() {
    return {
      post: {
        config: {},
        meta: {
          'date-created': {},
          'date-modified': {}
        },
        html: null,
        contents: null,
        filename: null,
        frontmatter: null,
        id: null,
        markdown: null,
        path: null
      }
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
    api.getPostById( to.params.id ).then((response) => {
      
      self.post = response.data;
      
      next();
      
    });
    
  }
  
});

// Category
let Category = Vue.component('category', {
  
  template: '#category',
  
  props: ['category', 'limit', 'sort', 'order'],
  
  data() {
    return {
      posts: [],
      next: {},
      more: false,
      loading: false
    };
  },
  
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
      
      self.posts = response.data;
      
      if( response.next ) {
        
        self.more = true;
        self.next = response.next;
        
      }
      
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
      
      if( response.next ) {
        
        self.more = true;
        self.next = response.next;
        
      }
      
      next();
      
    });
    
  }
  
});

// Tag
let Tag = Vue.component('tag', {
  
  template: '#tag',
  
  props: ['tag', 'limit', 'sort', 'order'],
  
  data() {
    return {
      posts: [],
      next: {},
      more: false,
      loading: false
    };
  },
  
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
  
  filters: $.extend({}, filters),
  
  created() {
    
    let self = this,
        api = new API({
          limit: this.limit,
          sort: this.sort,
          order: this.order
        });
    
    // Get posts by category.
    api.getPostsByTag( self.$route.params.tag ).then((response) => {
      
      self.posts = response.data;
      
      if( response.next ) {
        
        self.more = true;
        self.next = response.next;
        
      }
      
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
    api.getPostsByTag( to.$route.params.tag ).then((response) => {
      
      self.posts = response.data;
      
      if( response.next ) {
        
        self.more = true;
        self.next = response.next;
        
      }
      
      next();
      
    });
    
  }
  
});

// Author
let Author = Vue.component('author', {
  
  template: '#author',
  
  props: ['author', 'limit', 'sort', 'order'],
  
  data() {
    return {
      photo: null,
      about: {
        config: {},
        meta: {
          facebook: {},
          linkedin: {},
          instagram: {},
          youtube: {},
          twitter: {},
          github: {},
          behance: {},
          dribbble: {},
          pinterest: {},
          snapchat: {},
          'google+': {}
        },
        html: null,
        markdown: null,
        frontmatter: null,
        path: null,
        filename: null,
        contents: null
      },
      posts: [],
      next: {},
      more: false,
      loading: false
    };
  },
  
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
      
    },
    
    getFbProfileImage() {
      
      var self = this, id;
      
      if( (id = self.about.meta.facebook.id) ) {
        
        var api = new Facebook({
          width: 300
        });
        
        // Get profile image.
        return api.getUserProfileImage( id );
        
      }
      
    }
    
  }, methods),
  
  filters: $.extend({}, filters),
  
  created() {
    
    let self = this,
        api = new API({
          limit: this.limit,
          sort: this.sort,
          order: this.order
        });
    
    // Get information about author.
    api.getAuthorByName( self.$route.params.author ).then((response) => {
      
      self.about = response.data;
      
    });
    
    // Get posts by author.
    api.getPostsByAuthor( self.$route.params.author ).then((response) => {
      
      self.posts = response.data;
      
      if( response.next ) {
        
        self.more = true;
        self.next = response.next;
        
      }
      
    });
    
  },
  
  beforeRouteUpdate(to, from, next) {
    
    let self = this,
        api = new API({
          limit: this.limit,
          sort: this.sort,
          order: this.order
        }),
        deferreds = [];
    
    // Get information about author.
    deferreds.push(
      
      api.getAuthorByName( to.params.author ).then((response) => {
      
        self.about = response.data;

      })
    
    );
    
    // Get posts by author.
    deferreds.push(
      
      api.getPostsByAuthor( to.params.author ).then((response) => {

        self.posts = response.data;

        if( response.next ) {

          self.more = true;
          self.next = response.next;

        }

      })
      
    );
    
    $.when(deferreds, function(){
      
      next();
      
    });
    
  }
  
});

// Router
let router = new VueRouter({ 
  
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
    },
    { 
      path: '/tag/:tag', 
      component: Tag, 
      props: { 
        limit: 10, 
        sort: 'date-created',
        order: 'newest'
      }
    },
    {
      path: '/author/:author',
      component: Author,
      props: {
        limit: 10,
        sort: 'date-created',
        order: 'newest'
      }
    }
  ]
  
});

// Blog
let Blog = new Vue({

  router,
  
  el: '#blog',

});