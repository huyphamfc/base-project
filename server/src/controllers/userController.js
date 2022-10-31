const UserModel = require('../models/UserModel');
const AppError = require('../utils/AppError');
const catchError = require('../utils/catchError');

exports.getAllUsers = catchError(async (req, res) => {
  const users = await UserModel.find({});

  const results = users.length;
  if (results === 0) throw new AppError(404, 'Data not found.');

  res.status(200).json({
    status: 'success',
    results,
    users,
  });
});

exports.getUserById = catchError(async (req, res) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) throw new AppError(404, 'Data not found.');

  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.deleteUserById = catchError(async (req, res) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);

  if (!user) throw new AppError(404, 'Data not found.');

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
