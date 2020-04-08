const io = require('socket.io-client');
const socket = io("http://localhost:3000");

socket.on('connect', function() {
    console.log("connected");
    setInterval(function(){ 
        console.log("client invoked");
        socket.emit('send', 'Hi'+new Date().getTime());
        // client.subscribe('messages');
        // client.on('message', function(channel, message){
        //     console.log("message data", channel, message);
        // });
    }, 5000);
});

socket.on('messages', function(msg){
    console.log("msg data ", msg.message);
});