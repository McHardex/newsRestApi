const Joi = require('joi');
const mongoose = require('mongoose');
const {userSchema} = require('./user');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 60
  },
  subheading: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 100
  },
  leadParagraph: {
    type: String,
    required: true,
    minlength: 50,
    maxlength: 1000
  },
  body: {
    type: String,
    required: true,
    minlength: 50,
    maxlength: 1000
  },
  imageUrl: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  datePublished: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Article = mongoose.model('Article', articleSchema);

function validateArticle(article) {
  const schema = {
    title: Joi.string().min(10).max(60).required(),
    subheading: Joi.string().min(20).max(100).required(),
    leadParagraph: Joi.string().min(50).max(1000).required(),
    body: Joi.string().min(50).max(1000).required(),
    imageUrl: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(article, schema);
}

exports.articleSchema = articleSchema;
exports.Article = Article; 
exports.validate = validateArticle;

