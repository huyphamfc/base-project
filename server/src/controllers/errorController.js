const AppError = require('../utils/AppError');

const sendErrDev = (err, res) => {
  console.error(err);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const handleValidationError = (err) => {
  const message = Object.values(err.errors)
    .map((subErr) => subErr.message)
    .join(' ');

  return new AppError(400, message);
};

const handleDuplicatedFieldError = (err) => {
  const value = Object.values(err.keyValue);
  return new AppError(400, `${value} already exists.`);
};

const handleCastError = (err) => {
  const message = `${err.value} is invalid.`;
  return new AppError(400, message);
};

const handleJWTError = () =>
  new AppError(401, 'Invalid Signature. Please log in again!');

const handleTokenExpiredError = () =>
  new AppError(401, 'Expired Permission. Please log in again!');

module.exports = (err, req, res, next) => {
  let processedErr = Object.assign(err);
  processedErr.statusCode = processedErr.statusCode || 500;
  processedErr.status = processedErr.status || 'error';
  processedErr.message = processedErr.message || 'Something went wrong!';

  const environment = process.env.NODE_ENV;

  switch (environment) {
    case 'development':
      sendErrDev(processedErr, res);
      break;
    case 'production':
      if (processedErr.name === 'ValidationError') {
        processedErr = handleValidationError(processedErr);
      }

      if (processedErr.name === 'CastError') {
        processedErr = handleCastError(processedErr);
      }

      if (processedErr.name === 'JsonWebTokenError') {
        processedErr = handleJWTError();
      }

      if (processedErr.name === 'TokenExpiredError') {
        processedErr = handleTokenExpiredError();
      }

      if (processedErr.code === 11000) {
        processedErr = handleDuplicatedFieldError(processedErr);
      }

      sendErrProd(processedErr, res);
      break;
    default:
  }
};
