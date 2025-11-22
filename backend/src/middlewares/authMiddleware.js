const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: payload.userId,
      orgId: payload.orgId,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = { authMiddleware };
