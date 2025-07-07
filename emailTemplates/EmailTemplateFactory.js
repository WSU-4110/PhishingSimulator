// emailTemplates/EmailTemplateFactory.js

class EmailTemplateFactory {
  static createTemplate(type) {
    switch (type) {
      case "PasswordReset":
        return {
          subject: "🚨🚨 Action Required: Password Reset Request",
          plainText: "Please reset your password immediately.",
          html: `<p>Your account needs a password reset. <a href="http://localhost:3000/index.html">Reset Now</a></p>`,
        };
      case "DocShare":
        return {
          subject: "🔔📧 New Document Shared With You",
          plainText: "A document has been shared with you.",
          html: `<p>You received a secure document. <a href="http://localhost:3000/index.html">View Document</a></p>`,
        };
      case "PayStub":
        return {
          subject: "💸💰👀 Your Latest Pay Stub is Ready",
          plainText: "Access your latest pay stub.",
          html: `<p>Your pay stub is now available. <a href="http://localhost:3000/index.html">View Pay Stub</a></p>`,
        };
      default:
        throw new Error("Invalid template type");
    }
  }
}

module.exports = EmailTemplateFactory;
