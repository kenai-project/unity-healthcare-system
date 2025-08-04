const pool = require('../db');

// GET /users - Admin only
exports.getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      `SELECT id, first_name, last_name, email, role FROM users ORDER BY id ASC`
    );
    res.json(users.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /users/:id - Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, role FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /users/:id - Update user (by self or admin)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, role } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await pool.query(
      `UPDATE users
       SET first_name = $1, last_name = $2, email = $3, role = $4
       WHERE id = $5`,
      [firstName, lastName, email, role || existing.rows[0].role, id]
    );

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /users/:id - Admin only
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ error: 'User not found or already deleted' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /users/doctors - Get all doctors with ID and full name
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await pool.query(
      `SELECT id, first_name || ' ' || last_name || ' (ID: ' || id || ')' AS name
       FROM users
       WHERE role = 'doctor'
       ORDER BY first_name ASC`
    );
    res.json(doctors.rows);
  } catch (err) {
    console.error('Error fetching doctors:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};



