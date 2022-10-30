const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.route('/signup').post(authController.signup);
userRouter.route('/login').post(authController.login);

userRouter.route('/').get(userController.getAllUsers);

userRouter.route('/:id').get(userController.getUserById);

module.exports = userRouter;
