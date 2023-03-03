const sMessage = require('../models/message');
let listConnectedUsers = [];
module.exports = function (io) {


  io.on('connection', (socket) => {
    listConnectedUsers.push(socket.username);

    io.emit('listConnectedUsers', [...new Set(listConnectedUsers)]);

    console.log(`Connecté au client ${socket.id}`)
    io.emit('notification', { type: 'new_user', data: socket.id });
    // Listener sur la déconnexion
    socket.on('disconnect', () => {
      listConnectedUsers = listConnectedUsers.filter((user) => user !== socket.username);
      io.emit('listConnectedUsers', listConnectedUsers);
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', { type: 'removed_user', data: socket.id });
    });

    socket.on('sendMessage', (msg) => {
      sMessage({
        username: socket.username,
        userId: socket.userId,
        message: msg.message,
      }).save();
      io.emit('message', { message: msg.message, userId: socket.userId, username: socket.username });
    });
  })
}