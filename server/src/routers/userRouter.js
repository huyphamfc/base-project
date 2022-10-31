const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.route('/signup').post(authController.signup);
userRouter.route('/login').post(authController.login);
userRouter
  .route('/update-password')
  .patch(authController.protectRoute, authController.updatePassword);

userRouter
  .route('/')
  .get(authController.protectRoute, userController.getAllUsers);

userRouter
  .route('/:id')
  .get(authController.protectRoute, userController.getUserById);

module.exports = userRouter;
