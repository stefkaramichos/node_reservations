const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const logger = require('../middleware/logger');

// Get all restaurants
router.get('/', restaurantController.getAllRestaurants);

// Search restaurants by name or location
router.get('/search', restaurantController.searchRestaurant);

// Get a single restaurant by ID
router.get('/:id', restaurantController.getRestaurantById);

// Create a new restaurant
router.post('/', restaurantController.createRestaurant);

// Update a restaurant
router.put('/:id', restaurantController.updateRestaurant);

// Delete a restaurant
router.delete('/:id',logger, restaurantController.deleteRestaurant);

module.exports = router;
