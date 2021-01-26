const nodemailer = require('nodemailer');

const sendEmail = async (recepient, data) => {
  if (!(process.env.SEND_EMAILS === 'TRUE')) return;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.NOTOFICATION_ACCOUNT_EMAIL,
      pass: process.env.NOIIFICATION_ACCOUNT_PASSWORD,
    }
  });

  const mailOptions = {
    // sender address
    from: 'ETC MVP',
    // list of receivers
    to: [recepient],
    // Subject line
    subject: data.subject,
    // plain text body
    html: data.body,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('>>> Message successfully sent "sent"');
  } catch (e) {
    console.log('>>> Message failed to send');
    console.log(e);
  }
};

module.exports = sendEmail;