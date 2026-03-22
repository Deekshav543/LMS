const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const authRoutes = require('./routes/authRoutes')
const coursesRoutes = require('./routes/coursesRoutes')
const enrollmentsRoutes = require('./routes/enrollmentsRoutes')
const lessonsRoutes = require('./routes/lessonsRoutes')
const progressRoutes = require('./routes/progressRoutes')

function createApp() {
  const app = express()

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://lms-orpin-zeta.vercel.app',
    process.env.CORS_ORIGIN
  ].filter(Boolean)

  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  }))

  app.use(helmet())
  app.use(morgan('dev'))
  app.use(express.json({ limit: '2mb' }))

  app.get('/', (req, res) => {
    res.json({ message: 'LMS Backend is live' })
  })

  app.get('/api/health', (req, res) => {
    res.json({ ok: true })
  })

  app.get('/api/test', (req, res) => {
    res.json({ message: 'API working' })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/courses', coursesRoutes)
  app.use('/api/enrollments', enrollmentsRoutes)
  app.use('/api/lessons', lessonsRoutes)
  app.use('/api/progress', progressRoutes)

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' })
  })

  return app
}

module.exports = createApp()

