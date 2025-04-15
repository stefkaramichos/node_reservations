const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const logger = require('../middleware/logger');

router.post('/', logger, reservationController.createReservation);
router.get('/:user_id', logger, reservationController.getReservationsByUser);

module.exports = router; 
