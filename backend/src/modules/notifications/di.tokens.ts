import type { InjectionToken } from '@nestjs/common';
import type { NotificationRepositoryPort } from 'src/modules/notifications/domain/ports/repository/notification.repository.port';
import type { NotificationQueuePort } from 'src/modules/notifications/domain/ports/queue/notification-queue.port';

export const NOTIFICATION_REPOSITORY: InjectionToken<NotificationRepositoryPort> =
  Symbol('NOTIFICATION_REPOSITORY');

export const NOTIFICATION_QUEUE_PORT: InjectionToken<NotificationQueuePort> =
  Symbol('NOTIFICATION_QUEUE_PORT');
