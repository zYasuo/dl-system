import { Injectable, Logger } from '@nestjs/common';
import {
  EmailSenderPort,
  type SendEmailParams,
} from '../../../domain/ports/email/email-sender.port';
import { maskEmailRecipient } from './mask-email-recipient';

@Injectable()
export class NoOpEmailSender extends EmailSenderPort {
  private readonly logger = new Logger(NoOpEmailSender.name);

  send(params: SendEmailParams): Promise<void> {
    this.logger.debug(
      `[NoOp email] to=${maskEmailRecipient(params.to)} subject="${params.subject}" (skipped)`,
    );
    return Promise.resolve();
  }
}
