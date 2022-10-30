const jwt = require('jsonwebtoken');
const validator = require('validator');

const UserModel = require('../models/UserModel');
const AppError = require('../utils/AppError');
const catchError = require('../utils/catchError');

// prettier-ignore
const createJWTToken = (id) => jwt.sign(
  { id },
  process.env.JWT_PRIVATE_KEY,
  { expiresIn: process.env.JWT_EXPIRATION },
);

exports.signup = catchError(async (req, res) => {
  const { name, email, password, passwordConfirmation } = req.body;

  const newUser = await UserModel.create({
    name,
    email,
    password,
    passwordConfirmation,
  });

  const token = createJWTToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
  });
});

exports.login = catchError(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError(400, 'Please enter both email and password.');
  }
  if (!validator.isEmail(email)) {
    throw new AppError(400, 'Please enter a valid email.');
  }
  if (!validator.isLength(password, { min: 8 })) {
    throw new AppError(400, 'The password must be at least 8 characters.');
  }

  const user = await UserModel.findOne({ email }).select('+password');
  if (!user) throw new AppError(401, 'Your email or password is incorrect.');

  const isPasswordCorrect = await user.verifyPassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError(401, 'Your email or password is incorrect.');
  }

  const token = createJWTToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});
