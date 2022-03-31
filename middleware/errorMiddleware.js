const { StatusCodes } = require('http-status-codes');

const errorMiddleware = async (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong',
  };

  if (err.code === 11_000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `Please enter valid ${Object.keys(err.keyValue).join(
      ', '
    )}.`;
  }
  if (err.name === 'ValidationError') {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `Please provide ${Object.keys(err.errors).join(
      ', '
    )}.`;
  }

  const { statusCode, message } = customError;
  return res.status(statusCode).json({ message });
};

module.exports = errorMiddleware;
