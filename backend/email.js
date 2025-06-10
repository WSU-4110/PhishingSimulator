const nodemailer = require("nodemailer"); //Create a Transporter

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { //we'll be changing this Transporter to something more automated for ease of use.
        user: "tcollege1524@gmail.com",
        pass: "lvoo nlpl feej oqvw",
    },
});

let message = { //Documentation for sending Emails. This sends mail
    from: "College Student <tcollege1524@gmail.com>", //Student Gmail. Have to work on transporter Authentication for different emails. 
    to: "tcollege1524@gmail.com", //My student gmail
    subject: "Example message with GIF",
    text: "This is the plainText version",
    html: "<p>For clients that do not support AMP4EMAIL or amp content is not valid</p>", //This sends if AMP (which I hoped to use for cool GIF's) is allowed. Gmail does not. :(
    amp: `<!doctype html>
    <html ⚡4email>
      <head>
        <meta charset="utf-8">
        <style amp4email-boilerplate>body{visibility:hidden}</style>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
      </head>
      <body>
        <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
        <p>GIF (requires "amp-anim" script in header):<br/>
          <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
      </body>
    </html>`,
};

transporter.sendMail(message, (err, info) => { //Sends the message
    if (err) {
        return console.error("Error", err);
    } else {
        console.log("Email sent successfully:", info);
    }
});
