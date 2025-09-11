import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function sendTestEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Artisan Platform" <${process.env.EMAIL_USER}>`,
      to: "abdullahiopeyemijumai1@gmail.com", // 👈 put the recipient email here
      subject: "Test Email from Artisan App",
      html: `
        <h2>Hello 👋</h2>
        <p>This is a <b>test email</b> sent using Nodemailer + Gmail + App Password.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
  }
}

sendTestEmail();
