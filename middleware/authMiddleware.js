const jwt = require('jsonwebtoken');

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(403).json({ error: 'Token missing' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
