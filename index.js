var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var Redis = require("ioredis");
var client = new Redis();

var redis_subscribers = {};

var channel_history_max = 100;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

function add_redis_subscriber(subscriber_key) {
    var client = new Redis();

    client.subscribe(subscriber_key);
    client.on('message', function(channel, message) {
        console.log("subscribing to messages", message);
        io.emit(subscriber_key, JSON.parse(message));
    });

    redis_subscribers[subscriber_key] = client;
}
add_redis_subscriber('messages');

io.on('connection', function(socket){
    // socket.on('chat message', function(msg){
    //     console.log("publishing message", msg);
    //     pub.publish('chat message', msg);
    // });

    console.log("connection on");
    var get_messages = client.zrange('messages', -1 * channel_history_max, -1).then(function(result) {
        return result.map(function(x) {
            return JSON.parse(x);
        });
    });
    // console.log("hgetall ", client.hgetall('messages'));
    // var get_messages = client.hgetall('messages').then(function(result) {
    //     return result.map(function(x) {
    //         return JSON.parse(x);
    //     });
    // }).catch(function (err) {
    //     console.log("error");
    // });


    Promise.all([get_messages]).then(function(values) {
        var messages = values[0];
        console.log("messages obtained", messages);
        messages.forEach(msg => {
            io.emit('messages', msg);
        })
        socket.on('send', function(message_text) {
            var message = JSON.stringify({
                message: message_text
            })
            client.zadd('messages', 3, message); 
            client.publish('messages', message);
        });
    }).catch(function(reason) {
        console.log('ERROR: ' + reason);
    });

    // var addMessage = function (message) {
    //     // client.hset('chatmessages', socket.id, JSON.stringify(message));
    //     client.set('chatmessages', message);
    //     getMessages();
    // }

    // var getMessages = client.hgetall('chatmessages', function(err, res) {
    //     if (err){
    //         console.log("error on getmessages", err);
    //     } else {
    //         console.log("result ", res);
    //         return res;
    //     }
    // });

    // var getMessages = client.hgetall('chatmessages').then(function(redis_messages) {
    //     var messages = {};
    //     for (var key in redis_messages) {
    //         messages[key] = JSON.parse(redis_messages[key]);
    //     }redis_messages
    //     return messages;
    // });


  });
  
//   client.subscribe("chat message", function(err, count) {
//     console.log("message", err, count);
//   });
   
//   client.on("message", function(channel, message) {
//     io.emit('chat message', message);
//     console.log("Received message "+message+"  from channel "+channel);
//     // console.log("getMessages", getMessages);
//   });
  

http.listen(3000, function(){
  console.log('listening on *:3000');
});