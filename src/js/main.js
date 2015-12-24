
$(document).ready(function(){
  $('a').fluidbox({
    closeTrigger: [{
      event: "click"
    }, {
      selector: "window",
      event: "scroll"
    }]
  })

  $('.article').readingTime();

  $('article').readingTime({
    remotePath: 'post.html',
    remoteTarget: '.article'
  });

  $.getScript("/demo/demo.js");

});