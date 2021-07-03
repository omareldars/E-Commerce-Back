const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
// Bring in Models & Helpers
const Contact = require('../models/Contact');

// email
const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey("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");
sgMail.setApiKey("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");

router.post('/add', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const subject = req.body.subject;

  if (!email) {
    return res.status(400).json({error: 'You must enter an email address.'});
  }

  if (!name) {
    return res
      .status(400)
      .json({error: 'You must enter description & name.'});
  }

  if (!message) {
    return res.status(400).json({error: 'You must enter a message.'});
  }

  if (!subject) {
    return res.status(400).json({error: 'You must enter a subject.'});
  }

  const contact = new Contact({
    name,
    email,
    message,
    subject
  })
  datamail = name+" ---- "+email+" ---- "+message+" ---- "+subject;

  const msg = {
    to: 'ekhlasgawish123@gmail.com', // Change to your recipient
    from: 'craftsmakerteam@gmail.com', // Change to your verified sender
    subject: 'Contact Us',
    text: datamail,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent: from Contact US')
    })
    .catch((error) => {
      console.error(JSON.stringify(error));
    });

  contact.save(async (err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }


    res.status(200).json({
      success: true,
      message: `We receved your message, we will reach you on your email address ${email}!`,
      contact: data
    });
  });
});

module.exports = router;
