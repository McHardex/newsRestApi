const { User, validatePasswordUpdate } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.put('/:token', async (req, res) => {
  const { error } = validatePasswordUpdate(req.body)
  if (error) return res.status(422).send({error: error.details[0].message});


  let user = await User.findOne({ resetPasswordToken: req.params.token })

  console.log('this is user', user)

  if(!user) return res.status(404).send({ userError: 'no user exists in database to update' })

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)

    await user.updateOne({
      password: password,
      confirmPassword: password,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });
    
    res.status(200).send({ message: 'Your password has been successfully reset, please try logging in again' })
});

module.exports = router;