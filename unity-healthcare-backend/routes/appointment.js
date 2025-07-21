const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const authenticateToken = require('../middleware/authenticateToken');

// Book appointment
router.post('/book', authenticateToken, appointmentController.bookAppointment);

// Get patient appointments
router.get('/patient/logs', authenticateToken, appointmentController.getPatientAppointments);

// Get doctor appointments
router.get('/doctor/schedule', authenticateToken, appointmentController.getDoctorAppointments);

module.exports = router;
