const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendWelcomeEmail = async (email, username) => {
  const mailOptions = {
    from: '"CodLift" <noreply@codlift.site>',
    to: email,
    subject: 'Welcome to CodLift! 🚀',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #080b10; color: white; border-radius: 20px;">
        <h1 style="color: #00f5d4; font-size: 32px; text-align: center;">Welcome, ${username}!</h1>
        <p style="font-size: 18px; line-height: 1.6; text-align: center;">
          You've just taken your first step towards becoming a coding master. 
          Get ready for a gamified, high-energy learning experience.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://codelift.netlify.app/dashboard" style="background-color: #00f5d4; color: #080b10; padding: 15px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 18px;">Start Your First Lesson</a>
        </div>
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 50px;">
          Keep the streak alive! 🔥<br>
          © 2024 CodLift Platform
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

const sendLoginAlert = async (email, username) => {
  const mailOptions = {
    from: '"CodLift" <security@codlift.site>',
    to: email,
    subject: 'New Login to CodLift',
    html: `<p>Hi ${username}, there was a new login to your CodLift account. If this wasn't you, please reset your password immediately.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending login alert:', error);
  }
};

module.exports = { sendWelcomeEmail, sendLoginAlert };
