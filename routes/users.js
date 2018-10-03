const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
  const users = await User.find().sort('email');
  res.send(users);
});

router.get('/me', auth, async (req, res) => {
  const users = await User.findById(req.user._id).select('-name');
  res.send(users);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
 
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');
  user = new User(_.pick(req.body, ['name', 'email', 'bio', 'password']));
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send( _.pick(user, ['_id', 'name', 'email', 'bio']));
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    email: req.body.email,
    bio: req.body.bio,
    password: req.body.password
  }, {
    new: true
  });

  if (!user) return res.status(404).send('The user with the given ID was not found.');
  res.send(user);
});

router.delete('/:id', auth, async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) return res.status(404).send('The user with the given ID was not found.');
  res.send(user);
});

module.exports = router;