const pool = require("../db");

const markAttendance = async (req, res) => {
  const { attendance_date, records } = req.body; 

  try {
    const queries = records.map(record => {
      return pool.query(
        `INSERT INTO attendance (student_id, attendance_date, status, remarks)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (student_id, attendance_date)
         DO UPDATE SET 
            status = EXCLUDED.status,
            remarks = EXCLUDED.remarks`,
        [record.student_id, attendance_date, record.status, record.remarks || null]
      );
    });

    await Promise.all(queries);
    res.status(200).json({ message: "Attendance recorded successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error while saving attendance" });
  }
};

const getAttendanceByDate = async (req, res) => {
  const { date } = req.params;

  try {
    const result = await pool.query(
      `SELECT a.*, s.name 
       FROM attendance a 
       JOIN students s ON a.student_id = s.id 
       WHERE a.attendance_date = $1`,
      [date]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error while fetching attendance" });
  }
};

// Update your exports
module.exports = { markAttendance, getAttendanceByDate };
