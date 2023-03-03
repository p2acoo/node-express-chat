require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

// export one function that gets called once as the server is being initialized
module.exports = function (app, server) {

    const mongoose = require('mongoose');
    mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log('DB is OK'))
        .catch(() => console.log('DB failed'));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', '*');

        next();
    });

    app.use(express.json());


    const io = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (token) {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decodedToken.userId;
            const username = decodedToken.username;
            socket.userId = userId;
            socket.username = username;
            next();
        } else {
            next(new Error('Authentication error'));
        }
    });

    require('./socket/chat')(io);

    app.use(function (req, res, next) { req.io = io; next(); });

    const authRoutes = require('./routes/auth');
    app.use('/api/auth', authRoutes);

    const userRoutes = require('./routes/user');
    app.use('/api/user', userRoutes);

    const messageRoutes = require('./routes/message');
    app.use('/api/message', messageRoutes);

    app.get('/test', (req, res, next) => {
        res.status(200).json({ hello: 'world' })
    })
}