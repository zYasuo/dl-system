import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserCredentialRepositoryPort } from 'src/modules/users/domain/ports/repository/user-credential.repository.port';
import {
  UserCredentialEntity,
  type CreateUserCredentialInput,
} from 'src/modules/users/domain/entities/user-credential.entity';
import {
  LOGIN_LOCKOUT_DURATION_MS,
  LOGIN_MAX_FAILED_ATTEMPTS,
} from 'src/modules/users/application/constants/login-lockout.constants';

@Injectable()
export class UserCredentialRepository extends UserCredentialRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(input: CreateUserCredentialInput): Promise<UserCredentialEntity> {
    const row = await this.prisma.userCredential.create({
      data: {
        userId: input.userId,
        passwordHash: input.passwordHash,
      },
    });

    return UserCredentialEntity.create({
      id: row.id,
      userId: row.userId,
      passwordHash: row.passwordHash,
      failedLoginAttempts: row.failedLoginAttempts,
      lockedUntil: row.lockedUntil,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findByUserId(userId: number): Promise<UserCredentialEntity | null> {
    const row = await this.prisma.userCredential.findUnique({ where: { userId } });

    if (!row) {
      return null;
    }

    return UserCredentialEntity.create({
      id: row.id,
      userId: row.userId,
      passwordHash: row.passwordHash,
      failedLoginAttempts: row.failedLoginAttempts,
      lockedUntil: row.lockedUntil,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async updatePasswordHash(userId: number, hash: string): Promise<void> {
    await this.prisma.userCredential.update({
      where: { userId },
      data: { passwordHash: hash },
    });
  }

  async recordFailedLoginAttempt(userId: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const updated = await tx.userCredential.update({
        where: { userId },
        data: { failedLoginAttempts: { increment: 1 } },
        select: { failedLoginAttempts: true },
      });

      if (updated.failedLoginAttempts >= LOGIN_MAX_FAILED_ATTEMPTS) {
        await tx.userCredential.update({
          where: { userId },
          data: { lockedUntil: new Date(Date.now() + LOGIN_LOCKOUT_DURATION_MS) },
        });
      }
    });
  }

  async clearLoginLockout(userId: number): Promise<void> {
    await this.prisma.userCredential.update({
      where: { userId },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });
  }
}
