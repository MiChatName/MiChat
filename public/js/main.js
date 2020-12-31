//sending message to the server when a user sends a message
const chatForm = document.getElementById('chat-form');
//getting the DOM to help scroll to last message
const chatMessages = document.querySelector('.chat-messages');
//importing the room name and the list of members from the chat.html
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//Join chatroom
socket.emit('joinRoom', {username, room});

//Get room and users 
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//Message from server
socket.on('message', message => {
    console.log(message);

    //getting the message to display to the users
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
//craeting an event listener for the form
chatForm.addEventListener('submit', (e) => {
    //prevents default behavior that sends message to file
    e.preventDefault();
    //getting the text input
    const msg = e.target.elements.msg.value

    //Emit message to server
    socket.emit('chatMessage', msg);

    //clear input after message is been sent
     e.target.elements.msg.value = '';
     //focus on the empty input
     e.target.elements.msg.focus();
});

//output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


//Add room name to DOM
function outputRoomName(room) {
   roomName.innerHTML = room;
}

//Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`;
};