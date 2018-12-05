const { User } = require('../models/user');
const express = require('express');
const router = express.Router();


router.get('/:token', async (req, res) => {
  let user = await User.findOne( 
    { $and: 
      [{resetPasswordExpires: { $gt: Date.now() } }, 
      { resetPasswordToken: req.params.token }]
    }
  )

  // console.log(user)

  if(!user) {
    console.log('password reset link invalid or expired')
    res.status(401).send({error: 'Ooops!!! Sorry, this password reset link is invalid or has expired' })
  } else {
    res.status(200).send({
      email: user.email,
      message: 'password reset link a-ok'
    })
  }
})

module.exports = router;