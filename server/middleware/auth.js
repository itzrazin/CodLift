const jwt = require('jsonwebtoken');

/**
 * auth middleware — validates JWT from Authorization header.
 * Distinguishes between expired tokens (401 with expiredToken: true)
 * and completely invalid tokens (401 generic) so the client can
 * prompt a re-login vs. show a generic error.
 */
module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({
      error: 'Authentication required.',
      code:  'NO_TOKEN'
    });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error:       'Your session has expired. Please log in again.',
        code:        'TOKEN_EXPIRED',
        expiredToken: true
      });
    }
    return res.status(401).json({
      error: 'Invalid authentication token.',
      code:  'TOKEN_INVALID'
    });
  }
};
