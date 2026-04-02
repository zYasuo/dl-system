import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { IAuthConfig } from 'src/modules/auth/config/auth.config';
import {
  PASSWORD_RESET_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
  SESSION_TOKEN_ISSUER,
  TOKEN_PROVIDER,
} from './di.tokens';
import { UsersModule } from '../users/users.module';
import { NotificationModule } from '../notifications/notification.module';
import { AuthController } from './infrastructure/inbound/http/controllers/auth.controller';
import { JwtAuthGuard } from './infrastructure/inbound/http/guards/jwt-auth.guard';
import { JwtTokenProvider } from './infrastructure/outbound/security/jwt-token-provider';
import { RefreshTokenRepository } from './infrastructure/outbound/persistence/repositories/refresh-token.repository';
import { PasswordResetRepository } from './infrastructure/outbound/persistence/repositories/password-reset.repository';
import { SessionTokenIssuer } from './application/services/session-token-issuer.service';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { RequestPasswordResetUseCase } from './application/use-cases/request-password-reset.use-case';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.use-case';
import { VerifyEmailOtpUseCase } from './application/use-cases/verify-email-otp.use-case';
import { ResendEmailVerificationUseCase } from './application/use-cases/resend-email-verification.use-case';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const auth = config.get<IAuthConfig>('auth');
        if (!auth?.jwtSecret?.trim()) {
          throw new Error('JWT_SECRET is required');
        }
        return {
          secret: auth.jwtSecret,
          signOptions: {
            expiresIn: auth.accessExpirationSeconds,
            algorithm: 'HS256',
          },
          verifyOptions: {
            algorithms: ['HS256'],
          },
        };
      },
    }),
    UsersModule,
    NotificationModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: SESSION_TOKEN_ISSUER,
      useClass: SessionTokenIssuer,
    },
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    RequestPasswordResetUseCase,
    ResetPasswordUseCase,
    VerifyEmailOtpUseCase,
    ResendEmailVerificationUseCase,
    JwtAuthGuard,
    {
      provide: TOKEN_PROVIDER,
      useClass: JwtTokenProvider,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenRepository,
    },
    {
      provide: PASSWORD_RESET_REPOSITORY,
      useClass: PasswordResetRepository,
    },
  ],
  exports: [JwtAuthGuard, TOKEN_PROVIDER],
})
export class AuthModule {}
