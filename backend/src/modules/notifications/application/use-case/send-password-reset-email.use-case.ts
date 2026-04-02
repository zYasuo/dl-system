import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_SENDER_PORT } from '../../di.tokens';
import type { EmailSenderPort } from '../../domain/ports/email/email-sender.port';
import {
  PASSWORD_RESET_EMAIL_SUBJECT,
  buildPasswordResetEmailHtml,
  buildPasswordResetEmailText,
} from '../email-templates/password-reset-email.template';

@Injectable()
export class SendPasswordResetEmailUseCase {
  constructor(@Inject(EMAIL_SENDER_PORT) private readonly emailSender: EmailSenderPort) {}

  async execute(payload: {
    email: string;
    resetToken: string;
    expiresInMinutes: number;
  }): Promise<void> {
    const { resetToken, expiresInMinutes } = payload;
    await this.emailSender.send({
      to: payload.email,
      subject: PASSWORD_RESET_EMAIL_SUBJECT,
      html: buildPasswordResetEmailHtml({ resetToken, expiresInMinutes }),
      text: buildPasswordResetEmailText({ resetToken, expiresInMinutes }),
    });
  }
}
