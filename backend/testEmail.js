const nodemailer = require('nodemailer');
require('dotenv').config();

const testEmail = async () => {
  console.log('--- Testing Email Configuration ---');
  console.log('Service:', process.env.EMAIL_SERVICE);
  console.log('User:', process.env.EMAIL_USER);
  // Don't log password

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER?.trim(),
      pass: process.env.EMAIL_PASS?.trim(),
    },
  });

  const mailOptions = {
    from: `"CareerPilot" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Send to self for testing
    subject: "Test Email",
    text: "This is a test email from CareerPilot.",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Response:', info.response);
    process.exit(0);
  } catch (error) {
    console.error('❌ Email failed!');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    if (error.stack) console.error('Stack:', error.stack);
    process.exit(1);
  }
};

testEmail();
