import nodemailer from "nodemailer";
import fs from "fs";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: "hello.novacops@gmail.com",
    pass: "vghbbajgeqoutrtg",
  },
});

export default async function POST(
  email: string,
  subject: string,
  html: string
): Promise<boolean> {
  const mailOptions = {
    from: "NovaCops | No Reply <",
    to: email,
    subject: subject,
    html: html,
  };
  try {
    await new Promise<void>((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log("Email sent:", info.response);
          resolve();
        }
      });
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
