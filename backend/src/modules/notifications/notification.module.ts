import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { NotificationRepository } from './infrastructure/outbound/persistence/repositories/notification.repository';
import { NotificationQueueAdapter } from './infrastructure/outbound/queue/notification-queue.adapter';
import { NotificationConsumer } from './infrastructure/outbound/queue/notification.consumer';
import { SendNotificationUseCase } from './application/use-case/send-notification.use-case';
import { SendPasswordResetEmailUseCase } from './application/use-case/send-password-reset-email.use-case';
import { EMAIL_SENDER_PORT, NOTIFICATION_QUEUE_PORT, NOTIFICATION_REPOSITORY } from './di.tokens';
import { ResendEmailSender } from './infrastructure/outbound/email/resend-email-sender.adapter';
import { SendOtpVerificationEmailUseCase } from './application/use-case/send-otp-verification-email.use-case';

const QUEUE_NAME = 'notifications';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUE_NAME }), ConfigModule],
  providers: [
    SendNotificationUseCase,
    SendPasswordResetEmailUseCase,
    SendOtpVerificationEmailUseCase,
    NotificationConsumer,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotificationRepository,
    },
    {
      provide: NOTIFICATION_QUEUE_PORT,
      useClass: NotificationQueueAdapter,
    },
    ResendEmailSender,
    {
      provide: EMAIL_SENDER_PORT,
      useExisting: ResendEmailSender,
    },
  ],
  exports: [NOTIFICATION_REPOSITORY, NOTIFICATION_QUEUE_PORT, EMAIL_SENDER_PORT],
})
export class NotificationModule {}
