const express = require('express')
const articles = require('../routes/articles');
const writers = require('../routes/writers');
const users = require('../routes/users');
const auth = require('../routes/auth');
const forgotPassword = require('../routes/forgotPassword');
const resetPassword = require('../routes/resetPassword');
const updatePasswordViaEmail = require('../routes/updatePasswordViaEmail');
const error = require('../middleware/error');
const cors = require('cors');
// const corsOptions = require('../middleware/corsOptions')

module.exports = function(app) {
  app.use(express.json());
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, x-auth-token, Content-Type, Accept");
    next();
  });
  app.use('/api/articles', articles);
  app.use('/api/writers', writers);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/forgotPassword', forgotPassword);
  app.use('/api/reset', resetPassword);
  app.use('/api/updatePasswordViaEmail', updatePasswordViaEmail);
  app.use(error)
}