module.exports = function(grunt){
  
  var pkg = require('./package.json'),
      config = require('./package-config.json');
  
  grunt.config.set('pkg', pkg);
  grunt.config.set('config', grunt.config.process(config));

  grunt.config.merge({
    watch: {
      options: { livereload: true },
      startup: {
        files: [],
        tasks: ['clean:demo', 'startup'],
        options: { atBegin: true },
      },
      sass: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass:dev', 'postcss:dev']
      },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['jshint:dev', 'babel:dev']
      },
      php: {
        files: ['src/php/**/*.php', 'router.json'],
        tasks: ['copy:dev:php']
      },
      html: {
        files: ['src/**/*.html'],
        tasks: ['includes:dev', 'rename:dev', 'replace:dev']
      },
      config: {
        files: [
          'Gruntfile.js', 
          'package.json', 
          'composer.json', 
          'package-config.json',
          '.jshintrc',
          '.babelrc'
        ],
        tasks: ['jshint:config', 'startup'],
        options: { reload: true }
      },
      assets: {
        files: ['src/images/**/*', 'src/fonts/**/*'],
        tasks: ['copy:dev-assets']
      },
      test: {
        files: ['test/**/*', 'test/.htaccess'],
        tasks: ['includes:dev', 'rename:dev', 'replace:dev', 'copy:dev-test']
      }
    },
    babel: {
      options: {},
      dev: {
        files: [
          {
            expand: true,
            cwd: 'src/js/',
            src: ['**/*.js'],
            dest: 'demo/js/'
          }
        ]
      },
      dist: {
        files: [
          {expand: true, cwd: 'src/js/', src:['**/*.js'], dest: 'dist/js/'}
        ]
      }
    },
    sass: {
      dev: {
        options: { style: 'expanded', noCache: true, update: true, sourcemap: 'none' },
        files: [
          { expand: true, cwd: 'src/scss/', src: ['*.scss'], dest: 'demo/css/', ext: '.css' }
        ]
      },
      dist: {
        options: { style: 'compressed', noCache: true, sourcemap: 'none' },
        files: [
          { expand: true, cwd: 'src/scss/', src: ['*.scss'], dest: 'dist/css/', ext: '.css' }
        ]
      }
    },
    postcss: {
      options: { 
        processors: [ require('autoprefixer')({ browsers: ['last 2 versions'] }) ]
      },
      dev: {
        src: ['demo/css/**/*.css']
      },
      dist: {
        src: ['dist/css/**/*.css']
      }
    },
    cssmin: {
      dist: {
        files: [
          { 
            expand: true, 
            src: ['dist/css/**/*.css', '!dist/css/**/*.min.css'], 
            dest: '.',
            ext: '.min.css'
          }
        ]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      config: ['Gruntfile.js'],
      dev: ['src/js/**/*.js']
    },
    uglify: {
      dist: {
        files: [
          { 
            expand: true, 
            cwd: '.', 
            src: [
              'dist/js/**/*.js', 
              '!dist/js/**/*.min.js',
              '!dist/js/**/moment.js',
              '!dist/js/**/vue.js',
              '!dist/js/dependencies/codemirror/*.js',
            ],
            dest: '.', 
            ext: '.min.js' 
          }
        ]
      }
    },
    replace: {
      dev: {
        options: {
          patterns: [
            { 
              match: 'css', 
              replacement: function(){
    
                var target = 'css',
                    template = '<link rel="stylesheet" href=":link">',
                    replacement = [], 
                    regex = new RegExp( '(\\.min)?\\.' + target, 'g' ), 
                    ext = '.' + target,
                    route = target + '/';

                grunt.config.get('config')[target].forEach(function(file){
                  replacement.push( template.replace(':link', route + file.replace(regex, '') + ext) );
                });

                return replacement.join("\n");
                
              }
            },
            { 
              match: 'js', 
              replacement: function(){
    
                var target = 'js',
                    template = '<script src=":link"></script>',
                    replacement = [], 
                    regex = new RegExp( '(\\.min)?\\.' + target, 'g' ), 
                    ext = '.' + target,
                    route = target + '/';

                grunt.config.get('config')[target].forEach(function(file){
                  replacement.push( template.replace(':link', route + file.replace(regex, '') + ext) );
                });

                return replacement.join("\n");
                
              }
            },
            { 
              match: 'dependencies:css', 
              replacement: function(){
    
                var target = 'css',
                    template = '<link rel="stylesheet" href=":link">',
                    replacement = [], 
                    regex = new RegExp( '(\\.min)?\\.' + target, 'g' ), 
                    ext = '.' + target,
                    route = target + '/dependencies/';

                grunt.config.get('config').dependencies[target].forEach(function(file){
                  replacement.push( template.replace(':link', route + file.replace(regex, '') + ext) );
                });

                return replacement.join("\n");
              
              }
            },
            { 
              match: 'dependencies:js', 
              replacement: function(){
    
                var target = 'js',
                    template = '<script src=":link"></script>',
                    replacement = [], 
                    regex = new RegExp( '(\\.min)?\\.' + target, 'g' ), 
                    ext = '.' + target,
                    route = target + '/dependencies/';

                Object.keys(grunt.config.get('config').dependencies[target]).forEach(function(file){
                  replacement.push( template.replace(':link', route + file.replace(regex, '') + ext) );
                });

                return replacement.join("\n");
                
              }
            },
            {
              match: 'livereload',
              replacement: '<script src="//localhost:35729/livereload.js"></script>'
            }
          ],
        },
        files: [
          {expand: true, cwd: 'demo/', src: ['*.html'], dest: 'demo/'},
          {expand: true, cwd: 'dist/', src: ['*.html'], dest: 'dist/'}
        ]
      },
      dist: {
        options: {
          patterns: [
            { 
              match: 'css', 
              replacement: function(){
    
                var target = 'css',
                    template = '<link rel="stylesheet" href=":link">',
                    replacement = [], 
                    regex = new RegExp( '(\\.min)?\\.' + target, 'g' ), 
                    ext = '.min.' + target,
                    route = target + '/';

                grunt.config.get('config')[target].forEach(function(file){
                  replacement.push( template.replace(':link', route + file.replace(regex, '') + ext) );
                });

                return replacement.join("\n");
                
              }
            },
            { 
              match: 'js', 
              replacement: function(){
    
                var target = 'js',
                    template = '<script src=":link"></script>',
                    replacement = [], 
                    regex = new RegExp( '(\\.min)?\\.' + target, 'g' ), 
                    ext = '.min.' + target,
                    route = target + '/';

                grunt.config.get('config')[target].forEach(function(file){
                  replacement.push( template.replace(':link', route + file.replace(regex, '') + ext) );
                });

                return replacement.join("\n");
                
              }
            },
            { 
              match: 'dependencies:css', 
              replacement: function(){
    
                var target = 'css',
                    template = '<link rel="stylesheet" href=":link">',
                    replacement = [], 
                    regex = new RegExp( '(\\.min)?\\.' + target, 'g' ), 
                    ext = '.min.' + target,
                    route = target + '/dependencies/';

                grunt.config.get('config').dependencies[target].forEach(function(file){
                  replacement.push( template.replace(':link', route + file.replace(regex, '') + ext) );
                });

                return replacement.join("\n");
              
              }
            },
            { 
              match: 'dependencies:js', 
              replacement: function(){
    
                var target = 'js',
                    template = '<script src=":link"></script>',
                    replacement = [], 
                    regex = new RegExp( '(\\.min)?\\.' + target, 'g' ), 
                    ext = '.min.' + target,
                    route = target + '/dependencies/';

                Object.keys(grunt.config.get('config').dependencies[target]).forEach(function(file){
                  replacement.push( template.replace(':link', route + file.replace(regex, '') + ext) );
                });

                return replacement.join("\n");
                
              }
            },
            {
              match: 'livereload',
              replacement: ''
            }
          ],
        },
        files: [
          {expand: true, cwd: 'demo/', src: ['*.html'], dest: 'demo/'},
          {expand: true, cwd: 'dist/', src: ['*.html'], dest: 'dist/'}
        ]
      },
    },
    copydeps: {
      dev: {
        options: {
          unminified: true,
          minified: false,
          css: true,
          include: {
            js: {
              'codemirror/mode/**/*.js': 'codemirror/'
            }
          }
        },
        pkg: 'package.json',
        dest: {
          js: 'demo/js/dependencies/',
          css: 'demo/css/dependencies/'
        }
      },
      dist: {
        options: {
          unminified: true,
          minified: true,
          css: true,
          include: {
            js: {
              'codemirror/mode/**/*.js': 'codemirror/'
            }
          }
        },
        pkg: 'package.json',
        dest: {
          js: 'dist/js/dependencies/',
          css: 'dist/css/dependencies/'
        }
      }
    },
    includes: {
      dev: {
        options: { 
          includePath: 'src/includes/',
        },
        cwd: 'src/',
        src: ['blog.html'], 
        dest: 'demo/',
      },
      dist: {
        options: {
          includePath: 'src/includes/',
        },
        src: ['src/blog.html', 'src/includes/meta/foot.html', 'src/includes/meta/head.html'],
        dest: 'dist/',
        flatten: true
      }
    },
    copy: {
      'dev-test': {
        files: [
          { expand: true, cwd: 'test/', src: ['**/*'], dest: 'demo/', dot: true }
        ]
      },
      'dev-php': {
        files: [
          { expand: true, cwd: 'src/php', src: ['**/*.php'], dest: 'demo/php' }
        ]
      },
      'dev-assets': {
        files: [
          { expand: true, cwd: 'src/images/', src: ['**'], dest: 'demo/images' },
          { expand: true, cwd: 'src/fonts/', src: ['**'], dest: 'demo/fonts' }
        ]
      },
      'dist-test': {
        files: [
          { 
            expand: true, 
            cwd: 'test/', 
            src: ['**/*', '!**/authors/**', '!**/drafts/**', '!**/posts/**', '!**/images/**'], 
            dest: 'dist/', 
            dot: true 
          }
        ]
      },
      'dist-php': {
        files: [
          { expand: true, cwd: 'src/php', src: ['**/*.php'], dest: 'dist/php' }
        ]
      },
      'dist-assets': {
        files: [
          { expand: true, cwd: 'src/images/', src: ['**'], dest: 'dist/images' },
          { expand: true, cwd: 'src/fonts/', src: ['**'], dest: 'dist/fonts' }
        ]
      },
    },
    clean: {
      demo: ['demo/'],
      dist: ['dist/'],
      unminjs: [
        'dist/js/**/*.js', 
        '!dist/js/**/*.min.js', 
        '!dist/js/dependencies/codemirror/*.js'
      ],
      unmincss: [
        'dist/css/**/*.css', 
        '!dist/css/**/*.min.css'
      ]
    },
    rename: {
      dev: {
        files: [
          {src: 'demo/blog.html', dest: 'demo/index.html'}
        ]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-copy-deps');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-rename-util');

  grunt.registerTask('copy:dev', [
    'copy:dev-test',
    'copy:dev-php',
    'copy:dev-assets',
  ]);
  grunt.registerTask('copy:dist', [
    'copy:dist-test',
    'copy:dist-php',
    'copy:dist-assets',
  ]);
  grunt.registerTask('default', ['dev']);
  grunt.registerTask('startup', [
    'clean:dist',
    'copydeps:dev',
    'sass:dev',
    'postcss:dev',
    'jshint',
    'babel:dev',
    'copy:dev',
    'includes:dev',
    'rename:dev',
    'replace:dev'
  ]);
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('dist', [
    'clean:dist',
    'copydeps:dist',
    'sass:dist',
    'postcss:dist',
    'copy:dist',
    'cssmin:dist',
    'babel:dist',
    'uglify:dist',
    'includes:dist',
    'replace:dist',
    'clean:unminjs',
    'clean:unmincss',
    'copy:dist'
  ]);
  
};