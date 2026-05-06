const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add a new Class
router.post('/add', async (req, res) => {
    try {
        const { class_name, section } = req.body;
        const newClass = await pool.query(
            "INSERT INTO classes (class_name, section) VALUES($1, $2) RETURNING *",
            [class_name, section]
        );
        res.json(newClass.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all Classes
router.get('/all', async (req, res) => {
    try {
        const classes = await pool.query("SELECT * FROM classes");
        res.json(classes.rows);
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;