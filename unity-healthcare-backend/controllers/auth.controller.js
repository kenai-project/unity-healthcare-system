const bcrypt = require('bcrypt');
const pool = require('../db'); // PostgreSQL pool connection
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, role`,
      [firstName, lastName, email, hashedPassword, role]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1d'
    });

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiry

    // Store token in DB
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, token, expiresAt]
    );

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
      html: `<p>You requested a password reset.</p><p>Click the link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Error in forgotPassword:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: 'Token and new password are required' });

  try {
    const tokenResult = await pool.query(
      `SELECT * FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW()`,
      [token]
    );
    const tokenRow = tokenResult.rows[0];
    if (!tokenRow) return res.status(400).json({ message: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users SET password_hash = $1 WHERE id = $2`,
      [hashedPassword, tokenRow.user_id]
    );

    // Delete used token
    await pool.query(
      `DELETE FROM password_reset_tokens WHERE id = $1`,
      [tokenRow.id]
    );

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Error in resetPassword:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
