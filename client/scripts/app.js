// YOUR CODE HERE:
$(document).ready(function(){

  //variable declarations
  var $messageContainer = $('.messageContainer');
  var $textbox = $('.input');
  var username = window.location.search.slice(10);
  console.log(username);

  var userMessage ={
    'username': username,
    'text': "hellow",
    'roomname': 'test'
  };

  // AJAX ISH
  var getMessages = function(){
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      // data: data,
      contentType: 'application/json',
      success: function(data){
        data['results'].sort(function(a,b){
          return a.createdAt < b.createdAt ? -1:1;
        });
        console.log(data);
        for (var i = 0; i < data.results.length; i++) {
          var message = data.results[i];
          var dataContainer = $("<div />", {'text': message.username +': ' +message.text});
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

  var postMessages = function(message){
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log(userMessage);
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  };


  // Button ish.
  $('.refresh').on('click', function(){
    $messageContainer.html('');
    getMessages();
  });

  $('.send').on('click', function(){
    //console.log($textbox.val());
    postMessages(userMessage);
    $textbox.val('');
    //$('.refresh').trigger();
  });



});