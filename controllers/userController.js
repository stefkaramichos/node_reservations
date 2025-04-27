require('dotenv').config();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Register new user
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        res.status(201).json({ message: "User registered successfully!", userId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required!' });
    }
  
    try {
      // Check if user exists
      const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  
      if (users.length === 0) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      const user = users[0];
  
      // Validate password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      // Create JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Respond with token and user info
      res.status(200).json({
        token,
        user: {
          id: user.user_id,
          email: user.email,
          name: user.name, // optional if you store name
          root_admin :user.root_admin
        }
      });
  
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

// Get all users (as before)
exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT * FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get all users (as before)
exports.getUser = async (req, res) => {
  const { user_id } = req.params;
  try {
      const [users] = await db.execute('SELECT * FROM users WHERE user_id = ? ', [user_id]);
      res.json(users);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Update user (as before)
exports.updateUser = async (req, res) => {
    const { user_id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Both name and email are required!' });
    }

    try {
        await db.execute(
            'UPDATE users SET name = ?, email = ? WHERE user_id = ?',
            [name, email, user_id]
        );
        res.json({ message: "User updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete user (as before)
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM users WHERE user_id = ?', [id]);
        res.json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
