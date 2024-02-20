const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const port = 3000;
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, '/public')));

// Listenning client connection
io.on("connection", function (socket) {

    // Listenning event newuser send to front app(newuser) from back app that reply with event(update): joigned + username
    socket.on('newuser', function(username) {

        socket.broadcast.emit('update', username + ' joigned the conversation');
    });
  
    // Listenning event exituser send to front app(exituser) from back app that reply with event(update): left + username
    socket.on('exituser', function(username) {
  
        socket.broadcast.emit('update', username + ' left the conversation');
    });
    
    // Listenning event chat send to front from back app that reply with event(chat): message(username + text)
    socket.on('chat', function(message) {
   
        socket.broadcast.emit('chat', message);  
    });  
   
});

server.listen(port, () => {
    console.log('App listenning port: http://localhost:'+ port);
});     