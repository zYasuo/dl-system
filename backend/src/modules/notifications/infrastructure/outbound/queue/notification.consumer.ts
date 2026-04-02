import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationJobName } from './notification-queue.adapter';
import { SendNotificationUseCase } from 'src/modules/notifications/application/use-case/send-notification.use-case';
import { SendPasswordResetEmailUseCase } from 'src/modules/notifications/application/use-case/send-password-reset-email.use-case';
import type {
  EnqueueEmailVerificationOtpPayload,
  EnqueueNotificationPayload,
  EnqueuePasswordResetPayload,
} from 'src/modules/notifications/domain/ports/queue/notification-queue.port';
import { SendOtpVerificationEmailUseCase } from 'src/modules/notifications/application/use-case/send-otp-verification-email.use-case';

const QUEUE_NAME = 'notifications';

const NOTIFICATION_WORKER_CONCURRENCY = 10;

@Processor(QUEUE_NAME, { concurrency: NOTIFICATION_WORKER_CONCURRENCY })
export class NotificationConsumer extends WorkerHost {
  private readonly logger = new Logger(NotificationConsumer.name);

  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
    private readonly sendPasswordResetEmailUseCase: SendPasswordResetEmailUseCase,
    private readonly sendOtpVerificationEmailUseCase: SendOtpVerificationEmailUseCase,
  ) {
    super();
  }

  async process(
    job: Job<
      EnqueueNotificationPayload | EnqueuePasswordResetPayload | EnqueueEmailVerificationOtpPayload
    >,
  ): Promise<void> {
    switch (job.name as NotificationJobName) {
      case NotificationJobName.TICKET_CREATED:
        await this.sendNotificationUseCase.execute(
          (job.data as EnqueueNotificationPayload).notificationId,
        );
        break;
      case NotificationJobName.PASSWORD_RESET: {
        const data = job.data as EnqueuePasswordResetPayload;
        await this.sendPasswordResetEmailUseCase.execute({
          email: data.email,
          resetToken: data.resetToken,
          expiresInMinutes: data.expiresInMinutes,
        });
        break;
      }
      case NotificationJobName.EMAIL_VERIFICATION_OTP: {
        const data = job.data as EnqueueEmailVerificationOtpPayload;
        await this.sendOtpVerificationEmailUseCase.execute({
          to: data.to,
          name: data.name,
          code: data.code,
          expiresInMinutes: data.expiresInMinutes,
        });
        break;
      }
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }
}
