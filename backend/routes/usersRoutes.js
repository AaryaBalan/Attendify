const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/usersController.js');

// router.get('/getUsers', getUsers);
router.post('/create', createUser);

module.exports = router;