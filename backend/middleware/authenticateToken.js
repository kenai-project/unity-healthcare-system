// middleware/authenticateToken.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  console.log('Auth Header:', authHeader);
  console.log('Extracted Token:', token ? 'Present' : 'Missing');
  console.log('Request URL:', req.originalUrl);
  console.log('Request Method:', req.method);

  if (!token) {
    console.log('No token provided - returning 401');
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log('Token verified successfully for user:', user);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
