# PhishingSimulator

A phishing simulation tool developed using JavaScript, HTML, and CSS. This project helps educate users on cybersecurity threats by simulating realistic phishing emails and tracking interactions.

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
Install MySQL.
Run `create_tables.sql` to create the database:
  mysql -u root -p < create_tables.sql

