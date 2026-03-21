const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.MYSQL_URI, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Required for Aiven if you don't supply the CA certificate explicitly
    }
  }
})

async function connectDB() {
  try {
    await sequelize.authenticate()
    console.log('[db] MySQL connected')
    
    // Auto-sync for dev
    await sequelize.sync({ alter: true })
    console.log('[db] Database synced')
  } catch (err) {
    console.error('[db] MySQL connection error:', err)
  }
}

module.exports = { sequelize, connectDB }
