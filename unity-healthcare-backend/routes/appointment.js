// ---------------------------
// backend/routes/appointment.js
// ---------------------------

const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticate = require('../middleware/authenticate');

// Book Appointment (POST /api/appointments/book)
router.post('/book', authenticate, async (req, res) => {
  const { doctorId, date, time, reason } = req.body;
  const patientId = req.user.id;

  if (!doctorId || !date || !time) {
    return res.status(400).json({ message: 'Doctor ID, date, and time are required' });
  }

  try {
    await db.query(
      `INSERT INTO appointments (patient_id, doctor_id, date, time, reason)
       VALUES ($1, $2, $3, $4, $5)`,
      [patientId, doctorId, date, time, reason]
    );
    res.status(201).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Server error while booking appointment' });
  }
});

// Get My Appointments (GET /api/appointments/my)
router.get('/my', authenticate, async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    let result;
    if (role === 'patient') {
      result = await db.query(
        `SELECT a.*, u.first_name AS doctor_first_name, u.last_name AS doctor_last_name
         FROM appointments a
         JOIN users u ON a.doctor_id = u.id
         WHERE a.patient_id = $1
         ORDER BY a.date DESC, a.time DESC`,
        [userId]
      );
    } else if (role === 'doctor') {
      result = await db.query(
        `SELECT a.*, u.first_name AS patient_first_name, u.last_name AS patient_last_name
         FROM appointments a
         JOIN users u ON a.patient_id = u.id
         WHERE a.doctor_id = $1
         ORDER BY a.date DESC, a.time DESC`,
        [userId]
      );
    } else {
      return res.status(403).json({ message: 'Invalid role' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Fetching appointments error:', error);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
});

module.exports = router;


// ---------------------------
// backend/middleware/authenticate.js
// ---------------------------

const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret';

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};


// ---------------------------
// backend/db.js
// ---------------------------

const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
module.exports = pool;


// ---------------------------
// frontend/pages/Appointment.jsx
// ---------------------------

import React, { useEffect, useState } from 'react';

export default function Appointment() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/doctors', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (res.ok) {
        alert('Appointment booked');
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('Error booking appointment');
    }
  };

  return (
    <div className="appointment-form">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <select name="doctorId" onChange={handleChange} required>
          <option value="">Select Doctor</option>
          {doctors.map(doc => (
            <option key={doc.id} value={doc.id}>{doc.first_name} {doc.last_name}</option>
          ))}
        </select>
        <input type="date" name="date" onChange={handleChange} required />
        <input type="time" name="time" onChange={handleChange} required />
        <textarea name="reason" placeholder="Reason" onChange={handleChange}></textarea>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}
