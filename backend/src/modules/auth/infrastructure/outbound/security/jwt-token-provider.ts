import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';
import {
  TokenProviderPort,
  type AccessTokenPayload,
} from 'src/modules/auth/domain/ports/security/token-provider.port';

@Injectable()
export class JwtTokenProvider extends TokenProviderPort {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return this.jwtService.verifyAsync<AccessTokenPayload>(token);
  }

  generateRefreshToken(): string {
    return randomBytes(32).toString('hex');
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
