# PhishingSimulator

A phishing simulation tool developed using JavaScript, HTML, and CSS. This project helps educate users on cybersecurity threats by simulating realistic phishing emails and tracking interactions.

## 📁 Project Structure

├── backend/ # Backend logic and tracking handlers
├── data/ # User data, logs, or email metadata
├── emailTemplates/ # Predefined phishing email templates
├── node_modules/ # Node.js dependencies
├── public/ # Static frontend files (HTML/CSS/JS)
├── server.js # Main server entry point
├── package.json # Project metadata and dependencies
├── .gitignore # Ignored files and folders

## 🚀 Features

- 📨 Simulate phishing emails like "DocShare", "PasswordReset", and "PayStub"
- 🧠 Use command pattern for sending emails via `email.js`
- 📊 Admin dashboard to monitor user engagement and clicks
- 🛡️ Email tracking and logging for behavior analysis

## 🛠️ Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- SMTP credentials (e.g., Gmail, Mailtrap)

### Installation
```bash
git clone https://github.com/WSU-4110/PhishingSimulator.git
cd PhishingSimulator
npm install
