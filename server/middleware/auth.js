const jwt = require('jsonwebtoken');
const db = require('../db');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const result = await db.query('SELECT id, username, email, avatar, level, xp_total, current_streak, longest_streak, last_active_date, created_at FROM users WHERE id = $1', [decoded.id]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = { authenticateToken };
