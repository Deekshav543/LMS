const express = require('express')
const { signup, login, getMe } = require('../controllers/authController')
const { requireAuth } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/signup', signup)
router.get('/signup', (req, res) => res.json({ message: 'Signup route is reachable via GET. Use POST for actual registration.' }))
router.post('/login', login)
router.get('/login', (req, res) => res.json({ message: 'Login route is reachable via GET. Use POST for actual login.' }))
router.get('/me', requireAuth, getMe)

module.exports = router
