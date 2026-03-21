const dotenv = require('dotenv')
dotenv.config()

const { connectDB } = require('./src/config/db')
const app = require('./src/app')

const PORT = process.env.PORT || 5000

async function start() {
  await connectDB()
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] Listening on port ${PORT}`)
  })
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[server] Failed to start', err)
  process.exit(1)
})

