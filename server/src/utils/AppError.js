class AppError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // represent the location of the error in the call
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

// https://v8.dev/docs/stack-trace-api
