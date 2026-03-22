const mysql = require('mysql2/promise');
require('dotenv').config();

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 26715,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  ssl: {
    rejectUnauthorized: false
  }
});

async function connectDB() {
  try {
    const connection = await pool.getConnection();
    console.log('[db] MySQL connected via mysql2 pool');
    connection.release();
  } catch (err) {
    console.error('[db] MySQL connection error:', err);
    process.exit(1);
  }
}

module.exports = { pool, connectDB };
