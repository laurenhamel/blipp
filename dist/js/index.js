$.get('../posts/test.md').then(function(contents){
  
  var data = new Markdown(contents);
  
  $('article').append(data.html);
  
});