const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.post('/api/patientsonboardingform', async (req, res) => {
  try {
    console.log('Received patient data:', req.body);

    const {
      first_name, last_name, date_of_birth, gender, phone_number,
      address, blood_type, height, weight, medical_conditions,
      allergies, emergency_contact_name, emergency_contact_relationship,
      emergency_contact_phone, notifications_enabled, data_sharing_allowed
    } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({ 
        message: 'First name and last name are required' 
      });
    }

    const query = `
      INSERT INTO patientsonboardingform (
        first_name, last_name, date_of_birth, gender, phone_number,
        address, blood_type, height, weight, medical_conditions,
        allergies, emergency_contact_name, emergency_contact_relationship,
        emergency_contact_phone, notifications_enabled, data_sharing_allowed
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

    const values = [
      first_name, last_name, date_of_birth, gender, phone_number,
      address, blood_type, height, weight, medical_conditions,
      allergies, emergency_contact_name, emergency_contact_relationship,
      emergency_contact_phone, notifications_enabled, data_sharing_allowed
    ];

    console.log('Executing query:', query);
    console.log('With values:', values);

    const result = await pool.query(query, values);
    console.log('Query result:', result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ 
      message: 'Failed to create patient record',
      error: error.message 
    });
  }
});

module.exports = router; 