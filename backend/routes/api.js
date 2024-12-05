const express = require('express')
const router = express.Router()
const pool = require('../config/database')

router.get('/patientsonboardingform', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patientsonboardingform')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router 