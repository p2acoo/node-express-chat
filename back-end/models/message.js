const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    username: { type: String, required: true },
    userId: { type: String, required: true },
    receiverId: { type: String },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model('Message', messageSchema);