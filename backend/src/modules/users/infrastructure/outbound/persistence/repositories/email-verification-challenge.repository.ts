import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import type { ActiveEmailVerificationChallengeRow } from 'src/modules/users/domain/ports/repository/email-verification-challenge.repository.port';
import { EmailVerificationChallengeRepositoryPort } from 'src/modules/users/domain/ports/repository/email-verification-challenge.repository.port';

@Injectable()
export class EmailVerificationChallengeRepository extends EmailVerificationChallengeRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async deletePendingForUser(userInternalId: number): Promise<void> {
    await this.prisma.emailVerificationChallenge.deleteMany({
      where: { userId: userInternalId, consumedAt: null },
    });
  }

  async create(params: {
    uuid: string;
    userInternalId: number;
    codeHash: string;
    expiresAt: Date;
  }): Promise<void> {
    await this.prisma.emailVerificationChallenge.create({
      data: {
        uuid: params.uuid,
        userId: params.userInternalId,
        codeHash: params.codeHash,
        expiresAt: params.expiresAt,
        attemptCount: 0,
      },
    });
  }

  async findLatestActiveForUser(
    userInternalId: number,
  ): Promise<ActiveEmailVerificationChallengeRow | null> {
    const now = new Date();
    const row = await this.prisma.emailVerificationChallenge.findFirst({
      where: {
        userId: userInternalId,
        consumedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!row) {
      return null;
    }

    return {
      uuid: row.uuid,
      codeHash: row.codeHash,
      expiresAt: row.expiresAt,
      attemptCount: row.attemptCount,
    };
  }

  async incrementAttempts(challengeUuid: string): Promise<void> {
    await this.prisma.emailVerificationChallenge.updateMany({
      where: { uuid: challengeUuid },
      data: { attemptCount: { increment: 1 } },
    });
  }

  async markConsumed(challengeUuid: string): Promise<void> {
    await this.prisma.emailVerificationChallenge.updateMany({
      where: { uuid: challengeUuid },
      data: { consumedAt: new Date() },
    });
  }
}
