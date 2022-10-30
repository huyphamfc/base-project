const mongoose = require('mongoose');
const validationHandler = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name.'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email.'],
    validate: [validationHandler.isEmail, 'Please enter a valid email.'],
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter your password.'],
    min: [8, 'The password must be at least 8 characters.'],
    select: false,
  },
  passwordConfirmation: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      // only work on create() and save() method
      validator(value) {
        return value === this.password;
      },
      message: 'The password confirmation does not match.',
    },
  },
  passwordUpdateAt: Date,
});

userSchema.pre('save', async (next) => {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirmation = undefined;
    this.passwordUpdateAt = Date.now();
  }

  next();
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;