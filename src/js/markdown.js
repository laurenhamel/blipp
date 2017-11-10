function Markdown( filename, content, options ) {

  var self = this;
  
  var config = {
    dates: {
      long: 'MMMM D, YYYY',
      short: 'DD.MM.YYYY',
      created: 'date-created',
      modified: 'date-modified',
      formats: [
        'MM-DD-YYYY h:mm A',
        'MM-DD-YY h:mm A',
        'MM-DD-YYYY hh:mm A',
        'MM-DD-YY hh:mm A',
        'MM-DD-YYYY',
        'MM-DD-YY',
        'MM/DD/YYYY h:mm A',
        'MM/DD/YY h:mm A',
        'MM/DD/YYYY hh:mm A',
        'MM/DD/YY hh:mm A',
        'MM/DD/YYYY',
        'MM/DD/YY',
        'MM.DD.YYYY h:mm A',
        'MM.DD.YY h:mm A',
        'MM.DD.YYYY hh:mm A',
        'MM.DD.YY hh:mm A',
        'MM.DD.YYYY',
        'MM.DD.YY'
      ]
    },
    showdown: {
      noHeaderId: true,
      customizedHeaderId: true,
      simplifiedAutoLink: false,
      strikethrough: true,
      underline: true,
      tables: true,
      disabledForced4SpacesIndentedSublists: true,
      emoji: true,
      parseImgDimensions: true,
    },
    icons: [
      'fa',
      'ion'
    ],
    videos: {
      youtube: '//www.youtube.com/embed/{id}',
      vimeo: '//player.vimeo.com/video/{id}',
      vevo: '//embed.vevo.com?isrc={id}'
    }
  };
  
  this.config = Object.assign({}, config, options);
  
  var frontmatter = /(---(?:\S|\s)*---)/g;
  var converter = new showdown.Converter(this.config.showdown);
  var extensions = {
    
    // Treat ${prefix}-{icon} as icons.
    icons: function( data ){
      
      var template = '<span class="{prefix}-{icon}"></span>';
      
      self.config.icons.forEach(function(prefix){
        
        var regex = new RegExp('\\$(' + prefix + ')-([a-z-]+)', 'gi'), 
            matches = [],
            match;
        
        while( (match = regex.exec(data)) !== null ) { matches.push(match); }
        
        matches.forEach(function(match){

          data = data.replace(
            match[0], 
            template.replace('{prefix}', match[1])
                    .replace('{icon}', match[2])
          );
          
        });
        
      });
                            
      return data;
      
    },
    
    // Treat ![{alt}]({source}:{ID}) as iframe videos.
    videos: function( data ){
      
      var template = '<iframe src="{src}" width="{width}" height="{height}" ' +
                        'allowfullscreen frameborder=0>' +
                        '{{alt}}' +
                     '</iframe>',
          width = 560,
          height = 315;
      
      for(var source in self.config.videos) {
        
        var src = self.config.videos[source],
            regex = new RegExp('!\\[(.*)\\]\\(' + source + ':(.+?)(?: (\d+)x(\d+))?\\)', 'gi'), 
            matches = [],
            match;

        while( (match = regex.exec(data)) !== null ) { matches.push(match); }

        matches.forEach(function(match){

          data = data.replace(
            match[0], 
            template.replace('{src}', src.replace('{id}', match[2]))
                    .replace('{width}', (match[3] || width))
                    .replace('{height}', (match[4] || height))
                    .replace('{alt}', match[1])
          );
          
        });
        
      }
                            
      return data;
      
    }
    
  };
  var parser = function(data){
    
    for(var extension in extensions) {
      
      data = extensions[extension](data);
      
    }
      
    return data;
    
  };
  var transformations = {
    array: function(str){
      
      if(typeof str !== 'string') return str;
      
      // Convert arrays.
      if( str.indexOf('[') === 0 && str.indexOf(']') == str.length - 1 ) {

        str = str.replace(/\[|\]/g, '').split(',').map(function(value){
          return value.trim();
        });
        
        for( var i = 0; i < str.length; i++ ) {
          
          str[i] = transformer(str[i]);
          
        }

      }
      
      return str;
      
    },
    object: function(str){
      
      if(typeof str !== 'string') return str;
      
      // Convert objects.
      if( str.indexOf('{') === 0 && str.indexOf('}') == str.length - 1 ) {

        str = str
          .replace(/{|}/g, '')
          .split(',')
          .map(function(pair){
            return pair.split(':').map(function(string){
              return string.trim();
            });
          }).reduce(function(accumulator, current){
            accumulator[current[0]] = current[1];
            return accumulator;
          }, {});
  
          for(var key in str) {
         
            str[key] = transformer(str[key]);

          } 

      }
      
      return str;
      
    },
    date: function(str){
      
      if(typeof str !== 'string') return str;
      
      var date = moment(str, self.config.dates.formats);
      
      return date.isValid() ? date : str;
      
    },
    number: function(str){ 
      
      if(typeof str !== 'string') return str;
      
      // Convert numbers.
      if( !isNaN(+str) && isFinite(+str) ) {
          
          str = +str;
          
      }
      
      return str;
      
    }
  };
  var transformer = function(str){
    
    for(var type in transformations) {
    
      str = transformations[type](str);
    
    }
  
    return str;
    
  };

  this.filename = filename;
  this.file = content;
  this.methods = {
    dates: {
      long: {
        created: function(){ 
          if( !this[this._config.dates.created] ) return;
          return this[this._config.dates.created].format(this._config.dates.long);
        },
        modified: function(){
          if( !this[this._config.dates.modified] ) return;
          return this[this._config.dates.modified].format(this._config.dates.long);
        }
      },
      short: {
        created: function(){
          if( !this[this._config.dates.created] ) return;
          return this[this._config.dates.created].format(this._config.dates.short);
        },
        modified: function(){
          if( !this[this._config.dates.modified] ) return;
          return this[this._config.dates.modified].format(this._config.dates.long);
        }
      },
    }
  };
  this.meta = Object.assign({},
    this.file
      .match(frontmatter)[0]
      .replace(/---/g, '')
      .trim()
      .split(/\n/)
      .filter(function(meta){
        return meta !== undefined && meta !== null & meta !== '';
      })
      .map(function(pair){
    
        // Convert the key-value pair to an array.
        var arr = pair.trim().split(/(.+?):(.+)/).filter(function(string){
          return string !== "";
        }).map(function(string){
          return string.trim();
        });
    
        // Transform the value.
        arr[1] = transformer(arr[1]);

        // Output the array as an object.
        var obj = {};
      
        obj[arr[0]] = arr[1];
      
        return obj;
    
      }, this)
      .reduce(function(accumulator, current){
        return Object.assign(accumulator, current);
      }, {}),
    this.methods,
    {
      _config: this.config
    }
  );
  this.markdown = this.file
    .replace(this.file.match(frontmatter)[0], '')
    .trim();
  this.html = converter.makeHtml(parser(Mustache.render(this.markdown, this.meta)));
  this.id = this.meta.title.replace(/ /g, '-').toLowerCase();
  
}