const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,    
    pass: process.env.EMAIL_PASS,    
  },
});

async function testMail() {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'noreply.esportsindia@gmail.com', 
      subject: '✅ EsportsIndia Email Test',
      text: 'This is a test email from your backend server.',
    });
    console.log('✅ Test email sent!');
  } catch (error) {
    console.error('❌ Error sending test email:', error);
  }
}

testMail();
