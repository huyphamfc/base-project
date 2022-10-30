const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const limiter = require('express-rate-limit');

// load environment variables
dotenv.config();

// create Express app
const app = express();

// enable CORS
app.use(cors());

// set HTTP headers security
app.use(helmet());

// create HTTP request logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// limit requests to API
app.use(
  '/api',
  limiter({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP. Try again later.',
  }),
);

// limit request body size
app.use(express.json({ limit: '10kb' }));

module.exports = app;
