const {Article,validate} = require('../models/article');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  const writers = await Article
    .find({'user.isWriter': true})
    .sort({ name: 1})
    .select({ user: 1});
    res.send(writers);
});

router.get('/:id', async (req, res) => {
  const writer = await Article
    .findById(req.params.id)
    .sort({ name: 1})
    .select({ user: 1});

  if (!writer) return res.status(404).send('The writer with the given ID was not found.');
  res.send(writer);
});

module.exports = router;