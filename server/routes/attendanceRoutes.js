const express = require("express");
const router = express.Router();
const { markAttendance, getAttendanceByDate } = require("../controllers/attendanceController");

// This maps to POST /api/attendance
router.post("/", markAttendance);
router.get("/:date", getAttendanceByDate);

module.exports = router;