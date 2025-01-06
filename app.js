const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Authentication Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Protected Route Example
const authMiddleware = require('./middlewares/auth');
app.get('/protected', authMiddleware, (req, res) => {
  res.send('This is a protected route. You are authenticated!');
});

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Beauty Products E-commerce Website!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
