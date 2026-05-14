const nodemailer = require('nodemailer');

// 1. Centralized Transporter Configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // Using 465 for Secure SSL
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // Reminder: This MUST be an App Password
  },
  // Default 'from' so you don't repeat it in every function
  defaults: {
    from: '"CodLift" <noreply@codlift.site>'
  }
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Mailer connection failed:', error);
  } else {
    console.log('🚀 Mailer is ready to send messages');
  }
});

/**
 * Sends a high-energy welcome email to new users
 */
const sendWelcomeEmail = async (email, username) => {
  const mailOptions = {
    to: email,
    subject: 'Welcome to CodLift! 🚀',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #080b10; color: #ffffff; border-radius: 20px; border: 1px solid #1a1e26;">
        <h1 style="color: #00f5d4; font-size: 32px; text-align: center;">Welcome, ${username}!</h1>
        <p style="font-size: 18px; line-height: 1.6; text-align: center; color: #cbd5e1;">
          You've just taken your first step towards becoming a coding master. 
          Get ready for a gamified, high-energy learning experience.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://codelift.site/dashboard" style="background-color: #00f5d4; color: #080b10; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 18px; display: inline-block; transition: transform 0.2s;">Start Your First Lesson</a>
        </div>
        <p style="color: #64748b; font-size: 13px; text-align: center; margin-top: 50px; border-top: 1px solid #1a1e26; padding-top: 20px;">
          Keep the streak alive! 🔥<br>
          © 2026 CodLift Platform
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error(`❌ Error sending welcome email to ${email}:`, error);
    throw error; // Rethrow so the calling function knows it failed
  }
};

/**
 * Security alert for new logins
 */
const sendLoginAlert = async (email, username) => {
  const mailOptions = {
    from: '"CodLift Security" <security@codlift.site>', // Overriding default 'from'
    to: email,
    subject: 'New Login to CodLift 🛡️',
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <p>Hi <strong>${username}</strong>,</p>
        <p>There was a new login to your CodLift account. If this wasn't you, please reset your password immediately.</p>
        <p>Stay safe,<br>The CodLift Security Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('❌ Error sending login alert:', error);
  }
};

module.exports = { sendWelcomeEmail, sendLoginAlert };