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

  app.use(cors())
  app.use(helmet())
  app.use(morgan('dev'))
  app.use(express.json({ limit: '2mb' }))

  app.get('/api/health', (req, res) => {
    res.json({ ok: true })
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

