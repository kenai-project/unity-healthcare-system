const pool = require('../db');

// ✅ Book an appointment
exports.bookAppointment = async (req, res) => {
  const { doctorId, date, time, reason } = req.body;
  const patientId = req.user.id;

  if (!doctorId || !date || !time) {
    return res.status(400).json({ error: 'Doctor ID, date, and time are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, date, time, reason)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [patientId, doctorId, date, time, reason || null]
    );

    res.status(201).json({ success: true, appointment: result.rows[0] });
  } catch (err) {
    console.error('📌 Book Appointment Error:', err.message);
    res.status(500).json({ error: 'Booking failed' });
  }
};

// ✅ Get appointments for logged-in patient
exports.getPatientAppointments = async (req, res) => {
  const userId = req.user.id;

  if (req.user.role !== 'patient') {
    return res.status(403).json({ error: 'Access denied: Patients only' });
  }

  try {
    const result = await pool.query(
      `SELECT a.*, 
              d.first_name AS doctor_first_name, 
              d.last_name AS doctor_last_name
       FROM appointments a
       JOIN users d ON a.doctor_id = d.id
       WHERE a.patient_id = $1
       ORDER BY a.date DESC, a.time DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('📌 Get Patient Appointments Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// ✅ Get appointments for logged-in doctor
exports.getDoctorAppointments = async (req, res) => {
  const userId = req.user.id;

  if (req.user.role !== 'doctor') {
    return res.status(403).json({ error: 'Access denied: Doctors only' });
  }

  try {
    const result = await pool.query(
      `SELECT a.*, 
              p.first_name AS patient_first_name, 
              p.last_name AS patient_last_name
       FROM appointments a
       JOIN users p ON a.patient_id = p.id
       WHERE a.doctor_id = $1
       ORDER BY a.date ASC, a.time ASC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('📌 Get Doctor Appointments Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};
