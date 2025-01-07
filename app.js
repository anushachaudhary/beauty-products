const express = require('express');
const { auth } = require('express-openid-connect');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // For serving static files
require('dotenv').config();

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Auth0 Configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

// Apply Auth0 Middleware
app.use(auth(config));

// Serve the frontend (index.html) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Root Route - Check if the user is authenticated and display relevant links
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Beauty Products E-commerce Website!</h1>
    ${req.oidc.isAuthenticated() ? `
      <p>Welcome, ${req.oidc.user.name}!</p>
      <a href="/logout">Logout</a>
    ` : `
      <a href="/login">Login</a>
    `}
  `);
});

// Protected Route Example - This route requires the user to be logged in
app.get('/protected', (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).send('Access Denied. Please log in.');
  }
  res.send('This is a protected route. You are authenticated!');
});

// Login Route - Auth0 login will redirect to the root ("/") after login
app.get('/login', (req, res) => {
  res.oidc.login({ returnTo: '/' }); // Redirect back to the root page after login
});

// Logout Route - Auth0 logout will redirect to the root ("/") after logout
app.get('/logout', (req, res) => {
  res.oidc.logout({ returnTo: '/' }); // Redirect back to the root page after logout
});

// Endpoint to get the user's information
app.get('/user', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.json(req.oidc.user); // Send user info if authenticated
  } else {
    res.json({}); // Send empty object if not authenticated
  }
});

// Start Server
const PORT = process.env.PORT || 5503;
app.listen(PORT, () => console.log(`🚀 Server running on http://127.0.0.1:${PORT}`));


// Endpoint to get the user's information
app.get('/user', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.json(req.oidc.user); // Send user info if authenticated
  } else {
    res.json({}); // Send an empty object if not authenticated
  }
});
