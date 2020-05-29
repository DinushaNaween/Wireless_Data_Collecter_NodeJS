const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.MAILADDRESS,
    pass: process.env.MAILPASSWORD
  }
});

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

exports.sendVerificationCode = (recipient, result) => {
   let verificationCode = getRandomInteger(1000, 9999);

   let mailOptions = {
     from: process.env.MAILADDRESS,
     to: recipient,
     subject: 'verification code for verify email',
     text: 'verification code is: ' + verificationCode
   }

   transporter.sendMail(mailOptions, function(err, info){
    if (err) {
      console.log(err);
      result(err, null);
      return;

    } else {
      console.log(info);
      result(null, verificationCode);
      return;
    }
  })
}