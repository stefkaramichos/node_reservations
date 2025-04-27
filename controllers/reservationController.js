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
            `SELECT 
                rsv.reservation_id,
                rsv.user_id,
                rsv.restaurant_id,
                rsv.date,
                rsv.time,
                rsv.people_count,
    
                us.name AS user_name,
                us.email,
                us.password,
                us.root_admin,
    
                rst.name AS restaurant_name,
                rst.location,
                rst.description
    
            FROM reservations rsv
            JOIN restaurants rst ON rsv.restaurant_id = rst.restaurant_id
            JOIN users us ON rsv.user_id = us.user_id
            WHERE rsv.user_id = ?
            ORDER BY rsv.reservation_id DESC`,
            [user_id]
        );
    
        // Optional: if you really want a merged object (flattened with original field names)
        const result = rows.map(row => ({
            reservation_id: row.reservation_id,
            user_id: row.user_id,
            restaurant_id: row.restaurant_id,
            date: row.date,
            time: row.time,
            people_count: row.people_count,
            name: row.user_name, // user's name
            email: row.email,
            password: row.password,
            root_admin: row.root_admin,
            location: row.location,
            description: row.description,
            restaurant_name: row.restaurant_name
        }));
    
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReservationById = async (req, res) => {
    const { reservation_id } = req.params;

    try {
        const [rows] = await db.query(
            'SELECT * FROM reservations WHERE reservation_id = ?',
            [reservation_id]
        );

        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllReservations = async (req, res) => {
    try {
      const [rows] = await db.query(
        `SELECT 
            rsv.reservation_id,
            rsv.user_id,
            rsv.restaurant_id,
            rsv.date,
            rsv.time,
            rsv.people_count,
  
            us.name AS user_name,
            us.email,
            us.password,
            us.root_admin,
  
            rst.name AS restaurant_name,
            rst.location,
            rst.description
  
         FROM reservations rsv
         JOIN restaurants rst ON rsv.restaurant_id = rst.restaurant_id
         JOIN users us ON rsv.user_id = us.user_id
         ORDER BY rsv.reservation_id DESC`
      );
  
      const result = rows.map(row => ({
        reservation_id: row.reservation_id,
        user_id: row.user_id,
        restaurant_id: row.restaurant_id,
        date: row.date,
        time: row.time,
        people_count: row.people_count,
        name: row.user_name, // user name
        email: row.email,
        password: row.password,
        root_admin: row.root_admin,
        restaurant_name: row.restaurant_name,
        location: row.location,
        description: row.description
      }));
  
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

exports.updateReservation = async (req, res) => {
    const { reservation_id } = req.params;
    const { user_id, restaurant_id, date, time, people_count } = req.body;
    try {
        await db.execute(
            'UPDATE reservations SET user_id = ?, restaurant_id = ?, date = ? , time = ?, people_count = ? WHERE reservation_id = ?',
            [user_id, restaurant_id, date, time, people_count, reservation_id]
        );  
        res.json({ message: "Ο χρήστης ενημερώθηκε επιτυχώς!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteReservation = async (req, res) => {
    const { reservation_id } = req.params;
    try {
        await db.execute('DELETE FROM reservations WHERE reservation_id = ?', [reservation_id]);
        res.json({ message: "Η κράτηση διαγράφηκε επιτυχώς!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
