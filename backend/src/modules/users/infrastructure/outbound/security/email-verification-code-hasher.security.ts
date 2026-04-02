import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, timingSafeEqual } from 'node:crypto';
import type { IEmailConfig } from 'src/modules/notifications/config/email.config';
import { EmailVerificationCodeHasherPort } from 'src/modules/users/domain/ports/security/email-verification-code-hasher.port';

@Injectable()
export class EmailVerificationCodeHasher extends EmailVerificationCodeHasherPort {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  private digestBytes(code: string, challengeUuid: string): Buffer {
    const pepper = this.configService.get<IEmailConfig>('email')?.otpPepper ?? '';
    return createHash('sha256').update(`${challengeUuid}:${code}:${pepper}`, 'utf8').digest();
  }

  hash(code: string, challengeUuid: string): string {
    return this.digestBytes(code, challengeUuid).toString('hex');
  }

  verify(code: string, challengeUuid: string, codeHash: string): boolean {
    const expected = this.digestBytes(code, challengeUuid);
    const expectedHexLen = expected.length * 2;
    if (codeHash.length !== expectedHexLen) {
      return false;
    }
    const stored = Buffer.from(codeHash, 'hex');
    if (stored.length !== expected.length) {
      return false;
    }
    return timingSafeEqual(expected, stored);
  }
}
