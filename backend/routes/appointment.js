// routes/appointment.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticateToken');
const appointmentController = require('../controllers/appointment.controller');

// Book Appointment
router.post('/book', authenticate, appointmentController.bookAppointment);

// Get Logged-in Patient's Appointments
router.get('/my', authenticate, appointmentController.getPatientAppointments);

// Get Logged-in Doctor's Appointments
router.get('/doctor', authenticate, appointmentController.getDoctorAppointments);

module.exports = router;
