const express = require("express");
const cors = require("cors");
const pool = require("./db");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// Test Route
app.get("/", (req, res) => {
  res.send("School Management API is running...");
});

// Routes
app.use('/api/students', require('./routes/StudentRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
