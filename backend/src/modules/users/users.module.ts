import { Module } from '@nestjs/common';
import { DbModule } from 'src/modules/users/infrastructure/outbound/persistence/db/db.module';
import { UserController } from 'src/modules/users/infrastructure/inbound/http/controllers/user.controller';
import { CreateUserUseCase } from 'src/modules/users/application/use-cases/create-user.use-case';
import { UserRepository } from 'src/modules/users/infrastructure/outbound/persistence/repositories/user.repository';
import { UserCredentialRepository } from 'src/modules/users/infrastructure/outbound/persistence/repositories/user-credential.repository';
import { Argon2PasswordHasher } from 'src/modules/users/infrastructure/outbound/security/argon2-password-hasher.security';
import { EmailVerificationChallengeRepository } from 'src/modules/users/infrastructure/outbound/persistence/repositories/email-verification-challenge.repository';
import { EmailVerificationCodeHasher } from 'src/modules/users/infrastructure/outbound/security/email-verification-code-hasher.security';
import { NotificationModule } from 'src/modules/notifications/notification.module';
import {
  EMAIL_VERIFICATION_CHALLENGE_REPOSITORY,
  EMAIL_VERIFICATION_CODE_HASHER,
  PASSWORD_HASHER,
  USER_CREDENTIAL_REPOSITORY,
  USER_REPOSITORY,
} from './di.tokens';

@Module({
  imports: [DbModule, NotificationModule],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: USER_CREDENTIAL_REPOSITORY,
      useClass: UserCredentialRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: Argon2PasswordHasher,
    },
    {
      provide: EMAIL_VERIFICATION_CHALLENGE_REPOSITORY,
      useClass: EmailVerificationChallengeRepository,
    },
    {
      provide: EMAIL_VERIFICATION_CODE_HASHER,
      useClass: EmailVerificationCodeHasher,
    },
  ],
  exports: [
    USER_REPOSITORY,
    USER_CREDENTIAL_REPOSITORY,
    PASSWORD_HASHER,
    EMAIL_VERIFICATION_CHALLENGE_REPOSITORY,
    EMAIL_VERIFICATION_CODE_HASHER,
  ],
})
export class UsersModule {}
