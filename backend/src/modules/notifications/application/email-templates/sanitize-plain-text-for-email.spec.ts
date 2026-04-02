import {
  sanitizePlainTextEmailDisplay,
  sanitizePlainTextEmailOpaque,
} from './sanitize-plain-text-for-email';

describe('sanitizePlainTextEmailDisplay', () => {
  it('collapses newlines to spaces', () => {
    expect(sanitizePlainTextEmailDisplay('a\nb\rc')).toBe('a b c');
  });

  it('strips C0 control characters', () => {
    expect(sanitizePlainTextEmailDisplay('x\x01y')).toBe('xy');
  });

  it('removes unicode line separators', () => {
    expect(sanitizePlainTextEmailDisplay('a\u2028b')).toBe('a b');
  });
});

describe('sanitizePlainTextEmailOpaque', () => {
  it('removes newlines without adding spaces', () => {
    expect(sanitizePlainTextEmailOpaque('ab\ncd')).toBe('abcd');
  });

  it('strips control characters from token-like strings', () => {
    expect(sanitizePlainTextEmailOpaque('tok\x00en')).toBe('token');
  });
});
