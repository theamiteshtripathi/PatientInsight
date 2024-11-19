const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  credentials: true
}));

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Patient_Treatment_Recommendation',
  password: '1234',
  port: 5432,
});

// Signup endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword, firstName, lastName } = req.body;
    
    const result = await pool.query(
      'INSERT INTO patients (username, password, confirm_password, first_name, last_name, email_address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [username, password, confirmPassword, firstName, lastName, email]

    );
    
    res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});