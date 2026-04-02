export type EnqueueNotificationPayload = {
  notificationId: string;
  ticketId: string;
  ticketTitle: string;
  userId: string;
  recipient: string;
};

export type EnqueuePasswordResetPayload = {
  userId: string;
  email: string;
  resetToken: string;
  expiresInMinutes: number;
};

export type EnqueueEmailVerificationOtpPayload = {
  userId: string;
  challengeUuid: string;
  to: string;
  name: string;
  code: string;
  expiresInMinutes: number;
};

export abstract class NotificationQueuePort {
  abstract enqueueTicketCreated(payload: EnqueueNotificationPayload): Promise<void>;
  abstract enqueuePasswordReset(payload: EnqueuePasswordResetPayload): Promise<void>;
  abstract enqueueEmailVerificationOtp(payload: EnqueueEmailVerificationOtpPayload): Promise<void>;
}
