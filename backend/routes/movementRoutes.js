const express = require('express');
const router = express.Router();
const { getTodayMovementsById, getTodayStatusById } = require('../controllers/movementController.js');

// router.get('/getUsers', getUsers);
router.get('/getTodayMovementsById/:id', getTodayMovementsById);
router.get('/getTodayStatusById/:id', getTodayStatusById);
// router.post('/movein', movein);
// router.get('/getUserByEmail/:email', getUserByEmail);

module.exports = router;