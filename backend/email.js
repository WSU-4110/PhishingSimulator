// Sends email with a tracking 1x1 pixel. implements some template(s). This is solely backend without javascript file. 

const nodemailer = require("nodemailer");
const fs = require("fs");
const crypto = require("crypto");
const EmailTemplateFactory = require("./emailTemplates/EmailTemplateFactory");

// Select which phishing email template to use
const selectedTemplate = "DocShare"; // You can change to "PasswordReset" or "PayStub"
const customSubject = "Important Document sent by HR for Review"; //Added custom subject line. All of these updates will be updated for usability.
const defaultLink = "https://givemeyourmoney.edu/doc"; //Added custom link. All of these updates will be updated for usability.

const emailContent = EmailTemplateFactory.createTemplate(selectedTemplate, { //Implemented some email content. All of these updates will be updated for usability.
  link: defaultLink,
  subject: customSubject,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tcollege1524@gmail.com",
    pass: "lvoo nlpl feej oqvw", // Use an App Password in production
  },
});

// Generate unique token
const token = crypto.randomUUID();
const recipientEmail = "employee@example.com"; // Allow for usability. Will add changes to this parameter

// Save token + recipient
let trackingData = {};
const trackingFile = "./tracking.json";

if (fs.existsSync(trackingFile)) {
  trackingData = JSON.parse(fs.readFileSync(trackingFile));
}

trackingData[token] = {
  email: recipientEmail,
  opened: false,
  openedAt: null,
};

fs.writeFileSync(trackingFile, JSON.stringify(trackingData, null, 2));

// Add tracking pixel
const trackingPixel = `<img src="http://localhost:3000/track/open?token=${token}" width="1" height="1" style="display:none;" />`;
const htmlWithTracking = emailContent.html + trackingPixel;

const message = {
  from: "OptiHR Security <tcollege1524@gmail.com>",
  to: "employee@example.com", // Replace with target test email
  subject: emailContent.subject,
  text: emailContent.plainText,
  html: htmlWithTracking, //Changed this to include Tracking pixel (1x1).
};

transporter.sendMail(message, (err, info) => {
  if (err) {
    return console.error("Error:", err);
  }
  console.log("Phishing simulation email sent:", info.response);
});
