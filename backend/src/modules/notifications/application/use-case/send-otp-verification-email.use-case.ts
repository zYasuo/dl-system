import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_SENDER_PORT } from '../../di.tokens';
import type { EmailSenderPort } from '../../domain/ports/email/email-sender.port';
import {
  OTP_VERIFICATION_EMAIL_SUBJECT,
  buildOtpVerificationEmailHtml,
  buildOtpVerificationEmailText,
} from '../email-templates/otp-verification-email.template';

export type SendOtpVerificationEmailPayload = {
  to: string;
  name: string;
  code: string;
  expiresInMinutes: number;
};

@Injectable()
export class SendOtpVerificationEmailUseCase {
  constructor(@Inject(EMAIL_SENDER_PORT) private readonly emailSender: EmailSenderPort) {}

  async execute(payload: SendOtpVerificationEmailPayload): Promise<void> {
    const { to, name, code, expiresInMinutes } = payload;
    await this.emailSender.send({
      to,
      subject: OTP_VERIFICATION_EMAIL_SUBJECT,
      html: buildOtpVerificationEmailHtml({ name, code, expiresInMinutes }),
      text: buildOtpVerificationEmailText({ name, code, expiresInMinutes }),
    });
  }
}
