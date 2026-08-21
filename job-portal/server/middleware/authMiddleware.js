const jwt = require('jsonwebtoken');

function verifyAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided. Please login.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.admin = decoded; // { id, email }
    next();
  });
}

module.exports = { verifyAdmin };
