const auth = require('../middleware/auth');
const { User, validate, validateUserUpdate} = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
  const users = await User
    .find()
    .sort('email')
    .populate({path: 'articles'})
    .select('-password');

  res.send({users: users});
});

router.get('/me', auth, async (req, res) => {
  const user = await User
    .findById(req.user._id)
    .populate('articles')
    .select('-password');
    res.send({user: user});
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(422).send({errors: error.details[0].message});
 
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(422).send({errors: 'User already registered.'});

  user = new User(_.pick(req.body, ['name', 'email', 'bio', 'password']));
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send({user: _.pick(user, ['_id', 'name', 'email', 'bio'])});
});

router.put('/:id', [auth], async (req, res) => {
  const { error } = validateUserUpdate(req.body);
  if (error) return res.status(422).send({errors: error.details[0].message});

  const user = await User.findById(req.params.id);

  if(JSON.stringify(req.user._id) === JSON.stringify(req.params.id)) {
    await user.updateOne({
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio,
    });
    const updatedUser = await User.findById(req.user._id);
    res.status(200).send({user: updatedUser});
  } else {
    return res.status(401).send({errors: 'Unauthorized'});
  }
});


router.delete('/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (JSON.stringify(req.user._id) === JSON.stringify(user._id)) {

    const result = await user.delete();

    return res.status(204).send({});
  } else {
    return res.status(401).send({errors: 'Unauthorized'});
  }
});

module.exports = router;