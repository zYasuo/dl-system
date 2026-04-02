import { randomUUID } from 'node:crypto';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import type { UserRepositoryPort } from 'src/modules/users/domain/ports/repository/user.repository.port';
import type { EmailVerificationChallengeRepositoryPort } from 'src/modules/users/domain/ports/repository/email-verification-challenge.repository.port';
import type { EmailVerificationCodeHasherPort } from 'src/modules/users/domain/ports/security/email-verification-code-hasher.port';
import type { NotificationQueuePort } from 'src/modules/notifications/domain/ports/queue/notification-queue.port';
import { ResendEmailVerificationUseCase } from './resend-email-verification.use-case';

describe('ResendEmailVerificationUseCase', () => {
  let useCase: ResendEmailVerificationUseCase;
  let userRepository: {
    findByEmail: jest.Mock;
    getInternalIdByUuid: jest.Mock;
  };
  let challengeRepository: {
    deletePendingForUser: jest.Mock;
    create: jest.Mock;
  };
  let codeHasher: { hash: jest.Mock };
  let notificationQueue: { enqueueEmailVerificationOtp: jest.Mock };

  const now = new Date('2025-01-01T00:00:00.000Z');
  const uuid = randomUUID();

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      getInternalIdByUuid: jest.fn(),
    };
    challengeRepository = {
      deletePendingForUser: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockResolvedValue(undefined),
    };
    codeHasher = { hash: jest.fn().mockReturnValue('h') };
    notificationQueue = { enqueueEmailVerificationOtp: jest.fn().mockResolvedValue(undefined) };
    useCase = new ResendEmailVerificationUseCase(
      userRepository as unknown as UserRepositoryPort,
      challengeRepository as unknown as EmailVerificationChallengeRepositoryPort,
      codeHasher as unknown as EmailVerificationCodeHasherPort,
      notificationQueue as unknown as NotificationQueuePort,
    );
  });

  it('returns same message when user missing', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    const msg = await useCase.execute({ email: 'nope@example.com' });
    expect(msg).toContain('registered');
    expect(notificationQueue.enqueueEmailVerificationOtp).not.toHaveBeenCalled();
  });

  it('returns same message when already verified', async () => {
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
    const msg = await useCase.execute({ email: 'a@b.com' });
    expect(msg).toContain('registered');
    expect(notificationQueue.enqueueEmailVerificationOtp).not.toHaveBeenCalled();
  });

  it('rotates challenge and enqueues when eligible', async () => {
    userRepository.findByEmail.mockResolvedValue(
      UserEntity.create({
        id: uuid,
        name: 'Ann',
        email: 'a@b.com',
        emailVerifiedAt: null,
        createdAt: now,
        updatedAt: now,
      }),
    );
    userRepository.getInternalIdByUuid.mockResolvedValue(3);

    const msg = await useCase.execute({ email: 'a@b.com' });

    expect(msg).toContain('registered');
    expect(challengeRepository.deletePendingForUser).toHaveBeenCalledWith(3);
    expect(challengeRepository.create).toHaveBeenCalled();
    expect(notificationQueue.enqueueEmailVerificationOtp).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: uuid,
        to: 'a@b.com',
        name: 'Ann',
        expiresInMinutes: 15,
      }),
    );
  });
});
