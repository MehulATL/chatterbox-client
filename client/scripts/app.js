// YOUR CODE HERE:
$(document).ready(function(){

  // our variable declarations
  var $messageContainer = $('.messageContainer');
  var $textbox = $('.input');
  var username = window.location.search.slice(10);
  var message;

  // getMessages success
  var getSuccess = function(data){
    var roomFilter = [];
      // loop through our data to separate messages.
      for (var i = 0; i < data.results.length; i++) {
        message = data.results[i];
        // putting a limit on message length
        if(data.results[i].text.length > 100) {
          message.text = "I suck";
          console.log(data.results[i]);
        }
        // making a list of all unique chatrooms
        var rooms = data.results[i].roomname;
        if(roomFilter.indexOf(rooms) === -1){
          roomFilter.push(rooms);
        }
        // constructing and appending our message dom nodes
        var dataContainer = $("<div />", {'text': message.username + ': ' + message.text, 'class': 'messageClass ' + message.roomname + ' ' + message.username, 'username':message.username});
        console.log(data);
        $(dataContainer).appendTo($messageContainer);
      }
      // creating and appending our chatroom nodes to the dropdown menu
    for (var j = 0; j < roomFilter.length; j++){
      var roomNodes = $("<option />", {'text': roomFilter[j] });
      roomNodes.appendTo('select');
    }
  }

  // AJAX ISH
var getMessages = function(){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt&limit=25',
    type: 'GET',
    contentType: 'application/json',
    success: function(data){
      getSuccess(data)
    },
    error: function (data) {
      console.error('chatterbox: Failed to get message');
    }
  });
};

getMessages();

var postMessages = function(message){
  $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
};


  // show new messages
  $('.refresh').click(function(){
    $messageContainer.html('');
    $('select').html('');
    getMessages();
  });

  // user message object in the format that our API accepts
  var userMessage = {
    'username': username,
    'text': 'string',
    'roomname': 'hackreactor'
  };

  // send message function
  $('.send').on('click', function(){
    userMessage.text = $textbox.val();
    postMessages(userMessage);
    $textbox.val('');
    $('.refresh').click();
  });

  $textbox.keyup(function(e){
    if(e.keyCode === 13){
      $('.send').click();
    }
  });

  // chat room selection function
  $('select').change(function(){
    var roomSelection = '';
    $('select option:selected').each(function(){
      roomSelection += $(this).text();
    });
    $('.messageClass').show();
    $('.messageClass').not( '.' + roomSelection).hide();
  });

  // add/remove friend function
  $('body').on('click', '.messageClass',function(){
    var userSelection = $(this).attr('username');
    console.log(userSelection);
    $('.' + userSelection).toggleClass('bold');
  });


});