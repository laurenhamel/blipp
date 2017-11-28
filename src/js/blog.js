// Set root path.
const ROOT_PATH = '/markdown-blog/';

// Load JSON data.
$.when(
  
  $.getJSON(ROOT_PATH + 'meta.json').then(data => { return data; }),
  $.getJSON(ROOT_PATH + 'router.json').then(data => { return data; })
  
).done((BLOG_META, BLOG_ROUTER) => {

// Constants
const API_PATH = ROOT_PATH + BLOG_ROUTER.api;
const FEED_PATH = ROOT_PATH + BLOG_ROUTER.feed;
const SOCIAL_PROFILE_SRC = {
  '500px':            '//500px.com/:username',
  linkedin:           '//linkedin.com/in/:username',
  facebook:           '//facebook.com/:username',
  github:             '//github.com/:username',
  instagram:          '//instagram.com/:username',
  twitter:            '//twitter.com/@:username',
  behance:            '//behance.com/:username',
  dribbble:           '//dribbble.com/:username',
  pinterest:          '//pinterest.com/:username',
  tumblr:             '//:username.tumblr.com',
  myspace:            '//myspace.com/:username',
  google:             '//plus.google.com/:username:id',
  soundcloud:         '//soundcloud.com/:username',
  blogger:            '//:username.blogspot.com',
  coderwall:          '//coderwall.com/:username',
  stackoverflow:      '//stackoverflow.com/users/:id/:username',
  stackexchange:      '//:category.stackexchange.com/users/:id/:username',
  masterbranch:       '//masterbranch.com/d/:username',
  reddit:             '//reddit.com/user/:username',
  livejournal:        '//:username.livejournal.com',
  skype:              'skype::username',
  flickr:             '//flickr.com/photos/:username',
  foursquare:         '//foursquare.com/:username',
  mixcloud:           '//mixcloud.com/:username',
  etsy:               '//etsy.com/people/:username',
  '8tracks':          '//8tracks.com/:username',
  npm:                '//npmjs.com/~:username',
  patreon:            '//patreon.com/:username',
  quora:              '//quora.com/profile/:username',
  researchgate:       '//researchgate.net/profile/:username',
  reverbnation:       '//reverbnation.com/:username',
  slideshare:         '//slideshare.net/:username',
  vimeo:              '//vimeo.com/:username',
  youtube: {
    channel:          '//youtube.com/channel/:username:id',
    user:             '//youtube.com/[:username, :id]'
  },
  vine:               '//vine.co/:username',
  yelp:               '//yelp.com/user_details?userid=:id',
  zerply:             '//zerply.com/:username',
  trello:             '//trello.com/:username',
  sketchfab:          '//sketchfab.com/:username',
  bitbucket:          '//bitbucket.org/:username',
  fundable:           '//fundable.com/:username',
  gofundme: {
    profile:          '//gofundme.com/profile/:username',
    fund:             '//gofundme.com/:fund'
  },
  slack:              '//:team.slack.com/',
  unsplash:           '//unsplace.com/@:username',
  codepen:            '//codepen.io/:username',
  instructables:      '//instructables.com/member/:username',
  gitlab:             '//gitlab.com/:username'
};
const SOCIAL_SHARE_SRC = {
  email:        'mailto:?subject=:title&body=:description Read more at :url.',
  facebook:     '//facebook.com/sharer/sharer.php?u=:url&quote=:description',
  twitter:      '//twitter.com/intent/tweet?&text=:description&url=:url',
  linkedin:     '//linkedin.com/shareArticle?url=:url&title=:title&summary=:description',
  pinterest:    '//pinterest.com/pin/create/bookmarklet?media=:feature&url=:url&description=:description',
  pocket:       '//getpocket.com/save?title=:title&url=:url',
  reddit:       '//reddit.com/submit?url=:url&title=:title',
  tumblr:       '//tumblr.com/widgets/share/tool?canonicalUrl=:url&posttyle=link&title=:title&caption=:description',
  google:       '//plus.google.com/share?url=:url',
  buffer:       '//buffer.com/add?text=:description&url=:url',
  stumpleupon:  '//stumbleupon.com/submit?url=:url&title=:title',
  blogger:      '//blogger.com/blog-this.g?u=:url&n=:title&t=:description',
  livejournal:  '//livejournal.com/update.bml?subject=:title&event=:url',
  myspace:      '//myspace.com/post?u=:url&t=:title&c=:description',
  evernote:     '//evernote.com/clip.action?url=:url',
  flipboard:    '//share.flipboard.com/bookmarklet/popout?v=2&title=:title&url:url',
  instapaper:   '//instapaper.com/edit?url=:url&title=:title&description=:description',
  skype:        '//web.skype.com/share?url=:url',
  digg:         '//digg.com/submit?url=:url&title=:title'
};

// Classes
class API {
  
  constructor( options ) {
    this.params = $.extend({}, options);
    this.src = API_PATH;
  }
  
  // Feed
  getFeed() {
    
    return $.getJSON( this.src + '/feed/?' + $.param(this.params) );
    
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
  getPostBySlug( slug ) {
    
    return $.getJSON( this.src + '/posts/slug/' + slug + '/' );
    
  }
  getPostsByKeywords( keywords ){ 
    
    return $.getJSON( this.src + '/posts/keywords/' + keywords + '/' );
    
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
const methods = {
  
  setTitle( title ) {
    document.title = title;
  },
  
  socialURL( media, credentials = {} ) {
    
    // Interpret media.
    media = media.split('.');
    
    // Initialize source.
    var src = SOCIAL_PROFILE_SRC;
    
    // Get source.
    media.forEach((key) => src = src[key]);
    
    // Exit if no source.
    if( !src ) return;
    
    // Parse source.
    for(var key in credentials) {
      
      var value = credentials[key];
      
      if( src.indexOf(':' + key) > -1 ) {
        
        src = src.replace(':' + key, value);
        
      }
      
    }
    
    // Remove remaining.
    src = src.replace(/:[a-z0-9_-]+(?=:|\/|\.|)/g, '');
    
    // Return the source.
    return src;
    
  },
  
  shareURL( media, credentials = {} ) {
    
    // Interpret media.
    media = media.split('.');
    
    // Initialize source.
    var src = SOCIAL_SHARE_SRC;
    
    // Get source.
    media.forEach((key) => src = src[key]);
    
    // Exit if no source.
    if( !src ) return;
    
    // Parse source.
    for(var key in credentials) {
      
      var value = credentials[key];
      
      if( src.indexOf(':' + key) > -1 ) {

        src = src.replace( ':' + key, encodeURIComponent(value) );
        
      }
      
    }
    
    // Replace URL.
    src = src.replace(':url', location.href);
    
    // Remove remaining.
    src = src.replace(/:[a-z0-9_-]+(?=:|\/|\.|)/g, '');
    
    // Return the source.
    return src;
    
  }
  
};

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
    
    // Set title.
    self.setTitle( BLOG_META.title );
    
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
      },
      share: [
        'email',
        'linkedin',
        'facebook',
        'twitter',
        'google'
      ]
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
      
      // Set title.
      self.setTitle( 
        BLOG_META.title + ' | ' + BLOG_META.prefix.post +
        self.post.meta.title 
      );
      
    });
    
  },
  
  beforeRouteUpdate(to, from, next) {
    
    var self = this,
        api = new API();
    
    // Get post by ID.
    api.getPostById( to.params.id ).then((response) => {
      
      self.post = response.data;
      
      // Set title.
      self.setTitle( 
        BLOG_META.title + ' | ' + BLOG_META.prefix.post +
        self.post.meta.title
      );
      
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
    
    // Set title.
    self.setTitle( 
      BLOG_META.title + ' | ' + BLOG_META.prefix.tag + 
      self.$route.params.category 
    );
    
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
    
    // Set title.
    self.setTitle( 
      BLOG_META.title + ' | ' + BLOG_META.prefix.tag +
      to.params.category 
    );
    
    // Get posts by Category.
    api.getPostsByCategory( to.params.category ).then((response) => {
      
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
    
    // Set title.
    self.setTitle( 
      BLOG_META.title + ' | ' + BLOG_META.prefix.tag +
      self.$route.params.tag 
    );
    
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
    
    // Set title.
    self.setTitle( 
      BLOG_META.title + ' | ' + BLOG_META.prefix.tag + 
      to.params.tag 
    );
    
    // Get posts by Category.
    api.getPostsByTag( to.params.tag ).then((response) => {
      
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
        meta: {},
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
      loading: false,
      socials: Object.keys(SOCIAL_PROFILE_SRC)
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
      
      if( !self.about.meta.facebook ) return;
      
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
    
    // Set title.
    self.setTitle( 
      BLOG_META.title + ' | ' + BLOG_META.prefix.author + 
      self.$route.params.author 
    );
    
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
    
    // Set title.
    self.setTitle(
      BLOG_META.title + ' | ' + BLOG_META.prefix.author +
      to.params.author 
    );
    
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
    },
    {
      path: FEED_PATH,
      redirect: to => { 
        window.location = API_SRC + to.path;
      }
    }
  ]
  
});

// Blog
let Blog = new Vue({

  router,
  
  el: '#blog',
  
  created() {
    
    // Configure clipboard.
    var clipboard = new Clipboard( '.copy' ),
        flag = (target, signal, delay) => {
          
          $(target).addClass(signal);
          
          setTimeout(function(){
            
            $(target).removeClass(signal);
            
          }, delay);
          
        };
    
    clipboard
      .on('success', function(event){
        flag(event.trigger, 'copy-success', 2000);
      })
      .on('error', function(event){
        flag(event.trigger, 'copy-error', 2000);
      });
    
  }

});
  
});