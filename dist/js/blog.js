'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Constants
var API_PATH = '/markdown-blog/api/';

// Classes

var API = function () {
  function API(options) {
    _classCallCheck(this, API);

    this.params = $.extend({}, options);
    this.src = API_PATH;
  }

  // Posts


  _createClass(API, [{
    key: 'getPosts',
    value: function getPosts() {

      return $.getJSON(this.src + '/posts/?' + $.param(this.params));
    }
  }, {
    key: 'getPostsByTag',
    value: function getPostsByTag(tag) {

      return $.getJSON(this.src + '/posts/tag/' + tag + '/?' + $.param(this.params));
    }
  }, {
    key: 'getPostsByCategory',
    value: function getPostsByCategory(category) {

      return $.getJSON(this.src + '/posts/category/' + category + '/?' + $.param(this.params));
    }
  }, {
    key: 'getPostsByAuthor',
    value: function getPostsByAuthor(author) {

      return $.getJSON(this.src + '/posts/author/' + author + '/?' + $.param(this.params));
    }
  }, {
    key: 'getPostById',
    value: function getPostById(id) {

      return $.getJSON(this.src + '/posts/id/' + id + '/');
    }

    // Tags

  }, {
    key: 'getTags',
    value: function getTags() {

      return $.getJSON(this.src + '/tags/?' + $.param(this.params));
    }

    // Categories

  }, {
    key: 'getCategories',
    value: function getCategories() {

      return $.getJSON(this.src + '/categories/?' + $.param(this.params));
    }

    // Authors

  }, {
    key: 'getAuthors',
    value: function getAuthors() {

      return $.getJSON(this.src + '/authors/?' + $.param(this.params));
    }
  }, {
    key: 'getAuthorByName',
    value: function getAuthorByName(name) {

      return $.getJSON(this.src + '/authors/name/' + name + '/?' + $.param(this.params));
    }
  }]);

  return API;
}();

var Facebook = function () {
  function Facebook(options) {
    _classCallCheck(this, Facebook);

    this.params = $.extend({}, options);
    this.src = '//graph.facebook.com';
    this.version = 'v2.11';
  }

  // User


  _createClass(Facebook, [{
    key: 'getUserProfileImage',
    value: function getUserProfileImage(id) {

      return this.src + '/' + this.version + '/' + id + '/picture/?' + $.param(this.params);
    }
  }]);

  return Facebook;
}();

// Globals


var filters = {
  id: function id(value) {
    var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '-';


    if (typeof value != 'string') return value;

    return value.replace(/ /g, delimiter).toLowerCase();
  },
  date: function date(value) {
    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'MMMM d, YYYY';


    var date = moment(value);

    return date.isValid() ? date.format(format) : value;
  }
};
var methods = {};

// Feed
var Feed = Vue.component('feed', {

  template: '#feed',

  props: ['limit', 'sort', 'order'],

  data: function data() {
    return {
      posts: [],
      next: {},
      more: false,
      loading: false
    };
  },


  filters: $.extend({}, filters),

  methods: $.extend({
    loadMore: function loadMore(delay) {

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
      api.getPosts().then(function (response) {

        setTimeout(function () {

          self.posts = [].concat(_toConsumableArray(self.posts), _toConsumableArray(response.data));
          self.loading = false;
        }, delay);

        if (response.next) {

          self.more = true;
          self.next = response.next;
        }
      });
    }
  }, methods),

  created: function created() {

    var self = this,
        api = new API({
      sort: this.sort,
      order: this.order,
      limit: this.limit
    });

    // Get posts.
    api.getPosts().then(function (response) {

      self.posts = response.data;

      if (response.next) {

        self.more = true;
        self.next = response.next;
      }
    });
  }
});

// Snippet
var Snippet = Vue.component('snippet', {

  template: '#snippet',

  props: ['post'],

  data: function data() {
    return {};
  },


  filters: $.extend({}, filters),

  methods: $.extend({}, methods)

});

