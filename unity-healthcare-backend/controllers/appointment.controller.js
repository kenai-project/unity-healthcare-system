const pool = require('../db');

// Book appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    const patientId = req.user.id;

    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, date, time, reason)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [patientId, doctorId, date, time, reason]
    );

    res.status(201).json({ success: true, appointment: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Booking failed' });
  }
};

// Get patient appointments
exports.getPatientAppointments = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  if (role !== 'patient') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const result = await pool.query(
      `SELECT a.*, u.username AS doctor_name
       FROM appointments a
       JOIN users u ON a.doctor_id = u.id
       WHERE a.patient_id = $1
       ORDER BY date DESC, time DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// Get doctor appointments
exports.getDoctorAppointments = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  if (role !== 'doctor') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const result = await pool.query(
      `SELECT a.*, u.username AS patient_name
       FROM appointments a
       JOIN users u ON a.patient_id = u.id
       WHERE a.doctor_id = $1
       ORDER BY date, time`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};
