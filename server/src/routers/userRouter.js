const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.route('/signup').post(authController.signup);
userRouter.route('/login').post(authController.login);
userRouter.route('/logout').get(authController.logout);
userRouter
  .route('/update-password')
  .patch(authController.protectRoute, authController.updatePassword);

userRouter
  .route('/')
  .all(authController.protectRoute, authController.permitWithRoles('admin'))
  .get(userController.getAllUsers);

userRouter
  .route('/:id')
  .all(authController.protectRoute, authController.permitWithRoles('admin'))
  .get(userController.getUserById)
  .delete(userController.deleteUserById);

module.exports = userRouter;
