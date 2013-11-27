//events = Backbone.Events();

// YOUR CODE HERE:
var Messages = function(){
  this.$messageContainer = $('.messageContainer');
  this.get();
 };

Messages.prototype.add = function (options){
  // debugger;
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(options),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

// AJAX ISH
Messages.prototype.get = function(option){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt&limit=25',
    type: 'GET',
    contentType: 'application/json',
    success: function(data){
      var roomFilter = [];
        // loop through our data to separate messages.
        for (var i = 0; i < data.results.length; i++) {
          message = data.results[i];
          // putting a limit on message length
          // if(data.results[i].text.length > 100) {
          //   message.text = "I suck";
          //   console.log(data.results[i]);
          // }
          // making a list of all unique chatrooms
          var rooms = data.results[i].roomname;
          if(roomFilter.indexOf(rooms) === -1){
            roomFilter.push(rooms);
          }
          // constructing and appending our message dom nodes
          var dataContainer = $("<div />", {'text': message.username + ': ' + message.text, 'class': 'messageClass ' + message.roomname + ' ' + message.username, 'username':message.username});
          $(dataContainer).appendTo($('.messageContainer'));
        }
      // creating and appending our chatroom nodes to the dropdown menu
      for (var j = 0; j < roomFilter.length; j++){
        var roomNodes = $("<option />", {'text': roomFilter[j] });
        roomNodes.appendTo('select');
      }
    },
    error: function (data) {
      console.error('chatterbox: Failed to get message');
    }
  });
};



var NewMessageView = function(options){
  var $messageContainer = $('.messageContainer');
  var $textbox = $('.input');
  var username = window.location.search.slice(10);
  var message;

  // user message object in the format that our API accepts
  var userMessage = {
    'username': username,
    'text': 'string',
    'roomname': 'hackreactor'
  };

  // show new messages
  $('.refresh').click(function(){
    $messageContainer.html('');
    $('select').html('');
    Messages.prototype.get();
  });

  // send message function
  $('.send').on('click', function(){
    userMessage.text = $textbox.val();
    debugger;
    Messages.prototype.add(userMessage);
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
    $('.' + userSelection).toggleClass('bold');
  });
};

$(document).ready(function(){

  var messages = new Messages();
  new NewMessageView({messages: messages});
});