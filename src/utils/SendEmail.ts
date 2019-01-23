// Imports
import nodemailer from "nodemailer";

// Utils
import { Logger } from "./Logger";

export async function SendEmail(email: string, url: string): Promise<void> {
  try {
    const account = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      auth: {
        pass: account.pass,
        user: account.user
      },
      host: "smtp.ethereal.email",
      port: 587,
      secure: false
    });

    const mailOptions = {
      from: '"Spooky Ghost 👻" <spookyghost@gmail.com>',
      html: `<a href="${url}">${url}</a>`,
      subject: "Lien de confirmation",
      text:
        "Voici le lien de confirmation pour finir l'ouverture de votre compte.",
      to: email
    };

    const info = await transporter.sendMail(mailOptions);

    Logger.info("Message sent: %s", info.messageId);
    Logger.info("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    Logger.error(err);
  }
}
