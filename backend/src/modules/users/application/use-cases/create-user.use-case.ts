import { CreateUserBody } from '../dto/create-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import type { PasswordHasherPort } from 'src/modules/users/domain/ports/security/password-hasher.port';
import { randomUUID } from 'node:crypto';
import type { UserRepositoryPort } from 'src/modules/users/domain/ports/repository/user.repository.port';
import type { EmailVerificationChallengeRepositoryPort } from 'src/modules/users/domain/ports/repository/email-verification-challenge.repository.port';
import type { EmailVerificationCodeHasherPort } from 'src/modules/users/domain/ports/security/email-verification-code-hasher.port';
import type { NotificationQueuePort } from 'src/modules/notifications/domain/ports/queue/notification-queue.port';
import { NOTIFICATION_QUEUE_PORT } from 'src/modules/notifications/di.tokens';
import {
  EMAIL_VERIFICATION_CHALLENGE_REPOSITORY,
  EMAIL_VERIFICATION_CODE_HASHER,
  PASSWORD_HASHER,
  USER_REPOSITORY,
} from '../../di.tokens';
import { EMAIL_VERIFICATION_OTP_TTL_MS } from '../constants/email-verification.constants';
import { generateSixDigitOtpCode } from '../utils/six-digit-otp';

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(EMAIL_VERIFICATION_CHALLENGE_REPOSITORY)
    private readonly emailVerificationChallengeRepository: EmailVerificationChallengeRepositoryPort,
    @Inject(EMAIL_VERIFICATION_CODE_HASHER)
    private readonly emailVerificationCodeHasher: EmailVerificationCodeHasherPort,
    @Inject(NOTIFICATION_QUEUE_PORT)
    private readonly notificationQueue: NotificationQueuePort,
  ) {}

  async execute(input: CreateUserBody): Promise<UserEntity> {
    const { name, email, password } = input;
    const now = new Date();

    const existing = await this.userRepository.findByEmail(email);

    if (existing) {
      throw new ConflictException('Registration failed');
    }

    const hashedPassword = await this.passwordHasher.hash(password);

    const { user, internalUserId: internalId } = await this.userRepository.createWithCredential(
      UserEntity.create({
        id: randomUUID(),
        name,
        email,
        emailVerifiedAt: null,
        createdAt: now,
        updatedAt: now,
      }),
      hashedPassword,
    );

    const challengeUuid = randomUUID();
    const code = generateSixDigitOtpCode();
    const codeHash = this.emailVerificationCodeHasher.hash(code, challengeUuid);
    const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_OTP_TTL_MS);

    await this.emailVerificationChallengeRepository.deletePendingForUser(internalId);
    await this.emailVerificationChallengeRepository.create({
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
        `Failed to enqueue email verification for user ${user.id}`,
        err instanceof Error ? err.stack : err,
      );
    }

    return user;
  }
}
