const { Pool } = require('pg')
require('dotenv').config()


const pool = new Pool({
  user: process.env.PATIENT_DB_USER,
  password: process.env.PATIENT_DB_PASSWORD,
  host: process.env.PATIENT_DB_HOST,
  database: process.env.PATIENT_DB_NAME,
  port: process.env.PATIENT_DB_PORT,
  ssl: {
    rejectUnauthorized: false // For development only. In production, configure proper SSL
  }
})

module.exports = pool 