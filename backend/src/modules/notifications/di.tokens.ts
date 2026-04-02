import type { InjectionToken } from '@nestjs/common';
import type { NotificationRepositoryPort } from 'src/modules/notifications/domain/ports/repository/notification.repository.port';
import type { NotificationQueuePort } from 'src/modules/notifications/domain/ports/queue/notification-queue.port';
import type { EmailSenderPort } from 'src/modules/notifications/domain/ports/email/email-sender.port';

export const NOTIFICATION_REPOSITORY: InjectionToken<NotificationRepositoryPort> =
  Symbol('NOTIFICATION_REPOSITORY');

export const NOTIFICATION_QUEUE_PORT: InjectionToken<NotificationQueuePort> =
  Symbol('NOTIFICATION_QUEUE_PORT');

export const EMAIL_SENDER_PORT: InjectionToken<EmailSenderPort> = Symbol('EMAIL_SENDER_PORT');
