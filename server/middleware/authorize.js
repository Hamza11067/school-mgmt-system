const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
  // Get token from header
  let token = req.header("token");
  console.log("Received Token:", token); // Ye terminal mein check karein
  console.log("Using Secret:", process.env.JWT_SECRET);

  // Agar token quotes ke sath aa raha hai toh unhein remove karo
  if (token && token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }

  // Check if no token
  if (!token) {
    return res.status(403).json({ msg: "Authorization denied" });
  }

  // Verify token
  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verify; // User ki ID aur Role request mein save ho jayegi
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};