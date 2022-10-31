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
    minLength: [8, 'The password must be at least 8 characters.'],
    // min       - type: Number
    // minLength - type: String
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

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirmation = undefined;
    this.passwordUpdateAt = Date.now() - 1000;
  }

  next();
});

userSchema.method(
  'verifyPassword',
  async (inputPassword, databasePassword) =>
    await bcrypt.compare(inputPassword, databasePassword),
);

userSchema.method('isPasswordChange', function (decodedTimestamp) {
  return this.passwordUpdateAt.getTime() > decodedTimestamp * 1000;
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
