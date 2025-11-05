const express = require('express');
const router = express.Router();
const { getTodayMovementsById, getTodayStatusById, getMovementsByFilter } = require('../controllers/movementController.js');

router.get('/getTodayMovementsById/:id', getTodayMovementsById);
router.get('/getTodayStatusById/:id', getTodayStatusById);
router.get('/getMovements/:filter/:company', getMovementsByFilter);

module.exports = router;