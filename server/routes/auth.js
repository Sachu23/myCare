// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Secret
const JWT_SECRET = 'your_jwt_secret'; // Replace with a secure secret in production

// Helper function to generate JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

// Registration route
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ firstName, lastName, email, password: hashedPassword, role });
      await user.save();
      const token = generateToken(user._id);
      res.status(201).json({ token, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role });
  } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'User registration failed' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.status(200).json({ token, firstName: user.firstName, lastName: user.lastName, role: user.role }); // Include firstName, lastName, and role in response
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
