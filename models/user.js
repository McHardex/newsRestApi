const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  bio: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isWriter: Boolean,
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }]
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().min(5).max(255).required(),
    bio: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(6).alphanum().required()
  };

  return Joi.validate(user, schema);
}

function validateUserUpdate(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().min(5).max(255).required(),
    bio: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(user, schema);
}

function validateUserEmail(user) {
  const schema = {
    email: Joi.string().email().min(5).max(255).required(),
  };

  return Joi.validate(user, schema);
}

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;
exports.validateUserUpdate = validateUserUpdate;
exports.validateUserEmail = validateUserEmail;