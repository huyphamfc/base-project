/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const validator = require('validator');

const UserModel = require('../models/UserModel');
const AppError = require('../utils/AppError');
const catchError = require('../utils/catchError');

// prettier-ignore
const signJWT = (id) => jwt.sign(
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

  const token = signJWT(newUser._id);

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

  const token = signJWT(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protectRoute = catchError(async (req, res, next) => {
  let token;
  const author = req.headers?.authorization;

  // get token
  if (author && author.startsWith('Bearer')) {
    token = author.split(' ')[1];
  }
  if (!token) throw new AppError(401, 'Please log in to access.');

  // verify token
  const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

  // is the user still exist?
  const user = await UserModel.findById(decodedToken.id);
  if (!user) {
    throw new AppError(401, 'The user no longer exists. Please log in again!');
  }

  // is password change?
  const isPasswordChange = user.isPasswordChange(decodedToken.iat);
  if (isPasswordChange) {
    throw new AppError(401, 'The password has changed. Please log in again!');
  }

  req.currentUser = user;
  next();
});

// prettier-ignore
exports.permitWithRoles = (...roles) => (req, res, next) => {
  if (roles.includes(req.currentUser.role)) return next();
  throw new AppError(403, 'Permission required.');
};

exports.updatePassword = catchError(async (req, res) => {
  const user = req.currentUser;
  const { password, passwordConfirmation } = req.body;

  user.password = password;
  user.passwordConfirmation = passwordConfirmation;

  await user.save();

  const token = signJWT(user._id);

  res.status(201).json({
    status: 'success',
    token,
  });
});
