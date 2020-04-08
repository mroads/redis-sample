
var Redis = require("ioredis");
var http = require('http').createServer(app);
var io = require('socket.io')(http);
export default class Subscription{
    static add_redis_subscriber(subscriber_key) {
        var client = new Redis();
    
        client.subscribe(subscriber_key);
        client.on('message', function(channel, message) {
            console.log("subscribing to messages", message);
            io.emit(subscriber_key, JSON.parse(message));
        });
    
        redis_subscribers[subscriber_key] = client;
    }
}