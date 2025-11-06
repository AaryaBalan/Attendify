const express = require('express');
const router = express.Router();
const { createUser, getUserByEmail, updateUser, getEmployeesByCompany, updateUserStatus, deleteUser } = require('../controllers/usersController.js');

router.post('/create', createUser);
router.get('/getUserByEmail/:email', getUserByEmail);
router.put('/update', updateUser);
router.get('/getEmployeesByCompany/:company', getEmployeesByCompany);
router.put('/updateStatus/:id', updateUserStatus);
router.delete('/delete/:id', deleteUser);

module.exports = router;