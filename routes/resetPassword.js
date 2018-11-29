const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


router.get('/', async (req, res) => {
  let user = await User.findOne({
    resetPasswordToken: req.query.resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() }
  })

  if(!user) return res.status(401).send({error: 'password reset link is invalid or has expired'})
  res.status(200).send({
    email: user.email,
    message: 'password reset link a-ok',
  })
})

router.put('/updatePasswordViaEmail', async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if(user) {
    console.log('user exists in database' )

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    await user.updateOne({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });
    console.log('password updated')
    res.status(200).send({ message: 'password updated' })
  } else {
    console.log('no user exists in database to update')
    res.status(404).send({ message: 'no user exists in database to update' })
  }
});

module.exports = router;