// src/config/email.js
require("dotenv").config();

module.exports = {
  service: process.env.EMAIL_SERVICE || undefined, // gunakan service jika ada (misal gmail)
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD,
  },
  from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
};
