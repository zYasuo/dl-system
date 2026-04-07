import { Injectable } from '@nestjs/common';
import { ApplicationException } from 'src/common/errors/application';
import { USER_API_ERROR_CODES } from 'src/modules/users/application/errors';
import {
  UserRepositoryPort,
  type CreateUserWithCredentialResult,
} from 'src/modules/users/domain/ports/repository/user.repository.port';
import { PrismaService } from 'nestjs-prisma';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

@Injectable()
export class UserRepository extends UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const row = await this.prisma.user.create({
      data: {
        uuid: user.id,
        name: user.name.value,
        email: user.email.value,
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    return UserEntity.create({
      id: row.uuid,
      name: row.name,
      email: row.email,
      emailVerifiedAt: row.emailVerifiedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async createWithCredential(
    user: UserEntity,
    passwordHash: string,
  ): Promise<CreateUserWithCredentialResult> {
    const row = await this.prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          uuid: user.id,
          name: user.name.value,
          email: user.email.value,
          emailVerifiedAt: user.emailVerifiedAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });

      await tx.userCredential.create({
        data: {
          userId: u.id,
          passwordHash,
        },
      });

      return u;
    });

    return {
      internalUserId: row.id,
      user: UserEntity.create({
        id: row.uuid,
        name: row.name,
        email: row.email,
        emailVerifiedAt: row.emailVerifiedAt,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }),
    };
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const row = await this.prisma.user.findUnique({ where: { email } });

    if (!row) {
      return null;
    }

    return UserEntity.create({
      id: row.uuid,
      name: row.name,
      email: row.email,
      emailVerifiedAt: row.emailVerifiedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findByUuid(uuid: string): Promise<UserEntity | null> {
    const row = await this.prisma.user.findUnique({ where: { uuid } });

    if (!row) {
      return null;
    }

    return UserEntity.create({
      id: row.uuid,
      name: row.name,
      email: row.email,
      emailVerifiedAt: row.emailVerifiedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findByInternalId(id: number): Promise<UserEntity | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });

    if (!row) {
      return null;
    }

    return UserEntity.create({
      id: row.uuid,
      name: row.name,
      email: row.email,
      emailVerifiedAt: row.emailVerifiedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async getInternalIdByUuid(uuid: string): Promise<number> {
    const row = await this.prisma.user.findUnique({
      where: { uuid },
      select: { id: true },
    });

    if (!row) {
      throw new ApplicationException(USER_API_ERROR_CODES.NOT_FOUND, 'User not found');
    }

    return row.id;
  }

  async setEmailVerifiedAt(internalId: number, verifiedAt: Date): Promise<void> {
    await this.prisma.user.update({
      where: { id: internalId },
      data: { emailVerifiedAt: verifiedAt },
    });
  }
}
