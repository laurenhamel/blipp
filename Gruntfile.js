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
      blog: {
        files: ['posts/**/*', 'drafts/**/*', 'authors/**/*', 'router.json', 'meta.json'],
        tasks: ['includes', 'replace:dev']
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
            dest: 'dist/js/'
          }
        ]
      }
    },
    sass: {
      dev: {
        options: { style: 'expanded', noCache: true, update: true, sourcemap: 'none' },
        files: [
          { expand: true, cwd: 'src/scss/', src: ['*.scss'], dest: 'dist/css/', ext: '.css' }
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
      dist: {
        src: ['dist/css/**/*.css']
      }
    },
    cssmin: {
      css: {
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
      js: ['src/js/**/*.js']
    },
    uglify: {
      js: {
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
                
                var css = [], regex = /(\.min)?\.css/g, ext = '.css';
          
                grunt.config.get('pkgconfig').stylesheets.forEach(function(s){
                  
                  css.push(
                    '<link rel="stylesheet" href="css/'+s.replace(regex, '')+ext+'">'
                  );
                  
                });
                
                return css.join("\n  ");
                
              }
            },
            { 
              match: 'js', 
              replacement: function(){
                
                var js = [], regex = /(\.min)?\.js/g, ext = '.js';
                
                grunt.config.get('pkgconfig').scripts.forEach(function(s){
                  
                  js.push('<script src="js/'+s.replace(regex, '')+ext+'"></script>');
                  
                });
                
                return js.join("\n  ");
                
              }
            },
            { 
              match: 'dependencies', 
              replacement: function(){
                
                var dep = [], regex = /(\.min)?\.js/g, ext = '.min.js';
                
                Object.keys(grunt.config.get('pkg').dependencies).forEach(function(d){
                  
                  dep.push('<script src="js/dependencies/'+d.replace(regex, '')+ext+'"></script>');
                  
                });
                
                return dep.join("\n  ");
                
              }
            },
            {
              match: 'livereload',
              replacement: '<script src="//localhost:35729/livereload.js"></script>'
            }
          ],
        },
        files: [
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
                
                return css.join("\n  ");
                
              }
            },
            { 
              match: 'js', 
              replacement: function(){
                
                var js = [], regex = /(\.min)?\.js/g, ext = '.min.js';
                
                grunt.config.get('pkgconfig').scripts.forEach(function(s){
                  
                  js.push('<script src="js/'+s.replace(regex, '')+ext+'"></script>');
                  
                });
                
                return js.join("\n  ");
                
              }
            },
            { 
              match: 'dependencies', 
              replacement: function(){
                
                var dep = [], regex = /(\.min)?\.js/g, ext = '.min.js';
                
                Object.keys(grunt.config.get('pkg').dependencies).forEach(function(d){
                  
                  dep.push('<script src="js/dependencies/'+d.replace(regex, '')+ext+'"></script>');
                  
                });
                
                return dep.join("\n  ");
                
              }
            },
            {
              match: 'livereload',
              replacement: ''
            }
          ],
        },
        files: [
          {expand: true, cwd: 'dist/', src: ['*.html'], dest: 'dist/'}
        ]
      }
    },
    copydeps: {
      dependencies: {
        options: {
          unminified: true,
          minified: true
        },
        pkg: 'package.json',
        dest: 'dist/js/dependencies/'
      }
    },
    includes: {
      html: {
        options: { 
          includePath: 'src/includes/',
        },
        cwd: 'src/',
        src: ['*.html'], 
        dest: 'dist/'
      }
    },
    copy: {
      php: {
        files: [
          { expand: true, cwd: 'src/php', src: ['**/*.php'], dest: 'dist/php' }
        ]
      },
      assets: {
        files: [
          { expand: true, cwd: 'src/images/', src: ['**'], dest: 'dist/images' },
          { expand: true, cwd: 'src/fonts/', src: ['**'], dest: 'dist/fonts' }
        ]
      },
      dependencies: {
        files: [
          { 
            expand: true, 
            cwd: 'node_modules/codemirror/lib/', 
            src: ['codemirror.css'], 
            dest: 'dist/css/dependencies' 
          },
          { 
            expand: true, 
            flatten: true,
            cwd: 'node_modules/codemirror/mode/', 
            src: ['**/*.js'], 
            dest: 'dist/js/dependencies/codemirror/' 
          },
        ]
      }
    },
    clean: {
      all: ['dist/'],
      unminjs: ['dist/js/**/*.js', '!dist/js/**/*.min.js', '!dist/js/dependencies/codemirror/*.js'],
      unmincss: ['dist/css/**/*.css', '!dist/css/**/*.min.css']
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
    'copy',
    'includes',
    'replace:dev'
  ]);
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('dist', [
    'clean:all',
    'copydeps',
    'sass:dist',
    'postcss',
    'copy',
    'cssmin',
    'babel',
    'uglify',
    'includes',
    'replace:dist',
    'clean:unminjs',
    'clean:unmincss',
  ]);
  
};