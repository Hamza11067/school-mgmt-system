const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authorize = require('../middleware/authorize');


// Update your Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length !== 0) {
      return res.status(401).send("User already exists!");
    }

    // 2. Hash the password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 3. Insert user with hashed password
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES($1, $2, $3, $4) RETURNING *",
      [name, email, bcryptPassword, role]
    );

    res.json({ message: "Staff registered safely!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// API: Mark Staff Attendance
router.post('/attendance',authorize, async (req, res) => {
  try {
    const { user_id, status } = req.body; // status: 'Present', 'Absent'
    const newAttendance = await pool.query(
      "INSERT INTO staff_attendance (user_id, date, status) VALUES($1, CURRENT_DATE, $2) RETURNING *",
      [user_id, status]
    );
    res.json({ message: "Staff attendance marked!", data: newAttendance.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Email or Password");
    }

    // 2. Check password matches
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json("Invalid Email or Password");
    }

    // 3. Give them a JWT Token (Secret key .env mein honi chahiye)
    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET || 'secretkey123',
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.rows[0].role, name: user.rows[0].name });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;