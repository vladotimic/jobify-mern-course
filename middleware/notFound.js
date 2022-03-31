const { StatusCodes } = require('http-status-codes');

const notFoundMiddleware = (req, res) =>
  res.status(StatusCodes.NOT_FOUND).send(`Route ${req.originalUrl} not found`);

module.exports = notFoundMiddleware;
