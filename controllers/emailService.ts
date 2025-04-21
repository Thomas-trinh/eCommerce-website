import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env file inside controllers folder
dotenv.config({ path: './controllers/.env' });

// Create and export the mail transporter
export const transporter = nodemailer.createTransport({
  port: 465,
  secure: true,
  host: "smtp.gmail.com",
  service: "Gmail",
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// Define the type for the email options
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string; // optional
}

// Function to send a reset password email
export async function sendResetEmail(mailOptions: MailOptions): Promise<boolean> {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export default transporter;
