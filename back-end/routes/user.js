const express = require('express');
const { getSelf, getOneUser } = require('../controllers/user');
const router = express.Router();
const middleware = require('../middleware/auth');

router.get('/self', middleware, getSelf);
router.get('/:id', middleware, getOneUser)

module.exports = router;