require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointment');

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => res.send('Unity Healthcare Backend API is running'));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
