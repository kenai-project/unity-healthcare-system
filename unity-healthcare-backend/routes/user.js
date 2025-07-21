const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you have a db.js exporting a pg Pool instance
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken'); // Middleware to verify JWT

// Get user profile
router.get('/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const result = await pool.query(
      'SELECT id, first_name, last_name, email, role FROM users WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const { firstName, lastName, email } = req.body;
  try {
    await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4',
      [firstName, lastName, email, userId]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/:id/password', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const { oldPassword, newPassword } = req.body;
  try {
    const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const validPassword = await bcrypt.compare(oldPassword, userResult.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, userId]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
