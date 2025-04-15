require('dotenv').config(); // This will load environment variables from .env

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // Use the secret from environment variables

const logger = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Get the token from the Authorization header

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach the user info to the request
        next(); // Continue to the next middleware or route
    } catch (error) {
        res.status(400).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = logger;
