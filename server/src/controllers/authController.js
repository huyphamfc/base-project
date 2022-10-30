const jwt = require('jsonwebtoken');

const UserModel = require('../models/UserModel');
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
