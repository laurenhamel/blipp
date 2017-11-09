function Markdown( content ) {
  
  var frontmatter = /(---(?:\S|\s)*---)/g;
  var converter = new showdown.Converter({
    customizedHeaderId: true,
    strikethrough: true,
    tables: true,
    disabledForced4SpacesIndentedSublists: true
  });

  this.file = content;
  this.meta = this.file
    .match(frontmatter)[0]
    .replace(/---/g, '')
    .trim()
    .split(/\n/)
    .map(function(pair){ 
    
      var arr = pair.trim().split(':').map(function(string){
        return string.trim();
      });
    
      if(arr[0].toLowerCase().indexOf('date') > -1) arr[1] = arr[1] ? moment(arr[1]) : moment();
    
      if( $.isNumeric(arr[1]) ) arr[1] = +arr[1];
    
      var obj = {};
    
      obj[arr[0]] = arr[1];
    
      return obj;
    
    })
    .reduce(function(accumulator, current){
      return Object.assign(accumulator, current);
    }, {});
  this.markdown = this.file
    .replace(this.file.match(frontmatter)[0], '')
    .trim();
  this.html = converter.makeHtml(this.markdown);
  
}