// Post
var Post = Vue.component('post', {

  template: '#post',

  props: ['id'],

  data: function data() {
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

  created: function created() {

    var self = this,
        api = new API();

    // Get post by ID.
    api.getPostById(self.$route.params.id).then(function (response) {

      self.post = response.data;
    });
  },
  beforeRouteUpdate: function beforeRouteUpdate(to, from, next) {

    var self = this,
        api = new API();

    // Get post by ID.
    api.getPostById(to.params.id).then(function (response) {

      self.post = response.data;

      next();
    });
  }
});

// Category
var Category = Vue.component('category', {

  template: '#category',

  props: ['category', 'limit', 'sort', 'order'],

  data: function data() {
    return {
      posts: [],
      next: {},
      more: false,
      loading: false
    };
  },


  methods: $.extend({
    loadMore: function loadMore(delay) {

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
      api.getPosts().then(function (response) {

        setTimeout(function () {

          self.posts = [].concat(_toConsumableArray(self.posts), _toConsumableArray(response.data));
          self.loading = false;
        }, delay);

        if (response.next) {

          self.more = true;
          self.next = response.next;
        }
      });
    }
  }, methods),

  filters: $.extend({}, filters),

  created: function created() {

    var self = this,
        api = new API({
      limit: this.limit,
      sort: this.sort,
      order: this.order
    });

    // Get posts by category.
    api.getPostsByCategory(self.$route.params.category).then(function (response) {

      self.posts = response.data;

      if (response.next) {

        self.more = true;
        self.next = response.next;
      }
    });
  },
  beforeRouteUpdate: function beforeRouteUpdate(to, from, next) {

    var self = this,
        api = new API({
      limit: this.limit,
      sort: this.sort,
      order: this.order
    });

    // Get posts by Category.
    api.getPostsByCategory(to.$route.params.category).then(function (response) {

      self.posts = response.data;

      if (response.next) {

        self.more = true;
        self.next = response.next;
      }

      next();
    });
  }
});

// Tag
var Tag = Vue.component('tag', {

  template: '#tag',

  props: ['tag', 'limit', 'sort', 'order'],

  data: function data() {
    return {
      posts: [],
      next: {},
      more: false,
      loading: false
    };
  },


  methods: $.extend({
    loadMore: function loadMore(delay) {

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
      api.getPosts().then(function (response) {

        setTimeout(function () {

          self.posts = [].concat(_toConsumableArray(self.posts), _toConsumableArray(response.data));
          self.loading = false;
        }, delay);

        if (response.next) {

          self.more = true;
          self.next = response.next;
        }
      });
    }
  }, methods),

  filters: $.extend({}, filters),

  created: function created() {

    var self = this,
        api = new API({
      limit: this.limit,
      sort: this.sort,
      order: this.order
    });

    // Get posts by category.
    api.getPostsByTag(self.$route.params.tag).then(function (response) {

      self.posts = response.data;

      if (response.next) {

        self.more = true;
        self.next = response.next;
      }
    });
  },
  beforeRouteUpdate: function beforeRouteUpdate(to, from, next) {

    var self = this,
        api = new API({
      limit: this.limit,
      sort: this.sort,
      order: this.order
    });

    // Get posts by Category.
    api.getPostsByTag(to.$route.params.tag).then(function (response) {

      self.posts = response.data;

      if (response.next) {

        self.more = true;
        self.next = response.next;
      }

      next();
    });
  }
});

// Author
var Author = Vue.component('author', {

  template: '#author',

  props: ['author', 'limit', 'sort', 'order'],

  data: function data() {
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
    loadMore: function loadMore(delay) {

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
      api.getPosts().then(function (response) {

        setTimeout(function () {

          self.posts = [].concat(_toConsumableArray(self.posts), _toConsumableArray(response.data));
          self.loading = false;
        }, delay);

        if (response.next) {

          self.more = true;
          self.next = response.next;
        }
      });
    },
    getFbProfileImage: function getFbProfileImage() {

      var self = this,
          id;

      if (id = self.about.meta.facebook.id) {

        var api = new Facebook({
          width: 300
        });

        // Get profile image.
        return api.getUserProfileImage(id);
      }
    }
  }, methods),

  filters: $.extend({}, filters),

  created: function created() {

    var self = this,
        api = new API({
      limit: this.limit,
      sort: this.sort,
      order: this.order
    });

    // Get information about author.
    api.getAuthorByName(self.$route.params.author).then(function (response) {

      self.about = response.data;
    });

    // Get posts by author.
    api.getPostsByAuthor(self.$route.params.author).then(function (response) {

      self.posts = response.data;

      if (response.next) {

        self.more = true;
        self.next = response.next;
      }
    });
  },
  beforeRouteUpdate: function beforeRouteUpdate(to, from, next) {

    var self = this,
        api = new API({
      limit: this.limit,
      sort: this.sort,
      order: this.order
    }),
        deferreds = [];

    // Get information about author.
    deferreds.push(api.getAuthorByName(to.params.author).then(function (response) {

      self.about = response.data;
    }));

    // Get posts by author.
    deferreds.push(api.getPostsByAuthor(to.params.author).then(function (response) {

      self.posts = response.data;

      if (response.next) {

        self.more = true;
        self.next = response.next;
      }
    }));

    $.when(deferreds, function () {

      next();
    });
  }
});

// Router
var router = new VueRouter({

  routes: [{
    path: '/',
    component: Feed,
    props: {
      limit: 10,
      sort: 'date-created',
      order: 'newest'
    }
  }, {
    path: '/post/:id',
    component: Post
  }, {
    path: '/category/:category',
    component: Category,
    props: {
      limit: 10,
      sort: 'date-created',
      order: 'newest'
    }
  }, {
    path: '/tag/:tag',
    component: Tag,
    props: {
      limit: 10,
      sort: 'date-created',
      order: 'newest'
    }
  }, {
    path: '/author/:author',
    component: Author,
    props: {
      limit: 10,
      sort: 'date-created',
      order: 'newest'
    }
  }]

});

// Blog
var Blog = new Vue({

  router: router,

  el: '#blog'

});
