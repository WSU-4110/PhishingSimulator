const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
//must add data for video storage so that the videos are private and secure

app.use(express.json());
app.use(express.static('public')); // Serve static files

//for modules 
app.get('/modules.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'modules.html'));
});

// Endpoint to track phishing attempts
app.post('/api/track-phish', (req, res) => {
  const { username, timestamp } = req.body;

  // Simple logging to a JSON file for demo purposes
  const dataFile = path.join(__dirname, 'data', 'phishAttempts.json');

  // Read existing data or initialize array
  let attempts = [];
  if (fs.existsSync(dataFile)) {
    attempts = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  }

  attempts.push({ username, timestamp });

  fs.writeFileSync(dataFile, JSON.stringify(attempts, null, 2));

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

const EmailTemplateFactory = require('./emailTemplates/EmailTemplateFactory');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "optihragency@gmail.com",
    pass: "squm lmvp ltqc hyks",
  },
});

app.post("/send-email", (req, res) => {
  const { template, recipients, customMessage, displayName, spoofedEmail } = req.body;

  let emailContent;
  try {
    emailContent = template === "Custom"
      ? {
          subject: "Custom Message",
          plainText: customMessage,
          html: `<p>${customMessage}</p>`
        }
      : EmailTemplateFactory.createTemplate(template);
  } catch (err) {
    return res.status(400).json({ success: false, error: "Invalid template" });
  }

  const mailOptions = {
    from: `${displayName} <${spoofedEmail}>`,
    to: recipients,
    subject: emailContent.subject,
    text: emailContent.plainText,
    html: emailContent.html
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Email error:", err);
      return res.status(500).json({ success: false });
    }
    console.log("Sent:", info.response);
    res.json({ success: true });
  });
});



