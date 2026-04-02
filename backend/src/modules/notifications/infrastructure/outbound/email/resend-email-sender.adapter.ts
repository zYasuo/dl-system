import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import type { IEmailConfig } from '../../../config/email.config';
import {
  EmailSenderPort,
  type SendEmailParams,
} from '../../../domain/ports/email/email-sender.port';
import { maskEmailRecipient } from './mask-email-recipient';

/** Matches Resend onboarding sender when no custom domain is configured yet. */
const DEFAULT_RESEND_FROM = 'Notifications <onboarding@resend.dev>';

@Injectable()
export class ResendEmailSender extends EmailSenderPort implements OnModuleInit {
  private readonly logger = new Logger(ResendEmailSender.name);
  private readonly resend: Resend | null;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    super();
    const email = this.configService.get<IEmailConfig>('email');
    const apiKey = email?.resendApiKey?.trim() ?? '';
    this.resend = apiKey ? new Resend(apiKey) : null;
    const configured = email?.emailFrom?.trim() ?? '';
    this.fromEmail = configured || DEFAULT_RESEND_FROM;
  }

  onModuleInit(): void {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    if (!this.resend) {
      throw new Error('RESEND_API_KEY is required in production');
    }
  }

  async send(params: SendEmailParams): Promise<void> {
    const { to, subject, html, text } = params;

    if (!this.resend) {
      this.logger.warn(
        `RESEND_API_KEY not set; email not sent (to=${maskEmailRecipient(to)} subject="${subject}")`,
      );
      return;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject,
        html,
        text,
      });

      if (error) {
        this.logger.warn(
          `Resend API error to=${maskEmailRecipient(to)} subject="${subject}": ${error.message}`,
        );
        throw new Error(`Resend email failed: ${error.message}`);
      }

      this.logger.log(
        `Email sent id=${data?.id ?? 'n/a'} to=${maskEmailRecipient(to)} subject="${subject}"`,
      );
    } catch (err) {
      if (err instanceof Error && err.message.startsWith('Resend email failed')) {
        throw err;
      }
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Resend send failed to=${maskEmailRecipient(to)} subject="${subject}": ${message}`,
      );
      throw err instanceof Error ? err : new Error(message);
    }
  }
}
