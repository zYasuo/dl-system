import { ConfigService } from '@nestjs/config';
import { EmailVerificationCodeHasher } from './email-verification-code-hasher.security';
import type { IEmailConfig } from 'src/modules/notifications/config/email.config';

describe('EmailVerificationCodeHasher', () => {
  const challengeUuid = '11111111-1111-1111-1111-111111111111';

  function makeHasher(pepper = '') {
    const configService = {
      get: jest.fn((key: string): IEmailConfig | undefined =>
        key === 'email' ? { resendApiKey: '', emailFrom: '', otpPepper: pepper } : undefined,
      ),
    };
    return new EmailVerificationCodeHasher(configService as unknown as ConfigService);
  }

  it('verify returns true when code matches stored hex hash', () => {
    const hasher = makeHasher();
    const code = '123456';
    const stored = hasher.hash(code, challengeUuid);
    expect(stored).toMatch(/^[0-9a-f]{64}$/);
    expect(hasher.verify(code, challengeUuid, stored)).toBe(true);
  });

  it('verify returns false for wrong code', () => {
    const hasher = makeHasher();
    const stored = hasher.hash('123456', challengeUuid);
    expect(hasher.verify('654321', challengeUuid, stored)).toBe(false);
  });

  it('stored hash is 64 hex chars; verify decodes with hex encoding', () => {
    const hasher = makeHasher();
    const stored = hasher.hash('000000', challengeUuid);
    expect(stored).toHaveLength(64);
    expect(Buffer.from(stored, 'hex')).toHaveLength(32);
    expect(hasher.verify('000000', challengeUuid, stored)).toBe(true);
  });

  it('pepper changes the digest', () => {
    const a = makeHasher('a');
    const b = makeHasher('b');
    expect(a.hash('123456', challengeUuid)).not.toBe(b.hash('123456', challengeUuid));
  });

  it('verify returns false when hex length does not match digest', () => {
    const hasher = makeHasher();
    expect(hasher.verify('123456', challengeUuid, 'abcd')).toBe(false);
  });
});
