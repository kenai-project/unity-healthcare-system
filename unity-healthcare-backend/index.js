require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Import auth routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// Import appointment routes
const appointmentRoutes = require('./routes/appointment');
app.use('/api/appointments', appointmentRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Unity Healthcare Backend API is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
