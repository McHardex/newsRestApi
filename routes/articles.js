const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Article, validate } = require('../models/article');
const {User} = require('../models/user');
const validateObjectId = require('../middleware/validateObjectId');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const express = require('express');
const router = express.Router();


router.get('/', async (req, res, next) => {
  const articles = await Article.find().sort("title");
  res.send(articles);
});

router.post('/', [auth], async (req, res) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send('Invalid user.');
  if (!user.isWriter) {
    await User.updateOne({
      id: ObjectID(user._id),
      isWriter: true
    });
  }
  let article = new Article({
    title: req.body.title,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      password: user.password,
      isWriter: true
    },
    leadParagraph: req.body.leadParagraph,
    body: req.body.body,
    subheading: req.body.subheading,
    imageUrl: req.body.imageUrl
  });
  article = await article.save();

  res.send(article);
});

router.put('/:id', [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findById(req.user._id).select('-name');
  const article = await Article.findById(req.params.id);

  if(JSON.stringify(user._id) === JSON.stringify(article.user.id)) {
    await Article.updateOne({
      _id: ObjectID(req.params.id),
      title: req.body.title,
      subheading: req.body.subheading,
      leadParagraph: req.body.leadParagraph,
      body: req.body.body,
      imageUrl: req.body.imageUrl
    });
    const updatedArticle = await Article.findById(req.params.id);
    res.status(200).send(updatedArticle);
  } else {
    return res.status(401).send('Unauthorized');  
  }
});

router.delete('/:id', [auth], async (req, res) => {
  const user = await User.findById(req.user._id).select('-name');
  const article = await Article.findById(req.params.id);

  if (JSON.stringify(user._id) === JSON.stringify(article.user.id)) {
    const result = await Article.deleteOne();
    return res.status(204).send({});
  } else {
    return res.status(401).send('Unauthorized');
  }
});

router.get('/:id', validateObjectId, async (req, res) => {

  const article = await Article.findById(req.params.id);

  if (!article) return res.status(404).send('The article with the given ID was not found.');

  res.send(article);
});

module.exports = router;