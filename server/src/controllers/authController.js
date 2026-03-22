const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, password are required' });
    }

    const emailFormatted = String(email).toLowerCase().trim();
    
    // Check if user exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [emailFormatted]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 4);
    
    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [String(name).trim(), emailFormatted, passwordHash]
    );

    return res.status(201).json({
      message: 'Signup successful',
      user: { id: result.insertId, name, email: emailFormatted, role: 'student' },
    });
  } catch (err) {
    console.error('[auth] signup error:', err);
    return res.status(500).json({ message: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const emailFormatted = String(email).toLowerCase().trim();
    
    // Select user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [emailFormatted]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { role: user.role || 'student' },
      process.env.JWT_SECRET,
      { subject: String(user.id), expiresIn: '7d' }
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role || 'student' },
    });
  } catch (err) {
    console.error('[auth] login error:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
};

exports.getMe = async (req, res) => {
  try {
    // Select user by id
    const [users] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];

    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    console.error('[auth] getMe error:', err);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
};
