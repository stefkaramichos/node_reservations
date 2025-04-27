const express = require('express');
const router = express.Router();
const { getUsers, registerUser, updateUser, deleteUser, loginUser, getUser } = require('../controllers/userController');
const logger = require('../middleware/logger');
// Existing routes
router.get('/', logger, getUsers);
router.get('/:user_id', logger, getUser);
router.post('/register', registerUser);


// Protect routes that require authentication

router.put('/:user_id', logger, updateUser);
router.delete('/:id', logger, deleteUser);


// New route for login
router.post('/login', loginUser); // Add login route

module.exports = router;
