
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelcomeEmail = (email, name) => {
  sgMail.send({
      to: email,
      from: 'juegas.varas@gmail.com',
    subject: 'Sending with SendGrid is Fun',
    text: `Welcome to the app ${name}, we are happy that this was able to work as expected`,
  })
}

const sendCancellationEmail = (email, name) => {
  sgMail.send({
      to: email,
      from: 'juegas.varas@gmail.com',
    subject: 'Sending with SendGrid is Fun',
    text: `Hello ${name}, would like to know if there is an specific reason for the cancellation so we can help you`,
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}
