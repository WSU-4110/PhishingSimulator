// This file allows people to access data with simple clicks and things like that.
// Handles everything we've made and either posts it or gets the data and returns it in some way.

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken'); // JWT tracking
const trackingFile = "./tracking.json";
const EmailTemplateFactory = require('./emailTemplates/EmailTemplateFactory');
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const { AdminDashboard, FetchInteractionAnalyticsCommand } = require('./backend/AnalyticsCommand');
const AnalyticsService = require('./backend/AnalyticsService');

const SECRET_KEY = "super_secret_key"; // Use env var in prod

app.use(express.json());
app.use(express.static('public'));

const adminUser = {
  username: "admin",
  password: "admin123"
};

// JWT middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Admin login route
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === adminUser.username && password === adminUser.password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

// Protected route to fetch analytics data
app.get('/api/analytics', verifyToken, (req, res) => {
  const dashboard = new AdminDashboard();
  const analyticsService = new AnalyticsService();
  const command = new FetchInteractionAnalyticsCommand(analyticsService);

  const stats = dashboard.runCommand(command);
  res.json({ success: true, data: stats });
});

app.post('/api/verify-token', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ valid: false });

  jwt.verify(token, SECRET_KEY, (err) => {
    if (err) return res.status(403).json({ valid: false });
    res.json({ valid: true });
  });
});

// Submit quiz/module result (no auth)
app.post('/api/submit-result', (req, res) => {
  const { username, moduleName, score, timestamp } = req.body;
  if (!username || !moduleName || typeof score !== 'number') {
    return res.status(400).json({ success: false, error: "Missing or invalid data" });
  }

  const resultsFile = path.join(__dirname, 'data', 'results.json');
  let results = [];

  if (fs.existsSync(resultsFile)) {
    results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
  }

  results.push({ username, moduleName, score, timestamp: timestamp || new Date().toISOString() });
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));

  res.json({ success: true });
});

// Protected route to fetch results (admin only)
app.get('/api/results', verifyToken, (req, res) => {
  const resultsFile = path.join(__dirname, 'data', 'results.json');
  if (!fs.existsSync(resultsFile)) {
    return res.json([]);
  }
  const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
  res.json(results);
});

app.get("/track/open", (req, res) => { // Track the 1x1 pixel in emails
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

  const pixel = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AApgB9ENeZF8AAAAASUVORK5CYII=",
    "base64"
  );
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": pixel.length,
  });
  res.end(pixel);
});

app.get('/modules.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'modules.html'));
});

app.post('/api/track-phish', (req, res) => {
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

app.post('/api/add-user', (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: "Name and Email Address Required" });
  }

  const userFile = path.join(__dirname, "data", "users.json");
  let users = [];

  if (fs.existsSync(userFile)) {
    users = JSON.parse(fs.readFileSync(userFile, "utf-8"));
  }

  if (users.find(user => user.email === email)) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  users.push({ name, email, role: role || "Unknown" });
  fs.writeFileSync(userFile, JSON.stringify(users, null, 2));

  res.json({ success: true, message: "User added successfully!" });
});

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

  const token = crypto.randomUUID();
  const trackingPixel = `<img src="http://localhost:3000/track/open?token=${token}" width="1" height="1" style="display:none;" />`;
  const htmlWithTracking = emailContent.html + trackingPixel;

  let trackingData = {};
  if (fs.existsSync(trackingFile)) {
    trackingData = JSON.parse(fs.readFileSync(trackingFile, "utf8"));
  }
  trackingData[token] = {
    email: recipients,
    opened: false,
    openedAt: null,
  };
  fs.writeFileSync(trackingFile, JSON.stringify(trackingData, null, 2));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
