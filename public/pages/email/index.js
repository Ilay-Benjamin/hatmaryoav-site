const nodemailer = require('nodemailer');

// create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport();

// send the email
transporter.sendMail({
  from: 'hativat.yoav1@gmail.com',
  to: 'ilaybenjamin1@gmail.com',
  subject: 'Email Subject',
  text: 'Email body',
});




