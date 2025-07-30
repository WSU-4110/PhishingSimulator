function generateEmailContent(subject, message) {
  if (!subject || !message) {
    throw new Error('Missing subject or message');
  }

  return `
    <html>
      <head><title>${subject}</title></head>
      <body>
        <h1>${subject}</h1>
        <p>${message}</p>
      </body>
    </html>
  `;
}

module.exports = { generateEmailContent };
