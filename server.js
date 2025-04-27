const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users'); 
const restaurantRoutes = require('./routes/restaurants');
const reservationsRoutes = require('./routes/reservations');

// ✅ Fix CORS Configuration
const corsOptions = {
    origin: ['http://localhost', 'http://localhost:8081', 'http://192.168.1.227:8081'], // Allow multiple origins 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware setup
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/reservations', reservationsRoutes); 

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
 