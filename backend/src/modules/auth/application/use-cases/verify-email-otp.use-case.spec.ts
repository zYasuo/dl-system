import { AUTH_API_ERROR_CODES } from '../errors';
import { randomUUID } from 'node:crypto';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import type { UserRepositoryPort } from 'src/modules/users/domain/ports/repository/user.repository.port';
import type { EmailVerificationChallengeRepositoryPort } from 'src/modules/users/domain/ports/repository/email-verification-challenge.repository.port';
import type { EmailVerificationCodeHasherPort } from 'src/modules/users/domain/ports/security/email-verification-code-hasher.port';
import { EMAIL_VERIFICATION_MAX_ATTEMPTS } from 'src/modules/users/application/constants/email-verification.constants';
import { VerifyEmailOtpUseCase } from './verify-email-otp.use-case';

describe('VerifyEmailOtpUseCase', () => {
  let useCase: VerifyEmailOtpUseCase;
  let userRepository: {
    findByEmail: jest.Mock;
    getInternalIdByUuid: jest.Mock;
    setEmailVerifiedAt: jest.Mock;
  };
  let challengeRepository: {
    findLatestActiveForUser: jest.Mock;
    incrementAttempts: jest.Mock;
    markConsumed: jest.Mock;
  };
  let codeHasher: { verify: jest.Mock };

  const now = new Date('2025-01-01T00:00:00.000Z');
  const uuid = randomUUID();

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      getInternalIdByUuid: jest.fn(),
      setEmailVerifiedAt: jest.fn().mockResolvedValue(undefined),
    };
    challengeRepository = {
      findLatestActiveForUser: jest.fn(),
      incrementAttempts: jest.fn().mockResolvedValue(undefined),
      markConsumed: jest.fn().mockResolvedValue(undefined),
    };
    codeHasher = { verify: jest.fn() };
    useCase = new VerifyEmailOtpUseCase(
      userRepository as unknown as UserRepositoryPort,
      challengeRepository as unknown as EmailVerificationChallengeRepositoryPort,
      codeHasher as unknown as EmailVerificationCodeHasherPort,
    );
  });

  it('throws BadRequest when user missing', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    await expect(useCase.execute({ email: 'x@y.com', code: '123456' })).rejects.toMatchObject({
      code: AUTH_API_ERROR_CODES.VERIFICATION_FAILED,
    });
  });

  it('throws BadRequest when already verified', async () => {
    userRepository.findByEmail.mockResolvedValue(
      UserEntity.create({
        id: uuid,
        name: 'A',
        email: 'a@b.com',
        emailVerifiedAt: now,
        createdAt: now,
        updatedAt: now,
      }),
    );
    await expect(useCase.execute({ email: 'a@b.com', code: '123456' })).rejects.toMatchObject({
      code: AUTH_API_ERROR_CODES.VERIFICATION_FAILED,
    });
  });

  it('verifies and updates user when code matches', async () => {
    userRepository.findByEmail.mockResolvedValue(
      UserEntity.create({
        id: uuid,
        name: 'A',
        email: 'a@b.com',
        emailVerifiedAt: null,
        createdAt: now,
        updatedAt: now,
      }),
    );
    userRepository.getInternalIdByUuid.mockResolvedValue(7);
    challengeRepository.findLatestActiveForUser.mockResolvedValue({
      uuid: 'ch-1',
      codeHash: 'hash',
      expiresAt: new Date(Date.now() + 60000),
      attemptCount: 0,
    });
    codeHasher.verify.mockReturnValue(true);

    await expect(useCase.execute({ email: 'a@b.com', code: '123456' })).resolves.toBeUndefined();

    expect(userRepository.setEmailVerifiedAt).toHaveBeenCalledWith(7, expect.any(Date));
    expect(challengeRepository.markConsumed).toHaveBeenCalledWith('ch-1');
  });

  it('increments attempts and throws when code wrong', async () => {
    userRepository.findByEmail.mockResolvedValue(
      UserEntity.create({
        id: uuid,
        name: 'A',
        email: 'a@b.com',
        emailVerifiedAt: null,
        createdAt: now,
        updatedAt: now,
      }),
    );
    userRepository.getInternalIdByUuid.mockResolvedValue(7);
    challengeRepository.findLatestActiveForUser.mockResolvedValue({
      uuid: 'ch-1',
      codeHash: 'hash',
      expiresAt: new Date(Date.now() + 60000),
      attemptCount: 0,
    });
    codeHasher.verify.mockReturnValue(false);

    await expect(useCase.execute({ email: 'a@b.com', code: '000000' })).rejects.toMatchObject({
      code: AUTH_API_ERROR_CODES.VERIFICATION_FAILED,
    });

    expect(challengeRepository.incrementAttempts).toHaveBeenCalledWith('ch-1');
    expect(userRepository.setEmailVerifiedAt).not.toHaveBeenCalled();
  });

  it('throws when max attempts reached', async () => {
    userRepository.findByEmail.mockResolvedValue(
      UserEntity.create({
        id: uuid,
        name: 'A',
        email: 'a@b.com',
        emailVerifiedAt: null,
        createdAt: now,
        updatedAt: now,
      }),
    );
    userRepository.getInternalIdByUuid.mockResolvedValue(7);
    challengeRepository.findLatestActiveForUser.mockResolvedValue({
      uuid: 'ch-1',
      codeHash: 'hash',
      expiresAt: new Date(Date.now() + 60000),
      attemptCount: EMAIL_VERIFICATION_MAX_ATTEMPTS,
    });

    await expect(useCase.execute({ email: 'a@b.com', code: '123456' })).rejects.toMatchObject({
      code: AUTH_API_ERROR_CODES.VERIFICATION_FAILED,
    });

    expect(codeHasher.verify).not.toHaveBeenCalled();
  });
});
