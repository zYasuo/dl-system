export function getTrustProxySetting(): number | false {
  const v = process.env.TRUST_PROXY?.trim();
  if (!v) return false;
  const lower = v.toLowerCase();
  if (lower === 'true' || lower === '1') return 1;
  const n = parseInt(v, 10);
  if (!Number.isNaN(n) && n >= 1) return n;
  return false;
}
