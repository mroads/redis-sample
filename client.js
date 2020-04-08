const io = require('socket.io-client');
const socket = io();


setInterval(function(){ 
    console.log("client invoked");
    // client.subscribe('messages');
    // client.on('message', function(channel, message){
    //     console.log("message data", channel, message);
    // });
    socket.on('messages', function(msg){
        console.log("msg data ", msg.message);
    });
}, 5000);