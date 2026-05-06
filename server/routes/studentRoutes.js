 const express = require('express');
const router = express.Router();
const pool = require('../db'); // Hamara database connection
const authorize = require('../middleware/authorize');

// API: Register a New Student
router.post('/add', async (req, res) => {
  try {
    const { name, roll_number, class_id } = req.body;
    
    const newStudent = await pool.query(
      "INSERT INTO students (name, roll_number, class_id) VALUES($1, $2, $3) RETURNING *",
      [name, roll_number, class_id]
    );

    res.json(newStudent.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// API: Get All Students (With Class Name)
router.get('/all', async (req, res) => {
  try {
    const allStudents = await pool.query(
      "SELECT students.id, students.name, students.roll_number, classes.class_name FROM students JOIN classes ON students.class_id = classes.id"
    );
    res.json(allStudents.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// API: Mark Bulk Student Attendance
router.post('/attendance',authorize, async (req, res) => {
  try {
    console.log("Authorized User ID:", req.user.id);
    const { attendanceRecords } = req.body; 
    // attendanceRecords format: [{student_id: 1, class_id: 1, status: 'Present', marked_by: 2}, {...}]

    const queryText = `
      INSERT INTO student_attendance (student_id, class_id, attendance_date, status, marked_by)
      VALUES ($1, $2, CURRENT_DATE, $3, $4)
      RETURNING *;
    `;

    const results = [];
    for (let record of attendanceRecords) {
      const { student_id, class_id, status, marked_by } = record;
      const res = await pool.query(queryText, [student_id, class_id, status, marked_by]);
      results.push(res.rows[0]);
    }

    res.json({ message: "Attendance marked successfully!", count: results.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// GET: Specific Class ke saare students (Attendance lagane ke liye)
router.get('/class-list/:classId', authorize, async (req, res) => {
  try {
    const { classId } = req.params;
    const students = await pool.query(
      "SELECT id, name, roll_number FROM students WHERE class_id = $1",
      [classId]
    );
    res.json(students.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT: Update Student Info
router.put('/update/:id', authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roll_number, class_id } = req.body;

    const updateStudent = await pool.query(
      "UPDATE students SET name = $1, roll_number = $2, class_id = $3 WHERE id = $4 RETURNING *",
      [name, roll_number, class_id, id]
    );

    if (updateStudent.rows.length === 0) {
      return res.status(404).json("Student not found!");
    }

    res.json({ message: "Student updated!", student: updateStudent.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET: Monthly Report for a Student
router.get('/monthly-report/:studentId', authorize, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month, year } = req.query; // Postman mein ?month=05&year=2026 bhenjein

    const report = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE status = 'Present') as present_days,
        COUNT(*) FILTER (WHERE status = 'Absent') as absent_days,
        COUNT(*) as total_days
       FROM student_attendance 
       WHERE student_id = $1 
       AND EXTRACT(MONTH FROM attendance_date) = $2
       AND EXTRACT(YEAR FROM attendance_date) = $3`,
      [studentId, month, year]
    );

    res.json(report.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Delete Student
router.delete('/delete/:id', authorize, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM students WHERE id = $1", [id]);
        res.json({ message: "Student deleted successfully!" });
    } catch (err) {
        console.error(err.message);
    }
});


module.exports = router;