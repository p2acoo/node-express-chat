const sMessage = require('../models/message');
let listConnectedUsers = [];
module.exports = function (io) {


  io.on('connection', (socket) => {
    listConnectedUsers.push({ socketId: socket.id, username: socket.username, userId: socket.userId });

    //return unique username
    io.emit('listConnectedUsers', listConnectedUsers.filter((user, index, self) =>
      index === self.findIndex((t) => (
        t.userId === user.userId
      ))
    ).map((user) => {
      return { username: user.username, userId: user.userId }
    })
    );

    console.log(`Connecté au client ${socket.id}`)
    io.emit('notification', { type: 'new_user', data: socket.id });
    socket.on('disconnect', () => {
      listConnectedUsers = listConnectedUsers.filter((user) => user.socketId !== socket.id);

      io.emit('listConnectedUsers', listConnectedUsers.filter((user, index, self) =>
        index === self.findIndex((t) => (
          t.userId === user.userId
        ))
      ).map((user) => {
        return { username: user.username, userId: user.userId }
      }));
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', { type: 'removed_user', data: socket.id });
    });

    socket.on('sendMessage', (msg) => {
      if (msg.message.length > 0 && msg.message.trim().length > 0) {
        sMessage({
          username: socket.username,
          userId: socket.userId,
          message: msg.message,
        }).save();
        io.emit('message', { message: msg.message, userId: socket.userId, username: socket.username });
      }
    });
  })
}