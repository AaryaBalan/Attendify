const express = require('express');
const router = express.Router();
const { getTodayMovementsById } = require('../controllers/movementController.js');

// router.get('/getUsers', getUsers);
router.get('/getTodayMovementsById/:id', getTodayMovementsById);
// router.post('/movein', movein);
// router.get('/getUserByEmail/:email', getUserByEmail);

module.exports = router;