const express = require('express');
const { getSelf } = require('../controllers/user');
const router = express.Router();
const middleware = require('../middleware/auth');

router.get('/getSelf', middleware, getSelf);

module.exports = router;