const express = require('express');
//set path to read from the public folder
const path = require('path');
//calling http in order to create a server
const http = require('http');
const socketIO = require('socket.io');
const { Socket } = require('dgram');
//importing the module from the message.js into the server
const formatMessage = require('./utils/messages');
//importing the module from the users.js
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users'); 

const app = express();
//creating a server variable and set it to a server method and pass in the express app
const server = http.createServer(app);
//initialling socket.io
const io = socketIO(server);
//creating a bot to display admin messages
const botName = 'MiChat Bot';

//set path to the static public folder
app.use(express.static(path.join(__dirname, 'public')));
 
//Run when client connects
io.on('connection', socket => { 
    //getting hold of the quary of the username and room
    socket.on('joinRoom', ({ username, room}) => {
 //user join comming from the URL
        const user = userJoin(socket.id, username, room);
        //joining the users (from the users.js module)
        socket.join(user.room);


    //sending message back and forth to the client
    //Welcoming current user 
    socket.emit('message', formatMessage(botName, 'Welcome to MiChat'))

    //Broadcast when a user connects \ emmitting to a specific room
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));


    //send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    });
    });
    
    //Listen for Chat message
    socket.on('chatMessage', msg => {
        //using the get current user we created here to get the username when a message is sent
        const user = getCurrentUser(socket.id);
    //emitting a message to everybody
    io.to(user.room).emit('message', formatMessage(`${user.username}`, msg))
    });
    //Runs when client disconects
    socket.on('disconnect', () => {
        //Checking the user that left
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
       

            //send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    });
        };        
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


