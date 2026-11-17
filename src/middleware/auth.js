const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ')
      ? header.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        message: 'Please log in.'
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.userId)
      .select('-password');

    if (!user) {
      return res.status(401).json({
        message: 'Account not found.'
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        message: 'Your account has been suspended.'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      message: 'Session expired. Please log in again.'
    });
  }
};