const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")
const msg = {
  to: 'omar.a.eldars@gmail.com', // Change to your recipient
  from: 'english.iti41@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(JSON.stringify(error));
  })
