const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body || {}
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, password are required' })
    }

    const exists = await User.findOne({ email: String(email).toLowerCase().trim() })
    if (exists) {
      return res.status(409).json({ message: 'Email already in use' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash,
      role: 'student',
    })

    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    return res.status(500).json({ message: 'Signup failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' })
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { role: user.role },
      process.env.JWT_SECRET,
      { subject: String(user._id), expiresIn: '7d' }
    )

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    return res.status(500).json({ message: 'Login failed' })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email role')
    if (!user) return res.status(404).json({ message: 'User not found' })
    return res.json({ user: { id: user._id, ...user.toObject() } })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch user' })
  }
})

module.exports = router

