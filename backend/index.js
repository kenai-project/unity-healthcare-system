// index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// CORS configuration - allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL (React + Vite)
  credentials: true
}));

// JSON body parser middleware
app.use(express.json());

// Connect to PostgreSQL
db.connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch(err => console.error('❌ Database connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const appointmentRoutes = require('./routes/appointment');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

// Default root route
app.get('/', (req, res) => {
  res.send('🩺 Unity Healthcare API Running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
