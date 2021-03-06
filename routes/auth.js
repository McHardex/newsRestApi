const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt')
const Joi = require('joi')


router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(422).send({errors: error.details[0].message});

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(422).send({errors: 'Invalid email or password'});
    
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(422).send({errors: 'Invalid email or password'});

  const token = user.generateAuthToken();
  res.status(200).send({token})
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().regex(/[a-zA-Z0-9]{6,30}/).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;