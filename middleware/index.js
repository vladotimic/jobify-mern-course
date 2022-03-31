const notFoundMiddleware = require('./notFound');
const errorMiddleware = require('./errorMiddleware');
const authenticate = require('./auth');

module.exports = {
  notFoundMiddleware,
  errorMiddleware,
  authenticate,
};
