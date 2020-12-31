const users = [];


// can connect database here

//join user to chat
//this adds a user to the arrey above
function userJoin(id, username, room) {
    //creating user from the info passed in
  const user = { id, username, room };

  //pushing user to the arrey
  users.push(user);
  
  //returning the user
  return user;
}

//Get the current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
};

//user leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    //checking to see the index is not equal to -1
    if(index !== -1) {
        //returning the users arrey when the user left without the user
        return users.splice(index, 1)[0];
    };
};

//Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

//exporting the functions
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};