// src/utils/emailSender.js
const nodemailer = require("nodemailer");
const emailConfig = require("../config/email");

const transporter = nodemailer.createTransport(
  emailConfig.service
    ? {
        service: emailConfig.service,
        auth: emailConfig.auth,
      }
    : {
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.port == 465,
        auth: emailConfig.auth,
      }
);

async function sendEmail({ to, subject, html, text }) {
  const mailOptions = {
    from: emailConfig.from,
    to,
    subject,
    text,
    html,
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendEmail };
