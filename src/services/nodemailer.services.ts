import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface MailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string; // Optional override
}

// Transporter using Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "live.smtp.mailtrap.io",
  tls:{
    rejectUnauthorized:true
  },
  
  // secure:process.env.MAIL_PORT === "465" ? true :false,
  port: parseInt(process.env.MAIL_PORT || "587"),
  auth: {
    user: process.env.MAIL_USER || "api",      
    pass: process.env.MAIL_PASS as string,     
  },
});

/**
 * Send an email using the reusable transporter
 */
export async function sendMail(options: MailOptions): Promise<void> {
  try {
    const mail = await transporter.sendMail({
      from: options.from || `"Support" <${process.env.MAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log(`✅ Email sent to ${options.to}: ${mail.messageId}`);
  } catch (error) {
    console.error(`❌ Error sending mail to ${options.to}`, error);
    throw error;
  }
}
