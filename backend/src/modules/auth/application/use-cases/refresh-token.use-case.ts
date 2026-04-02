import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { REFRESH_TOKEN_REPOSITORY, SESSION_TOKEN_ISSUER, TOKEN_PROVIDER } from '../../di.tokens';
import { USER_REPOSITORY } from 'src/modules/users/di.tokens';
import type { TokenProviderPort } from '../../domain/ports/security/token-provider.port';
import type { RefreshTokenRepositoryPort } from '../../domain/ports/repository/refresh-token.repository.port';
import type { UserRepositoryPort } from 'src/modules/users/domain/ports/repository/user.repository.port';
import type {
  SessionTokenIssuerPort,
  SessionTokens,
} from '../../domain/ports/security/session-token-issuer.port';

export type RefreshResult = SessionTokens;

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(TOKEN_PROVIDER) private readonly tokenProvider: TokenProviderPort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    @Inject(SESSION_TOKEN_ISSUER)
    private readonly sessionTokenIssuer: SessionTokenIssuerPort,
  ) {}

  async execute(rawRefreshToken: string): Promise<RefreshResult> {
    if (!rawRefreshToken?.trim()) {
      throw new UnauthorizedException();
    }

    const tokenHash = this.tokenProvider.hashToken(rawRefreshToken);
    const stored = await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!stored) {
      throw new UnauthorizedException();
    }

    if (stored.isRevoked) {
      await this.refreshTokenRepository.revokeByFamily(stored.familyId);
      throw new UnauthorizedException();
    }

    if (stored.isExpired) {
      throw new UnauthorizedException();
    }

    await this.refreshTokenRepository.revokeById(stored.id);

    const user = await this.userRepository.findByInternalId(stored.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.sessionTokenIssuer.issue({
      userUuid: user.id,
      email: user.email.value,
      internalUserId: stored.userId,
      familyId: stored.familyId,
    });
  }
}
