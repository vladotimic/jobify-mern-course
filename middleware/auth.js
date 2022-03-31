const jwt = require('jsonwebtoken');
const { UnAuthenticated } = require('../errors');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnAuthenticated('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId };
    next();
  } catch (error) {
    throw new UnAuthenticated('Authentication invalid');
  }
};

module.exports = auth;
