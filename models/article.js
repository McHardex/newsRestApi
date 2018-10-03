const Joi = require('joi');
const mongoose = require('mongoose');
const {userSchema} = require('./user');

const articleSchema = new mongoose.Schema({
  user: {
    type: userSchema,
    required: true
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  subheading: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  leadParagraph: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  body: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  imageUrl: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200
  },
  datePublished: { 
    type: Date, 
    required: true,
    default: Date.now
  }
});

const Article = mongoose.model('Article', articleSchema);

function validateArticle(article) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    userId: Joi.string().required(),
    subheading: Joi.string().min(2).max(100).required(),
    leadParagraph: Joi.string().min(2).max(100).required(),
    body: Joi.string().min(10).max(1000).required(),
    imageUrl: Joi.string().min(5).max(200).required(),
  };

  return Joi.validate(article, schema);
}

exports.articleSchema = articleSchema;
exports.Article = Article; 
exports.validate = validateArticle;

