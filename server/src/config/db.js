const mongoose = require('mongoose')
const dns = require('dns')

async function connectDB() {
  const uri = process.env.MONGO_URI
  if (!uri) {
    throw new Error('MONGO_URI is not set')
  }

  // Some environments block Node's default DNS resolver (SRV lookup fails with ECONNREFUSED).
  // Setting public resolvers fixes `mongodb+srv://` connectivity.
  if (uri.startsWith('mongodb+srv://')) {
    dns.setServers(['8.8.8.8', '1.1.1.1'])
  }

  mongoose.set('strictQuery', true)
  mongoose.connection.on('connected', () => {
    // eslint-disable-next-line no-console
    console.log('[db] connected')
  })
  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('[db] error', err)
  })

  await mongoose.connect(uri)
}

module.exports = { connectDB }

