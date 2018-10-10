const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const writers = await User
    .find({ $where: "this.articles.length >= 1" })
    .populate({path: 'articles'})
    .select('-password');

  res.send({writers: writers});
});

router.get('/:id', async (req, res) => {
  const writer = await User.findById(req.params.id);

  if (!writer) return res.status(404).send({errors: 'The writer with the given ID was not found.'});
  res.send({writer: writer});
});

module.exports = router;