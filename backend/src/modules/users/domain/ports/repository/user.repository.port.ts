import { UserEntity } from '../../entities/user.entity';

export type CreateUserWithCredentialResult = {
  user: UserEntity;
  internalUserId: number;
};

export abstract class UserRepositoryPort {
  abstract create(user: UserEntity): Promise<UserEntity>;
  abstract createWithCredential(
    user: UserEntity,
    passwordHash: string,
  ): Promise<CreateUserWithCredentialResult>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findByUuid(uuid: string): Promise<UserEntity | null>;
  abstract findByInternalId(id: number): Promise<UserEntity | null>;
  abstract getInternalIdByUuid(uuid: string): Promise<number>;
  abstract setEmailVerifiedAt(internalId: number, verifiedAt: Date): Promise<void>;
}
