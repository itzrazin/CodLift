import nodemailer from 'nodemailer';

// 1. Centralized Transporter Configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // Using 465 for Secure SSL
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD, // This MUST be an App Password
  },
  // Default 'from' so you don't repeat it in every function
  defaults: {
    from: '"CodLift" <noreply@codlift.site>'
  }
} as any);

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('⚠️  Mailer connection failed, email features will be disabled:', error.message);
  } else {
    console.log('🚀 Mailer is ready to send messages');
  }
});

/**
 * Sends a high-energy welcome email to new users
 */
export const sendWelcomeEmail = async (email: string, username: string) => {
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
          <a href="https://codlift.site/dashboard" style="background-color: #00f5d4; color: #080b10; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 18px; display: inline-block; transition: transform 0.2s;">Start Your First Lesson</a>
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
    throw error;
  }
};

/**
 * Security alert for new logins
 */
export const sendLoginAlert = async (email: string, username: string) => {
  const mailOptions = {
    from: '"CodLift Security" <security@codlift.site>',
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

/**
 * Generic email sender for admin custom emails
 */
export const sendCustomEmail = async (to: string, subject: string, message: string) => {
  const mailOptions = {
    to,
    subject,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #080b10; color: #ffffff; border-radius: 20px;">
        <h2 style="color: #a855f7;">Message from CodLift Support</h2>
        <div style="font-size: 16px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap;">
          ${message}
        </div>
        <p style="color: #64748b; font-size: 12px; margin-top: 40px; border-top: 1px solid #1a1e26; padding-top: 20px;">
          This is an official communication from CodLift.
        </p>
      </div>
    `,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`❌ Error sending custom email to ${to}:`, error);
    throw error;
  }
};

/**
 * Bulk email sender with BCC batching
 */
export const sendBulkEmail = async (recipients: string[], subject: string, message: string) => {
  const BATCH_SIZE = 50;
  const DELAY_MS = 2000; // 2 seconds between batches

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);
    const mailOptions = {
      bcc: batch,
      subject,
      html: `
        <div style="font-family: sans-serif; padding: 30px; background-color: #080b10; color: #ffffff;">
          <h1 style="color: #00f5d4;">CodLift Platform Announcement</h1>
          <div style="font-size: 16px; line-height: 1.6; white-space: pre-wrap;">
            ${message}
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      if (i + BATCH_SIZE < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
    } catch (error) {
      console.error(`❌ Error sending bulk email batch:`, error);
    }
  }
};

export default transporter;
