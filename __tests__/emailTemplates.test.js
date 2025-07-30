const { generateEmailContent } = require('../utils/emailTemplates');

describe('generateEmailContent', () => {
  test('returns correct HTML when subject and message are provided', () => {
    const html = generateEmailContent('Welcome', 'Thanks for joining!');
    expect(html).toContain('<h1>Welcome</h1>');
    expect(html).toContain('<p>Thanks for joining!</p>');
  });

  test('throws an error if subject is missing', () => {
    expect(() => generateEmailContent('', 'Body text')).toThrow('Missing subject or message');
  });

  test('throws an error if message is missing', () => {
    expect(() => generateEmailContent('Subject', '')).toThrow('Missing subject or message');
  });
});
