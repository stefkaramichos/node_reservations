const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const logger = require('../middleware/logger');

router.post('/', logger, reservationController.createReservation);
router.get('/:user_id', logger, reservationController.getReservationsByUser);
router.get('/reservation/:reservation_id', logger, reservationController.getReservationById);
router.put('/reservation/:reservation_id', logger, reservationController.updateReservation);
router.delete('/reservation/:reservation_id', logger, reservationController.deleteReservation);
router.get('/', logger, reservationController.getAllReservations);

module.exports = router; 
