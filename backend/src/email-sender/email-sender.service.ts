import { createTestAccount, createTransport, Transporter } from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Wish } from '../wishes/entities/wish.entity';
import constants from '../constants/constants';

@Injectable()
export class EmailSenderService implements OnModuleInit {
  private transporter: Transporter<SentMessageInfo>;
  private testEmailAccount: any;

  async onModuleInit() {
    this.testEmailAccount = await createTestAccount();
    this.transporter = createTransport({
      host: constants().emailDisributionSMTPT.host,
      port: constants().emailDisributionSMTPT.port,
      secure: true,
      auth: {
        user: constants().emailDisributionSMTPT.email,
        pass: constants().emailDisributionSMTPT.password,
      },
    });
  }

  async sendEmail(wish: Wish, to: string[]) {
    const result = await this.transporter.sendMail({
      from: `<${constants().emailDisributionSMTPT.email}>`,
      to,
      subject: 'Информация о вашем сборе',
      text: 'Спасибо что пользуетесь сервисом KupiPodariDay',
      html: `
        <div>
          <a href="${wish.link}">Подарок</a>
          <img src="${wish.image}">
          <p>Контакты тех кто желает скинутся:</p>
          ${to.join(', ')}
        </div>
      `,
    });

    return result;
  }
}
