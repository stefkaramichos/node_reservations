const db = require('../config/db');

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM restaurants');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a specific restaurant by ID
exports.getRestaurantById = async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await db.query('SELECT * FROM restaurants WHERE restaurant_id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new restaurant
exports.createRestaurant = async (req, res) => {
    const { name, location, description } = req.body;
    try {
        const [result] = await db.query('INSERT INTO restaurants (name, location, description) VALUES (?, ?, ?)', [name, location, description]);
        res.status(201).json({ id: result.insertId, name, location, description });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an existing restaurant
exports.updateRestaurant = async (req, res) => {
    const { id } = req.params;
    const { name, location, description } = req.body;
    try {
        const [results] = await db.query('UPDATE restaurants SET name = ?, location = ?, description = ? WHERE restaurant_id = ?', [name, location, description, id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json({ message: 'Restaurant updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a restaurant
exports.deleteRestaurant = async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await db.query('DELETE FROM restaurants WHERE restaurant_id = ?', [id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json({ message: 'Restaurant deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.searchRestaurant = async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === '') {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        const searchTerm = `%${q}%`;
        const [results] = await db.query(
            'SELECT * FROM restaurants WHERE name LIKE ? OR location LIKE ? OR description LIKE ?',
            [searchTerm, searchTerm, searchTerm]
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
