//This file allows people to access data with simple clicks and things like that.

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const trackingFile = "./tracking.json";
const EmailTemplateFactory = require('./emailTemplates/EmailTemplateFactory');
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const { AdminDashboard, FetchInteractionAnalyticsCommand } = require('./backend/AnalyticsCommand'); // adjust path as needed
const AnalyticsService = require('./backend/AnalyticsService');



app.get("/api/analytics", (req, res) => { //API for frontend to request analytics data and insert in data table.
  const dashboard = new AdminDashboard();
  const analyticsService = new AnalyticsService();
  const command = new FetchInteractionAnalyticsCommand(analyticsService);

  const stats = dashboard.runCommand(command);
  res.json({ success: true, data: stats});
});

app.get("/track/open", (req, res) => { //API for frontend to track the 1x1 Pixel in Emails and if it's been opened or not. 
  const token = req.query.token;

  if (!token) {
    return res.status(400).send("Missing token");
  }

  if (!fs.existsSync(trackingFile)) {
    return res.status(404).send("Tracking file not found");
  }

  let trackingData = {};
  try {
    trackingData = JSON.parse(fs.readFileSync(trackingFile, "utf8"));
  } catch (err) {
    console.error("Error reading tracking.json:", err);
    return res.sendStatus(500);
  }

  if (trackingData[token]) {
    trackingData[token].opened = true;
    trackingData[token].openedAt = new Date().toISOString();
    fs.writeFileSync(trackingFile, JSON.stringify(trackingData, null, 2));
    console.log(`Email opened by: ${trackingData[token].email}`);
  }

  const pixel = Buffer.from(   // Transparent 1x1 pixel image
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AApgB9ENeZF8AAAAASUVORK5CYII=",
    "base64"
  );
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": pixel.length,
  });
  res.end(pixel);
});

app.use(express.json());
app.use(express.static('public')); // Serve static files


app.get('/modules.html', (req, res) => { //for modules 
  res.sendFile(path.join(__dirname, 'public', 'modules.html'));
});

app.post('/api/track-phish', (req, res) => { // Post the phishing attempts.
  const { username, timestamp } = req.body;

  const dataFile = path.join(__dirname, 'data', 'phishAttempts.json');   

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


const transporter = nodemailer.createTransport({ //Use of Node.js transporter.
  service: "gmail",
  auth: {
    user: "optihragency@gmail.com",
    pass: "squm lmvp ltqc hyks",
  },
});

app.post("/send-email", (req, res) => { //Post to send email.
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
  
const token = crypto.randomUUID();
const trackingPixel = `<img src="http://localhost:3000/track/open?token=${token}" width="1" height="1" style="display:none;" />`;
const htmlWithTracking = emailContent.html + trackingPixel;
  
let trackingData = {}; //List of people with credentials that have opened. Multiple recipients as wlel.

if (fs.existsSync(trackingFile)) {
  trackingData = JSON.parse(fs.readFileSync(trackingFile, "utf8"));
}
trackingData[token] = { //Trackingdata
  email: recipients,
  opened: false,
  openedAt: null,
};
fs.writeFileSync(trackingFile, JSON.stringify(trackingData, null, 2)); //Prepares file
  
  const mailOptions = {
    from: `${displayName} <${spoofedEmail}>`,
    to: recipients,
    subject: emailContent.subject,
    text: emailContent.plainText,
    html: htmlWithTracking 
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



