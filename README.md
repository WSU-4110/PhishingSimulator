# PhishingSimulator

A phishing simulation tool developed for educational and testing purposes. This project is designed to simulate various phishing email scenarios and track user interactions to raise awareness and improve cybersecurity practices.

## 📁 Project Structure

├── backend/ # Backend logic and tracking handlers
├── data/ # User data, logs, or email metadata
├── emailTemplates/ # Predefined phishing email templates
├── node_modules/ # Node.js dependencies
├── public/ # Static frontend files (HTML/CSS/JS)
├── server.js # Main server entry point
├── package.json # Project metadata and dependencies
├── .gitignore # Ignored files and folders

bash
Copy
Edit

## 🚀 Features

- 📨 Send simulated phishing emails (e.g., "DocShare", "PayStub", "PasswordReset")
- 📊 Admin dashboard for tracking results
- ✅ Email template factory pattern used for modular design
- 🛡️ Encourages user training and awareness on phishing threats

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or later recommended)
- An SMTP email service (e.g., Gmail, Mailtrap, SendGrid)

### Installation
```bash
git clone https://github.com/WSU-4110/PhishingSimulator.git
cd PhishingSimulator
npm install
