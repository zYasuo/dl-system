import { USER_API_ERROR_CODES } from '../errors';
import { randomUUID } from 'node:crypto';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../domain/ports/repository/user.repository.port';
import { PasswordHasherPort } from '../../domain/ports/security/password-hasher.port';
import type { EmailVerificationChallengeRepositoryPort } from '../../domain/ports/repository/email-verification-challenge.repository.port';
import type { EmailVerificationCodeHasherPort } from '../../domain/ports/security/email-verification-code-hasher.port';
import type { NotificationQueuePort } from 'src/modules/notifications/domain/ports/queue/notification-queue.port';
import { CreateUserUseCase } from './create-user.use-case';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<Pick<UserRepositoryPort, 'findByEmail' | 'createWithCredential'>>;
  let passwordHasher: jest.Mocked<Pick<PasswordHasherPort, 'hash'>>;
  let challengeRepository: jest.Mocked<
    Pick<EmailVerificationChallengeRepositoryPort, 'deletePendingForUser' | 'create'>
  >;
  let codeHasher: jest.Mocked<Pick<EmailVerificationCodeHasherPort, 'hash'>>;
  let notificationQueue: jest.Mocked<Pick<NotificationQueuePort, 'enqueueEmailVerificationOtp'>>;

  const now = new Date('2025-01-01T00:00:00.000Z');

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      createWithCredential: jest.fn(),
    };
    passwordHasher = {
      hash: jest.fn(),
    };
    challengeRepository = {
      deletePendingForUser: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockResolvedValue(undefined),
    };
    codeHasher = {
      hash: jest.fn().mockReturnValue('code-hash-hex'),
    };
    notificationQueue = {
      enqueueEmailVerificationOtp: jest.fn().mockResolvedValue(undefined),
    };
    useCase = new CreateUserUseCase(
      userRepository as unknown as UserRepositoryPort,
      passwordHasher as unknown as PasswordHasherPort,
      challengeRepository as unknown as EmailVerificationChallengeRepositoryPort,
      codeHasher as unknown as EmailVerificationCodeHasherPort,
      notificationQueue as unknown as NotificationQueuePort,
    );
  });

  it('throws when email already exists', async () => {
    userRepository.findByEmail.mockResolvedValue(
      UserEntity.create({
        id: randomUUID(),
        name: 'Existing',
        email: 'a@b.com',
        createdAt: now,
        updatedAt: now,
      }),
    );

    await expect(
      useCase.execute({
        name: 'New',
        email: 'a@b.com',
        password: 'password12',
      }),
    ).rejects.toMatchObject({ code: USER_API_ERROR_CODES.EMAIL_ALREADY_EXISTS });

    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(userRepository.createWithCredential).not.toHaveBeenCalled();
  });

  it('hashes password then persists user and credential atomically', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue('argon2-hash-value');

    const created = UserEntity.create({
      id: 'user-id-1',
      name: 'Alice',
      email: 'alice@example.com',
      emailVerifiedAt: null,
      createdAt: now,
      updatedAt: now,
    });
    userRepository.createWithCredential.mockResolvedValue({
      user: created,
      internalUserId: 42,
    });

    const result = await useCase.execute({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password12',
    });

    expect(passwordHasher.hash).toHaveBeenCalledWith('password12');
    expect(userRepository.createWithCredential).toHaveBeenCalled();
    const [userArg, hashArg] = userRepository.createWithCredential.mock.calls[0];
    expect(hashArg).toBe('argon2-hash-value');
    expect(userArg.email.value).toBe('alice@example.com');
    expect(result.emailVerifiedAt).toBeNull();
    expect(result.email.value).toBe('alice@example.com');
    expect(challengeRepository.deletePendingForUser).toHaveBeenCalledWith(42);
    expect(challengeRepository.create).toHaveBeenCalled();
    expect(codeHasher.hash).toHaveBeenCalled();
    expect(notificationQueue.enqueueEmailVerificationOtp).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-id-1',
        to: 'alice@example.com',
        name: 'Alice',
        expiresInMinutes: 15,
      }),
    );
  });

  it('propagates when atomic user+credential persistence fails', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue('hashed-password-ok');
    userRepository.createWithCredential.mockRejectedValue(new Error('transaction failed'));

    await expect(
      useCase.execute({
        name: 'Bob',
        email: 'bob@example.com',
        password: 'password12',
      }),
    ).rejects.toThrow('transaction failed');
  });
});
