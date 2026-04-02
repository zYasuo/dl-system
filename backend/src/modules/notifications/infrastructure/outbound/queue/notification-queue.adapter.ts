import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  NotificationQueuePort,
  type EnqueueEmailVerificationOtpPayload,
  type EnqueueNotificationPayload,
  type EnqueuePasswordResetPayload,
} from 'src/modules/notifications/domain/ports/queue/notification-queue.port';

const QUEUE_NAME = 'notifications';

export enum NotificationJobName {
  TICKET_CREATED = 'ticket.created',
  PASSWORD_RESET = 'password.reset',
  EMAIL_VERIFICATION_OTP = 'email.verification.otp',
}

@Injectable()
export class NotificationQueueAdapter extends NotificationQueuePort {
  private readonly logger = new Logger(NotificationQueueAdapter.name);

  constructor(@InjectQueue(QUEUE_NAME) private readonly queue: Queue) {
    super();
  }

  async enqueueTicketCreated(payload: EnqueueNotificationPayload): Promise<void> {
    const job = await this.queue.add(NotificationJobName.TICKET_CREATED, payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
      removeOnFail: false,
    });

    this.logger.log(
      `Job ${job.id} enqueued [${NotificationJobName.TICKET_CREATED}] for notification ${payload.notificationId}`,
    );
  }

  async enqueuePasswordReset(payload: EnqueuePasswordResetPayload): Promise<void> {
    const job = await this.queue.add(NotificationJobName.PASSWORD_RESET, payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
      removeOnFail: false,
    });

    this.logger.log(
      `Job ${job.id} enqueued [${NotificationJobName.PASSWORD_RESET}] for user ${payload.userId}`,
    );
  }

  async enqueueEmailVerificationOtp(payload: EnqueueEmailVerificationOtpPayload): Promise<void> {
    const job = await this.queue.add(NotificationJobName.EMAIL_VERIFICATION_OTP, payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
      removeOnFail: false,
      jobId: `email-verification:${payload.challengeUuid}`,
    });

    this.logger.log(
      `Job ${job.id} enqueued [${NotificationJobName.EMAIL_VERIFICATION_OTP}] for user ${payload.userId}`,
    );
  }
}
