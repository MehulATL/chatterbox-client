// YOUR CODE HERE:
$(document).ready(function(){

  //variable declarations
  var $messageContainer = $('.messageContainer');
  //var $textbox = $('.input');
  var username = window.location.search.slice(10);
  //console.log(username);
  //console.log(messageValue);
  var message;

  //var room = prompt("What room would you like to enter?");




  // AJAX ISH
  var getMessages = function(){
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt&limit=25', //&where={"room":'+ '"'+ room + '"' + '}' ,
      type: 'GET',
      contentType: 'application/json',
      success: function(data){
        var roomFilter = [];
        for (var i = 0; i < data.results.length; i++) {
          message = data.results[i];
          if(data.results[i].text.length > 100) {
            message.text = "I suck";
            console.log(data.results[i]);
          }
          var rooms = data.results[i].roomname;
          if(roomFilter.indexOf(rooms) === -1){
            roomFilter.push(rooms);
          }
          var dataContainer = $("<div />", {'text': message.username + ': ' + message.text, 'class': 'messageClass ' + message.roomname + ' ' + message.username, 'username':message.username});
          console.log(data);
          $(dataContainer).appendTo($messageContainer);
        }
        for (var j = 0; j < roomFilter.length; j++){
          var roomNodes = $("<option />", {'text': roomFilter[j] });
          roomNodes.appendTo('select');
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
  $('.refresh').click(function(){
    $messageContainer.html('');
    $('select').html('');
    getMessages();
  });

  // setInterval(showMessages, 500);

  var userMessage = {
    'username': username,
    'text': 'string',
    'roomname': 'hackreactor'
  };

  $('.send').on('click', function(){
    userMessage.text = $('.input').val();
    postMessages(userMessage);
    $('.input').val('');
    $('.refresh').click();
  });

  $('.input').keyup(function(e){
    if(e.keyCode === 13){
      $('.send').click();
    }
  });

  $('select').change(function(){
    var roomSelection = '';
    $('select option:selected').each(function(){
      roomSelection += $(this).text();
    });
    $('.messageClass').show();
    $('.messageClass').not( '.' + roomSelection).hide();
  });


  $('body').on('click', '.messageClass',function(){
    var userSelection = $(this).attr('username');
    console.log(userSelection);
    $('.' + userSelection).toggleClass('bold');

  });

/* TODO --
* add eventlisteners to the chatroom dropdown that will call a function that will filter the chat results.
* for friends just addClass() and that other shit.
* ask Linzay how she did her filtering process.


*/

});