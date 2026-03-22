const express = require('express')
const { signup, login, getMe } = require('../controllers/authController')
const { requireAuth } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/me', requireAuth, getMe)

module.exports = router
