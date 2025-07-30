const fs = require('fs');
const nodemailer = require('nodemailer');
const { sendPhishingEmail } = require('../backend/email');

jest.mock('fs');
jest.mock('nodemailer');

describe('Email Module', () => {
  let mockSendMail;

  beforeEach(() => {
    fs.existsSync.mockReturnValue(false);
    fs.writeFileSync.mockImplementation(() => {});
    fs.readFileSync.mockReturnValue('{}');

    mockSendMail = jest.fn((options, callback) => callback(null, { response: 'OK' }));
    nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });
  });

  test('sendPhishingEmail() writes tracking data and sends email', async () => {
    const response = await sendPhishingEmail('test@example.com');
    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(mockSendMail).toHaveBeenCalled();
    expect(response).toBe('OK');
  });

  test('sendPhishingEmail() rejects if sendMail fails', async () => {
    mockSendMail.mockImplementationOnce((opts, cb) => cb(new Error('fail')));
    await expect(sendPhishingEmail('test@example.com')).rejects.toThrow('fail');
  });
});
