import { Injectable } from "@nestjs/common";
import fs = require("fs");
import path = require("path");
import nodemailer = require("nodemailer");
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import Handlebars = require("handlebars");

/**
 *
 */
interface MailOptions {
  subject: string;
  view: string;
  context: object;
  from: string;
  to: string;
}

const subjects = {
  accountVerificationCode: {
    en: "Your account verification code",
    fr: "Le code de vérification de votre compte",
  },
};

@Injectable()
export class MailService {
  async sendMail(options: MailOptions) {
    const { view, context, from, to, subject } = options;

    // Load the email template
    const template = await this.createTemplate(view);
    const html = template(context);

    const transporter = this.createTransporter();

    const sentMessage = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  }

  private createTransporter() {
    const config: SMTPTransport.Options = {
      host: process.env.MAILER_HOST,
      port: Number(process.env.MAILER_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILER_USERNAME,
        pass: process.env.MAILER_PASSWORD,
      },
    };

    return nodemailer.createTransport(config);
  }

  private async createTemplate(fileName: string) {
    const source = await fs.promises
      .readFile(path.join(__dirname, "templates", `${fileName}.handlebars`), { encoding: "utf-8" })
      .catch(error => {
        console.error("An error occurred while reading mail templates", error);
        throw error;
      });

    return Handlebars.compile(source);
  }

  /**
   * Email a one-time-use account verification code
   * @param email the recipients email addresses
   * @param context an object containing
   * @param locale (Optional) a language property. Valid values: `en` and `fr`
   */
  async sendAccountVerificationCode(email: string, context: any, locale: string = "en") {
    const options: MailOptions = {
      subject: subjects.accountVerificationCode[locale],
      view: "send-verification-code",
      context: context,
      from: `"Geo Trails" <noreply@example.com>`,
      to: email,
    };

    await this.sendMail(options);
  }
}
