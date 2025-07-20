const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  ignoreTLS: true,
});

async function sendEmail({ to, subject, html }) {
  const mailOptions = {
    from: `Your App Name <${process.env.EMAIL_SENDER}>`,
    to,
    subject,
    html,
  };
  console.log(mailOptions);
  try {
    console.log("testings - 2");

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("Failed to send email:", err);
    return false;
  }
}

module.exports = sendEmail;
