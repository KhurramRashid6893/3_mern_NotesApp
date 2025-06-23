const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const header = req.header('Authorization');
  if (!header) {
    return res.status(401).json({ error: 'No token' });
  }

  let token;

  if (header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  } else {
    token = header; // fallback if token is sent directly without Bearer
  }

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
