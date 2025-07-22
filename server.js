const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const trackingFile = "./tracking.json";


//must add data for video storage so that the videos are private and secure
app.get("/track/open", (req, res) => {
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

  // Transparent 1x1 pixel image
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

app.use(express.json());
app.use(express.static('public')); // Serve static files

//admi loging authentication 
const jwt = require('jsonwebtoken');

const SECRET_KEY = "super_secret_key"; // In production, use environment variables
const adminUser = {
  username: "admin",
  password: "admin123" // You can hardcode or read from env for now
};

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user; // attach user info to request
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

  return res.status(401).json({ error: "Invalid credentials" });
});


// Admin dashboard fetches all results (protected)
app.get('/api/results', verifyToken, (req, res) => {
  const resultsFile = path.join(__dirname, 'data', 'results.json');

  if (!fs.existsSync(resultsFile)) {
    return res.json([]);
  }

  const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
  res.json(results);
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

// testing to check if token auth works
app.get('/api/admin/test-auth', verifyToken, (req, res) => {
  res.json({ message: "Authenticated!", user: req.user });
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

app.post('/verify-token', verifyToken, (req, res) => {
  // If verifyToken middleware passes, token is valid
  res.json({ valid: true, user: req.user });
});


// Save quiz/module result from employee
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





