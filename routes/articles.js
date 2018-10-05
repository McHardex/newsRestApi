const auth = require('../middleware/auth');
const { Article, validate } = require('../models/article');
const {User} = require('../models/user');
const validateObjectId = require('../middleware/validateObjectId');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const express = require('express');
const router = express.Router();


router.get('/', async (req, res, next) => {
  const articles = await Article.find()
    .sort("-datePublished")
    .populate({path: 'user', select: '-articles -password'});

  res.send(articles);
});

router.post('/', [auth], async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(422).send(error.details[0].message);

  const user = await User.findById(req.user._id);

  let article = new Article({
    title: req.body.title,
    user: user._id,
    leadParagraph: req.body.leadParagraph,
    body: req.body.body,
    subheading: req.body.subheading,
    imageUrl: req.body.imageUrl
  });

  article = await article.save();
  user.articles.push(article)
  user.save();
  res.send(article);
});

router.put('/:id', [auth], async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(422).send(error.details[0].message);
  const article = await Article.findById(req.params.id);

  if(JSON.stringify(req.user._id) === JSON.stringify(article.user)) {
    await article.updateOne({
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
  const user = await User.findById(req.user._id)
  if (!user) return res.status(404).send('The user with the given ID was not found.');

  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).send('The article with the given ID was not found.');

  if (JSON.stringify(req.user._id) === JSON.stringify(article.user)) {
    const userArticles = user.articles
    const articleIndex = userArticles.indexOf(article.id)
    const result = await article.delete();

    userArticles.splice(articleIndex, 1)
    user.save();

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