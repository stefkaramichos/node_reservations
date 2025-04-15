require('dotenv').config();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;


exports.createReservation = async (req, res) => {
    const { user_id, restaurant_id, date, time, people_count } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO reservations (user_id, restaurant_id, date, time, people_count) VALUES (?, ?, ?, ?, ?)',
            [user_id, restaurant_id, date, time, people_count]
        );
        res.status(201).json({ 
            reservation_id: result.insertId,
            user_id,
            restaurant_id,
            date,
            time,
            people_count 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getReservationsByUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const [rows] = await db.query(
            'SELECT * FROM reservations WHERE user_id = ?',
            [user_id]
        );

        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};