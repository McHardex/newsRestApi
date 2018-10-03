const express = require('express')
const articles = require('../routes/articles');
const writers = require('../routes/writers');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/articles', articles);
  app.use('/api/writers', writers);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use(error)
}