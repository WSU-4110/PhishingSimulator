const nodemailer = require("nodemailer");

async function main() {
    // Create a transport. Replace with your own transport options.
    const transport = nodemailer.createTransport({
        sendmail: true,
    });

    const info = await transport.sendMail({
        from: "Mailer <mailer@example.com>", // Header From:
        to: "Daemon <daemon@example.com>", // Header To:
        envelope: {
            from: "bounce+12345@example.com", // MAIL FROM:
            to: [
                // RCPT TO:
                "daemon@example.com",
                "mailer@example.com",
            ],
        },
        subject: "Custom SMTP envelope",
        text: "Hello!",
    });

    console.log("Envelope used:", info.envelope);
    // => { from: 'bounce+12345@example.com', to: [ 'daemon@example.com', 'mailer@example.com' ] }
}

main().catch(console.error);