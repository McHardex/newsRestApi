const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const crypto = require('crypto');

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
  confirmPassword: {
    type: String,
    minlength: 6,
  },
  resetPasswordToken: {
    type: String, 
    required: true,
    default: "bukunmi"
  },
  resetPasswordExpires: {
    type: Date, 
    required: true,
    default: Date.now
  },
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
    password: Joi.string().min(6).alphanum().required(),
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
    resetPasswordToken: Joi.string(),
    resetPasswordExpires: Joi.string()
  };

  return Joi.validate(user, schema);
}

function validatePasswordUpdate(user) {
  const schema = {
    password: Joi.string().min(6).alphanum().required(),
    confirmPassword: Joi.any().required().valid(Joi.ref('password')).options({
      language: {
        any: {
          allowOnly: '!!Passwords do not match',
        }
      } 
    })
  };

  return Joi.validate(user, schema);
}

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;
exports.validateUserUpdate = validateUserUpdate;
exports.validateUserEmail = validateUserEmail;
exports.validatePasswordUpdate = validatePasswordUpdate;