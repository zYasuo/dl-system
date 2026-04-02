import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REFRESH_TOKEN_REPOSITORY, TOKEN_PROVIDER } from '../../di.tokens';
import type { TokenProviderPort } from '../../domain/ports/security/token-provider.port';
import type { RefreshTokenRepositoryPort } from '../../domain/ports/repository/refresh-token.repository.port';
import {
  SessionTokenIssuerPort,
  type IssueSessionTokensInput,
  type SessionTokens,
} from '../../domain/ports/security/session-token-issuer.port';
import { RefreshTokenEntity } from '../../domain/entities/refresh-token.entity';
import type { IAuthConfig } from 'src/modules/auth/config/auth.config';

@Injectable()
export class SessionTokenIssuer extends SessionTokenIssuerPort {
  constructor(
    @Inject(TOKEN_PROVIDER) private readonly tokenProvider: TokenProviderPort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  override async issue(input: IssueSessionTokensInput): Promise<SessionTokens> {
    const accessToken = await this.tokenProvider.signAccessToken({
      sub: input.userUuid,
      email: input.email,
    });

    const rawRefreshToken = this.tokenProvider.generateRefreshToken();
    const tokenHash = this.tokenProvider.hashToken(rawRefreshToken);
    const authConfig = this.configService.get<IAuthConfig>('auth')!;
    const expiresAt = new Date(Date.now() + authConfig.refreshExpirationDays * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.create(
      RefreshTokenEntity.create({
        id: 0,
        tokenHash,
        familyId: input.familyId,
        userId: input.internalUserId,
        expiresAt,
        revokedAt: null,
        createdAt: new Date(),
      }),
    );

    return { accessToken, refreshToken: rawRefreshToken };
  }
}
