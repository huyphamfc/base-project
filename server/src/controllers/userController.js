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
