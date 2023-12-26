import ejs from "ejs";
import nodemailer, { Transporter } from "nodemailer";
import path from "path";

import secret from "../config/secret";

interface IEmailOption {
  email: string;
  subject: string;
  templete: string;
  data: { [key: string]: any };
}

export const sendMails = async (options: IEmailOption): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    port: Number(secret.smtpPort),
    host: secret.smtpHost,
    service: secret.smtpService,
    auth: {
      user: secret.smtpMail,
      pass: secret.smtpPass,
    },
  });

  const { email, subject, templete, data } = options;

  const templetePath = path.join(__dirname, "../views", templete);

  //render the mail templete with ejs
  const html: string = await ejs.renderFile(templetePath, data);
  const mailOptions = {
    from: secret.smtpMail,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
