function FrontMatter( content ) {
  
  var regex = /---((?:\S|\s)*)---/g;

  
  this.raw = content;
  this.matter = this.raw.match(regex)[0].replace(/---/g, '').trim();
  this.markdown = this.raw.replace(this.matter, '').trim();
  this.data = this.matter.split(/\n/).map(function(pair){ 
    
    var arr = pair.trim().split(':').map(function(string){
      
      return string.trim();
      
    });
    
    if(arr[0].toLowerCase().indexOf('date') > -1) {
      
      arr[1] = arr[1] ? moment(arr[1]) : moment();
      
    }
    
    var obj = {};
    
    obj[arr[0]] = arr[1];
    
    return obj;
    
  }).reduce(function(accumulator, current){
    
    return Object.assign(accumulator, current);
    
  }, {});
  
}

// TODO: Get and read the contents of the the markdown file.

// TODO: Extract the front matter from the markdown file.


$.get('../posts/test.md').then(function(contents){
  
  var frontMatter = new FrontMatter(contents);
  
  console.log( frontMatter.data );
  
});