// email.js

const nodemailer = require("nodemailer");
const EmailTemplateFactory = require("./emailTemplates/EmailTemplateFactory");

// Select which phishing email template to use
const selectedTemplate = "DocShare"; // You can change to "PasswordReset" or "PayStub"
const emailContent = EmailTemplateFactory.createTemplate(selectedTemplate);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tcollege1524@gmail.com",
    pass: "lvoo nlpl feej oqvw", // Use an App Password in production
  },
});

const message = {
  from: "OptiHR Security <tcollege1524@gmail.com>",
  to: "employee@example.com", // Replace with target test email
  subject: emailContent.subject,
  text: emailContent.plainText,
  html: emailContent.html,
};

transporter.sendMail(message, (err, info) => {
  if (err) {
    return console.error("Error:", err);
  }
  console.log("Phishing simulation email sent:", info.response);
});
