// YOUR CODE HERE:
$(document).ready(function(){

  var $messageContainer = $('.messageContainer');
  var getMessages = function(){
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      // data: data,
      contentType: 'application/json',
      success: function(data){
        console.log(data);
        for (var i = 0; i < data.results.length; i++) {
          var message = data.results[i];
          var dataContainer = $("<div />", {'text': message.text});
          //console.log(dataContainer);
          $(dataContainer).appendTo($messageContainer);
        }
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message');
      }
    });
  };

  getMessages();

  $('.refresh').on('click', function(){
    $messageContainer.html('');
    getMessages();
  });

});