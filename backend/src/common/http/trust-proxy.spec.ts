import { getTrustProxySetting } from './trust-proxy';

describe('getTrustProxySetting', () => {
  const original = process.env.TRUST_PROXY;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.TRUST_PROXY;
    } else {
      process.env.TRUST_PROXY = original;
    }
  });

  it('returns false when unset', () => {
    delete process.env.TRUST_PROXY;
    expect(getTrustProxySetting()).toBe(false);
  });

  it('returns 1 for true or 1', () => {
    process.env.TRUST_PROXY = 'true';
    expect(getTrustProxySetting()).toBe(1);
    process.env.TRUST_PROXY = '1';
    expect(getTrustProxySetting()).toBe(1);
  });

  it('returns integer for numeric string', () => {
    process.env.TRUST_PROXY = '2';
    expect(getTrustProxySetting()).toBe(2);
  });

  it('returns false for invalid value', () => {
    process.env.TRUST_PROXY = '0';
    expect(getTrustProxySetting()).toBe(false);
    process.env.TRUST_PROXY = 'nope';
    expect(getTrustProxySetting()).toBe(false);
  });
});
