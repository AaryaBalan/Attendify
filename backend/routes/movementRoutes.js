const express = require('express');
const router = express.Router();
const { createUser, getUserByEmail } = require('../controllers/usersController.js');

// router.get('/getUsers', getUsers);
router.post('/create', createUser);
router.get('/getUserByEmail/:email', getUserByEmail);

module.exports = router;