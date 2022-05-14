import nodemailer from "nodemailer";
import { MailAdapter, SendMailData } from "../mail-adapter";

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "110f974c902074",
    pass: "a9db8572aa0989",
  },
});

export class NodemailerMailAdapter implements MailAdapter {
  async sendMail({ body, subject }: SendMailData) {
    await transport.sendMail({
      from: "Equipe Feedget <oi@feedget.com.br>",
      to: "Luan Cardoso <luancardosoti@gmail.com>",
      subject: subject,
      html: body,
    });
  }
}
