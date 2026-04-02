import { Inject, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  EMAIL_VERIFICATION_CHALLENGE_REPOSITORY,
  EMAIL_VERIFICATION_CODE_HASHER,
  USER_REPOSITORY,
} from 'src/modules/users/di.tokens';
import type { UserRepositoryPort } from 'src/modules/users/domain/ports/repository/user.repository.port';
import type { EmailVerificationChallengeRepositoryPort } from 'src/modules/users/domain/ports/repository/email-verification-challenge.repository.port';
import type { EmailVerificationCodeHasherPort } from 'src/modules/users/domain/ports/security/email-verification-code-hasher.port';
import { NOTIFICATION_QUEUE_PORT } from 'src/modules/notifications/di.tokens';
import type { NotificationQueuePort } from 'src/modules/notifications/domain/ports/queue/notification-queue.port';
import { EMAIL_VERIFICATION_OTP_TTL_MS } from 'src/modules/users/application/constants/email-verification.constants';
import { generateSixDigitOtpCode } from 'src/modules/users/application/utils/six-digit-otp';
import type { ResendEmailVerificationBody } from '../dto/resend-email-verification.dto';

const RESEND_MESSAGE =
  'If this email is registered and not verified, a new verification code will be sent';

@Injectable()
export class ResendEmailVerificationUseCase {
  private readonly logger = new Logger(ResendEmailVerificationUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    @Inject(EMAIL_VERIFICATION_CHALLENGE_REPOSITORY)
    private readonly challengeRepository: EmailVerificationChallengeRepositoryPort,
    @Inject(EMAIL_VERIFICATION_CODE_HASHER)
    private readonly codeHasher: EmailVerificationCodeHasherPort,
    @Inject(NOTIFICATION_QUEUE_PORT)
    private readonly notificationQueue: NotificationQueuePort,
  ) {}

  async execute(input: ResendEmailVerificationBody): Promise<string> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user || user.emailVerifiedAt) {
      return RESEND_MESSAGE;
    }

    const internalId = await this.userRepository.getInternalIdByUuid(user.id);
    const challengeUuid = randomUUID();
    const code = generateSixDigitOtpCode();
    const codeHash = this.codeHasher.hash(code, challengeUuid);
    const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_OTP_TTL_MS);

    await this.challengeRepository.deletePendingForUser(internalId);
    await this.challengeRepository.create({
      uuid: challengeUuid,
      userInternalId: internalId,
      codeHash,
      expiresAt,
    });

    try {
      await this.notificationQueue.enqueueEmailVerificationOtp({
        userId: user.id,
        challengeUuid,
        to: user.email.value,
        name: user.name.value,
        code,
        expiresInMinutes: Math.floor(EMAIL_VERIFICATION_OTP_TTL_MS / 60_000),
      });
    } catch (err) {
      this.logger.error(
        `Failed to enqueue verification resend for user ${user.id}`,
        err instanceof Error ? err.stack : err,
      );
    }

    return RESEND_MESSAGE;
  }
}
