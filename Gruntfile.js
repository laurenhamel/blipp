module.exports = function(grunt){
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    pkgconfig: grunt.file.readJSON('package-config.json'),
    watch: {
      options: { livereload: true },
      startup: {
        files: [],
        tasks: ['startup'],
        options: { atBegin: true },
      },
      sass: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass:dev', 'postcss']
      },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['jshint:js', 'babel']
      },
      php: {
        files: ['src/php/**/*.php', 'router.json'],
        tasks: ['copy:php']
      },
      html: {
        files: ['src/**/*.html'],
        tasks: ['includes', 'replace:dev']
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
        tasks: ['copy:assets']
      },
      test: {
        files: ['test/**/*', 'test/.htaccess'],
        tasks: ['includes', 'replace:dev', 'copy:test']
      }
    },
    babel: {
      options: {},
      js: {
        files: [
          {
            expand: true,
            cwd: 'src/js/',
            src: ['**/*.js'],
            dest: 'demo/js/'
          }
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
          { expand: true, cwd: 'src/scss/', src: ['*.scss'], dest: 'demo/css/', ext: '.css' }
        ]
      }
    },
    postcss: {
      options: { 
        processors: [ require('autoprefixer')({ browsers: ['last 2 versions'] }) ]
      },
      dist: {
        src: ['demo/css/**/*.css']
      }
    },
    cssmin: {
      css: {
        files: [
        { 
          expand: true, 
          src: ['demo/css/**/*.css', '!demo/css/**/*.min.css'], 
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
      js: ['src/js/**/*.js']
    },
    uglify: {
      js: {
        files: [
          { 
            expand: true, 
            cwd: '.', 
            src: [
              'demo/js/**/*.js', 
              '!demo/js/**/*.min.js',
              '!demo/js/**/moment.js',
              '!demo/js/**/vue.js',
              '!demo/js/dependencies/codemirror/*.js',
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
                
                var css = [], regex = /(\.min)?\.css/g, ext = '.css';
          
                grunt.config.get('pkgconfig').stylesheets.forEach(function(s){
                  
                  css.push(
                    '<link rel="stylesheet" href="css/'+s.replace(regex, '')+ext+'">'
                  );
                  
                });
                
                return css.join("\n");
                
              }
            },
            { 
              match: 'js', 
              replacement: function(){
                
                var js = [], regex = /(\.min)?\.js/g, ext = '.js';
                
                grunt.config.get('pkgconfig').scripts.forEach(function(s){
                  
                  js.push('<script src="js/'+s.replace(regex, '')+ext+'"></script>');
                  
                });
                
                return js.join("\n");
                
              }
            },
            { 
              match: 'dependencies', 
              replacement: function(){
                
                var dep = [], regex = /(\.min)?\.js/g, ext = '.min.js';
                
                Object.keys(grunt.config.get('pkg').dependencies).forEach(function(d){
                  
                  dep.push('<script src="js/dependencies/'+d.replace(regex, '')+ext+'"></script>');
                  
                });
                
                return dep.join("\n");
                
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
                
                var css = [], regex = /(\.min)?\.css/g, ext = '.min.css';
                
                grunt.config.get('pkgconfig').stylesheets.forEach(function(s){
                  
                  css.push(
                    '<link rel="stylesheet" href="css/'+s.replace(regex, '')+ext+'">'
                  );
                  
                });
                
                return css.join("\n");
                
              }
            },
            { 
              match: 'js', 
              replacement: function(){
                
                var js = [], regex = /(\.min)?\.js/g, ext = '.min.js';
                
                grunt.config.get('pkgconfig').scripts.forEach(function(s){
                  
                  js.push('<script src="js/'+s.replace(regex, '')+ext+'"></script>');
                  
                });
                
                return js.join("\n");
                
              }
            },
            { 
              match: 'dependencies', 
              replacement: function(){
                
                var dep = [], regex = /(\.min)?\.js/g, ext = '.min.js';
                
                Object.keys(grunt.config.get('pkg').dependencies).forEach(function(d){
                  
                  dep.push('<script src="js/dependencies/'+d.replace(regex, '')+ext+'"></script>');
                  
                });
                
                return dep.join("\n");
                
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
      dependencies: {
        options: {
          unminified: true,
          minified: true
        },
        pkg: 'package.json',
        dest: 'demo/js/dependencies/'
      }
    },
    includes: {
      html: {
        options: { 
          includePath: 'src/includes/',
        },
        cwd: 'src/',
        src: ['*.html'], 
        dest: 'demo/'
      },
      integrate: {
        options: {
          includePath: 'src/includes/',
        },
        src: ['src/includes/blog.html', 'src/includes/foot.html', 'src/includes/head.html'],
        dest: 'dist/',
        flatten: true
      }
    },
    copy: {
      test: {
        files: [
          { expand: true, cwd: 'test/', src: ['**/*'], dest: 'demo/', dot: true }
        ]
      },
      php: {
        files: [
          { expand: true, cwd: 'src/php', src: ['**/*.php'], dest: 'demo/php' }
        ]
      },
      assets: {
        files: [
          { expand: true, cwd: 'src/images/', src: ['**'], dest: 'demo/images' },
          { expand: true, cwd: 'src/fonts/', src: ['**'], dest: 'demo/fonts' }
        ]
      },
      dependencies: {
        files: [
          { 
            expand: true, 
            cwd: 'node_modules/codemirror/lib/', 
            src: ['codemirror.css'], 
            dest: 'demo/css/dependencies' 
          },
          { 
            expand: true, 
            flatten: true,
            cwd: 'node_modules/codemirror/mode/', 
            src: ['**/*.js'], 
            dest: 'demo/js/dependencies/codemirror/' 
          },
        ]
      },
      dist: {
        files: [
          { expand: true, cwd: 'demo/', src: ['**/*', '!index.html'], dest: 'dist' }
        ]
      }
    },
    clean: {
      all: ['demo/', 'dist/'],
      unminjs: [
        'demo/js/**/*.js', 
        '!demo/js/**/*.min.js', 
        '!demo/js/dependencies/codemirror/*.js'
      ],
      unmincss: [
        'demo/css/**/*.css', 
        '!demo/css/**/*.min.css'
      ]
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

  grunt.registerTask('default', ['dev']);
  grunt.registerTask('startup', [
    'copydeps',
    'sass:dev',
    'postcss',
    'jshint',
    'babel',
    'uglify',
    'copy:test',
    'copy:php',
    'copy:assets',
    'copy:dependencies',
    'includes',
    'replace:dev'
  ]);
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('dist', [
    'clean:all',
    'copydeps',
    'sass:dist',
    'postcss',
    'copy:test',
    'copy:php',
    'copy:assets',
    'copy:dependencies',
    'cssmin',
    'babel',
    'uglify',
    'includes',
    'replace:dist',
    'clean:unminjs',
    'clean:unmincss',
    'copy:dist'
  ]);
  
};