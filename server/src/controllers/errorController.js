const sendErrDev = (err, res) => {
  console.error(err);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  let processedErr = Object.assign(err);
  processedErr.statusCode ||= 500;
  processedErr.status ||= 'error';
  processedErr.message ||= 'Something went wrong!';

  const environment = process.env.NODE_ENV;

  switch (environment) {
    case 'development':
      sendErrDev(processedErr, res);
      break;
    default:
  }
};
