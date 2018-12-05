const { User, validateUserEmail} = require('../models/user');
const express = require('express');
const router = express.Router();
require('dotenv').config();
const crypto = require('crypto');

const nodemailer = require('nodemailer')

router.post('/', async (req, res) => {
  const { error } = validateUserEmail(req.body);
  if (error) return res.status(422).send({inputError: error.details[0].message});

  let user = await User.findOne({ email: req.body.email });

  if(!user) return res.status(404).send({error: 'email does not exist in our database'});

    const token = crypto.randomBytes(20).toString('hex');

    Date.prototype.addHours = function(h) {    
      this.setTime(this.getTime() + (h*60*60*1000)); 
      return this;   
   }

    await user.updateOne({
      resetPasswordToken: token,
      resetPasswordExpires: new Date().addHours(2),
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`
      },
    });

    const mailOptions = {
      from: `${process.env.EMAIL_ADDRESS}`,
      to: `${req.body.email}`,
      subject: `Link To Reset Password`,
      text:
        `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
        `http://localhost:3000/#/reset-password/${token}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if(err) {
        console.log('there is an error sending recovery link', err)
      } else {
        console.log('here is the response ', response)
        res.status(200).send({message: 'Password recovery email sent. Check your spam folder if email is not found' });
      }
    });
});

module.exports = router;