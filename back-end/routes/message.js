const express = require('express');
const { getAllMessage } = require('../controllers/message');
const router = express.Router();
const middleware = require('../middleware/auth');

router.get('/', middleware, getAllMessage);

module.exports = router;