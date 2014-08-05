// YOUR CODE HERE:

var apiUrl = 'https://api.parse.com/1/classes/chatterbox';

var app = {
  friendNet: {
  },
  fetch: function(){
    $.ajax({
    // url: 'https://api.parse.com/1/classes/chatterbox',
      url: apiUrl,
      type: 'GET',
      data: {order: "-createdAt"},
      dataType: 'JSON',
      success: function(data){
        // console.log(data.results.length);
        console.log(data.results);
        var arrLength = data.results.length;
        for( var i = 0; i < 10; i++ ){
          $('#chats').append('<li><a class=username>'+ data.results[i].username + '</a>'+ ": " + data.results[i].text +
            " @room " + data.results[i].roomname + '</li>');
          var rname = data.results[i].roomname;
          app.addRoom(rname);
        }
      },
      failure: function(data){console.log('failed to display:' + data);}
    });
  },
  init: function(){
    $('#main').append('<select id=roomSelect></select>');
    $('#main').append('<input id=message type=text></input>');
    $('#main').append('<button class=submit>submit</button>');
    $('#main').append('<div id=chats></div>');
    $('#main .submit').on('click',function(){
      var message = $('#main').find('#message').val();
      app.handleSubmit(message);
    });
    $('#main').on('click','.username',function(){
      console.log('hello');
      app.addFriend(this.text);
      for(var i = 0; i < $('#chats li').length; i++){
        if($('#chats li').children()[i].text === this.text){
          $($('#chats li')[i]).css('font-weight','bold');
        }
      }
    });
  },
  send: function(message){
    var username = $(location).attr('href').split('=')[1];
    var roomname = $("#main #roomSelect").val();
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify({"username": username, "text": message, "roomname":roomname}),
      contentType:'application/json',
      success: function(data){
        console.log('chatterbox: Message sent');
        // $('div').append('<li' + data.results[i].text + '</li>');
      },
      error: function(data){
        console.error('Chatterbox: failed to send the message!');
      }
    });
  },

  clearMessages: function(){
    $('#chats').empty();
  },

  addMessage: function(message){
    // $('#main').append('<div id=chats></div>');
    $('#main #chats').append('<li><a class=username>' + message.username + '</a>: ' +
      message.text + ' @' + message.roomname + '</li>');
    $('.username').on('click', function(){
      // `(this.text);
      app.addFriend(this.text);
      // addFriend();
    });
  },

  addRoom: function(roomName){
    var list = $('#roomSelect option');
    for(var i = 0; i < list.length; i++){
      if(list[i].value === roomName){
        return;
      }
    }
    $('#roomSelect').append('<option>' + roomName + '</option>');
  },

  addFriend: function(friendName){
    var user = $(location).attr('href').split('=')[1];
    // console.log(this);
    if(this.friendNet[user] === undefined){
      this.friendNet[user] = [];
      this.friendNet[user].push(friendName);
    } else {
      this.friendNet[user].push(friendName);
    }
  },

  handleSubmit: function(message){
    this.send(message);
  }
};

$(document).ready(function(){
  app.init();
  app.fetch();
  app.addRoom('default');
  // $('.username').on('click', function(){
  //   console.log('yo');
  //   app.addFriend(this.text);
  // });
  //setInterval(function(){
    //$('#chats').empty();
    //app.fetch();}, 5000);
});

//setInterval(function(){app.fetch('https://api.parse.com/1/classes/chatterbox');}, 1000);
