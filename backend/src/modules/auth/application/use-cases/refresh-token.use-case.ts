import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from 'src/common/errors/application';
import { REFRESH_TOKEN_REPOSITORY, SESSION_TOKEN_ISSUER, TOKEN_PROVIDER } from '../../di.tokens';
import { USER_REPOSITORY } from 'src/modules/users/di.tokens';
import type { TokenProviderPort } from '../../domain/ports/security/token-provider.port';
import type { RefreshTokenRepositoryPort } from '../../domain/ports/repository/refresh-token.repository.port';
import type { UserRepositoryPort } from 'src/modules/users/domain/ports/repository/user.repository.port';
import type {
  SessionTokenIssuerPort,
  SessionTokens,
} from '../../domain/ports/security/session-token-issuer.port';
import { AUTH_API_ERROR_CODES } from '../errors';

export type RefreshResult = SessionTokens;

const REFRESH_UNAUTHORIZED_MSG = 'Unauthorized';

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
      throw new ApplicationException(
        AUTH_API_ERROR_CODES.INVALID_REFRESH_TOKEN,
        REFRESH_UNAUTHORIZED_MSG,
      );
    }

    const tokenHash = this.tokenProvider.hashToken(rawRefreshToken);
    const stored = await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!stored) {
      throw new ApplicationException(
        AUTH_API_ERROR_CODES.INVALID_REFRESH_TOKEN,
        REFRESH_UNAUTHORIZED_MSG,
      );
    }

    if (stored.isRevoked) {
      await this.refreshTokenRepository.revokeByFamily(stored.familyId);
      throw new ApplicationException(
        AUTH_API_ERROR_CODES.INVALID_REFRESH_TOKEN,
        REFRESH_UNAUTHORIZED_MSG,
      );
    }

    if (stored.isExpired) {
      throw new ApplicationException(
        AUTH_API_ERROR_CODES.INVALID_REFRESH_TOKEN,
        REFRESH_UNAUTHORIZED_MSG,
      );
    }

    await this.refreshTokenRepository.revokeById(stored.id);

    const user = await this.userRepository.findByInternalId(stored.userId);
    if (!user) {
      throw new ApplicationException(
        AUTH_API_ERROR_CODES.INVALID_REFRESH_TOKEN,
        REFRESH_UNAUTHORIZED_MSG,
      );
    }

    return this.sessionTokenIssuer.issue({
      userUuid: user.id,
      email: user.email.value,
      internalUserId: stored.userId,
      familyId: stored.familyId,
    });
  }
}
