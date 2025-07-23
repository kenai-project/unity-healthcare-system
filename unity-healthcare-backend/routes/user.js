const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authenticateToken');
const userController = require('../controllers/user.controller');

// 🔓 Public route - fetch doctors for appointment dropdown
router.get('/doctors', userController.getAllDoctors);

// 🔐 Get user profile
router.get('/:id', authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.id);
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, role FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔐 Update user profile
router.put('/:id', authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.id);
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { firstName, lastName, email } = req.body;

  try {
    await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4`,
      [firstName, lastName, email, userId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔐 Change password
router.put('/:id/password', authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.id);
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { oldPassword, newPassword } = req.body;

  try {
    const userResult = await pool.query(
      `SELECT password_hash FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, userResult.rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users SET password_hash = $1 WHERE id = $2`,
      [newHashedPassword, userId]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
