import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import type { TokenProviderPort } from '../../domain/ports/security/token-provider.port';
import type { RefreshTokenRepositoryPort } from '../../domain/ports/repository/refresh-token.repository.port';
import { SessionTokenIssuer } from './session-token-issuer.service';

describe('SessionTokenIssuer', () => {
  let issuer: SessionTokenIssuer;
  let tokenProvider: {
    signAccessToken: jest.Mock;
    generateRefreshToken: jest.Mock;
    hashToken: jest.Mock;
  };
  let refreshTokenRepository: { create: jest.Mock };
  let configService: { get: jest.Mock };

  const userUuid = randomUUID();
  const familyId = randomUUID();

  beforeEach(() => {
    tokenProvider = {
      signAccessToken: jest.fn().mockResolvedValue('access.jwt'),
      generateRefreshToken: jest.fn().mockReturnValue('refresh-raw'),
      hashToken: jest.fn().mockReturnValue('refresh-hash'),
    };
    refreshTokenRepository = { create: jest.fn().mockResolvedValue({}) };
    configService = {
      get: jest.fn().mockReturnValue({ refreshExpirationDays: 7 }),
    };

    issuer = new SessionTokenIssuer(
      tokenProvider as unknown as TokenProviderPort,
      refreshTokenRepository as unknown as RefreshTokenRepositoryPort,
      configService as unknown as ConfigService,
    );
  });

  it('signs access token, persists refresh, returns pair', async () => {
    const result = await issuer.issue({
      userUuid,
      email: 'a@b.com',
      internalUserId: 99,
      familyId,
    });

    expect(result).toEqual({ accessToken: 'access.jwt', refreshToken: 'refresh-raw' });
    expect(tokenProvider.signAccessToken).toHaveBeenCalledWith({
      sub: userUuid,
      email: 'a@b.com',
    });
    expect(tokenProvider.generateRefreshToken).toHaveBeenCalled();
    expect(tokenProvider.hashToken).toHaveBeenCalledWith('refresh-raw');
    expect(refreshTokenRepository.create).toHaveBeenCalled();
    const created = refreshTokenRepository.create.mock.calls[0][0];
    expect(created.familyId).toBe(familyId);
    expect(created.userId).toBe(99);
    expect(created.tokenHash).toBe('refresh-hash');
  });
});
