const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // Check if token starts with Bearer
  let token = authHeader;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: ... }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};
