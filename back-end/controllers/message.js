const sMessage = require('../models/message');

exports.getAllMessage = (req, res, next) => {
    sMessage.find({ receiverId: null }).sort({ timestamp: -1 })
        .then(messages => res.status(200).json(messages))
        .catch(error => res.status(400).json({ error }));
}

