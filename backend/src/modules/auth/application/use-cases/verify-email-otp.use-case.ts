import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from 'src/common/errors/application';
import {
  EMAIL_VERIFICATION_CHALLENGE_REPOSITORY,
  EMAIL_VERIFICATION_CODE_HASHER,
  USER_REPOSITORY,
} from 'src/modules/users/di.tokens';
import type { UserRepositoryPort } from 'src/modules/users/domain/ports/repository/user.repository.port';
import type { EmailVerificationChallengeRepositoryPort } from 'src/modules/users/domain/ports/repository/email-verification-challenge.repository.port';
import type { EmailVerificationCodeHasherPort } from 'src/modules/users/domain/ports/security/email-verification-code-hasher.port';
import { EMAIL_VERIFICATION_MAX_ATTEMPTS } from 'src/modules/users/application/constants/email-verification.constants';
import type { VerifyEmailBody } from '../dto/verify-email.dto';
import { AUTH_API_ERROR_CODES } from '../errors';

const VERIFICATION_FAILED = 'Verification failed';

@Injectable()
export class VerifyEmailOtpUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    @Inject(EMAIL_VERIFICATION_CHALLENGE_REPOSITORY)
    private readonly challengeRepository: EmailVerificationChallengeRepositoryPort,
    @Inject(EMAIL_VERIFICATION_CODE_HASHER)
    private readonly codeHasher: EmailVerificationCodeHasherPort,
  ) {}

  async execute(input: VerifyEmailBody): Promise<void> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user || user.emailVerifiedAt) {
      throw new ApplicationException(AUTH_API_ERROR_CODES.VERIFICATION_FAILED, VERIFICATION_FAILED);
    }

    const internalId = await this.userRepository.getInternalIdByUuid(user.id);
    const challenge = await this.challengeRepository.findLatestActiveForUser(internalId);

    if (!challenge) {
      throw new ApplicationException(AUTH_API_ERROR_CODES.VERIFICATION_FAILED, VERIFICATION_FAILED);
    }

    if (challenge.attemptCount >= EMAIL_VERIFICATION_MAX_ATTEMPTS) {
      throw new ApplicationException(AUTH_API_ERROR_CODES.VERIFICATION_FAILED, VERIFICATION_FAILED);
    }

    const valid = this.codeHasher.verify(input.code, challenge.uuid, challenge.codeHash);

    if (!valid) {
      await this.challengeRepository.incrementAttempts(challenge.uuid);
      throw new ApplicationException(AUTH_API_ERROR_CODES.VERIFICATION_FAILED, VERIFICATION_FAILED);
    }

    await this.userRepository.setEmailVerifiedAt(internalId, new Date());
    await this.challengeRepository.markConsumed(challenge.uuid);
  }
}
