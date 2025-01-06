const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key'; // Replace with your secret key

// Register a new user
router.post(
  '/register',
  [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Enter a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ msg: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();

      res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Login user
router.post(
  '/login',
  [
    check('email', 'Enter a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      res.json({ token, msg: 'Login successful' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Logout user
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ msg: 'Logout successful' });
});

// Export routes
module.exports = router;
