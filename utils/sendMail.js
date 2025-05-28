// import nodemailer from 'nodemailer';
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (email , event) => {

  const mailOptions = {
    from: `"My App 👋" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${event.type}`,
    html: `<h2>Hello ${email},</h2></br><p>This is to inform you that you ${event.type} --> ${event.plan_name}</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail }
